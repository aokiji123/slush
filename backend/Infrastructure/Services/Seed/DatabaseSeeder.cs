using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using Application.DTOs.External;
using Application.Interfaces;
using Domain.Entities;
using Domain.Extensions;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Infrastructure.Services.Seed;

public class DatabaseSeeder : IDatabaseSeeder
{
    private readonly AppDbContext _dbContext;
    private readonly IFreeToGameClient _client;
    private readonly ILogger<DatabaseSeeder> _logger;

    public DatabaseSeeder(AppDbContext dbContext, IFreeToGameClient client, ILogger<DatabaseSeeder> logger)
    {
        _dbContext = dbContext;
        _client = client;
        _logger = logger;
    }

    public async Task SeedAsync(IEnumerable<int> ids)
    {
        var idList = (ids?.ToList() ?? new List<int> { 452 }).Distinct().ToList();
        _logger.LogInformation("Starting seeding for {Count} id(s): {Ids}", idList.Count, string.Join(",", idList));

        foreach (var id in idList)
        {
            try
            {
                var dto = await _client.GetGameAsync(id);
                if (dto == null || string.IsNullOrWhiteSpace(dto.Title))
                {
                    _logger.LogWarning("Skipping id {Id}: no data or missing title", id);
                    continue;
                }

                await UpsertGameAsync(dto);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to seed game id {Id}", id);
            }
        }

        _logger.LogInformation("Seeding completed");
    }

    private async Task UpsertGameAsync(FreeToGameGameDto dto)
    {
        var slug = Slugify(dto.Title);
        var game = await _dbContext.Games.FirstOrDefaultAsync(g => g.Slug == slug);
        var isNew = game == null;
        if (isNew)
        {
            game = new Game
            {
                Id = Guid.NewGuid(),
                Slug = slug,
                Price = 0,
                SalePrice = 0,
                DiscountPercent = 0,
                Rating = 0,
                IsDlc = false,
                BaseGameId = null
            };
            _dbContext.Games.Add(game);
        }
        else if (game == null)
        {
            throw new InvalidOperationException("Game entity could not be loaded or created.");
        }

        // Ensure translation fields are initialized
        game.NameTranslations ??= "{}";
        game.DescriptionTranslations ??= "{}";
        game.DeveloperTranslations ??= "{}";
        game.PublisherTranslations ??= "{}";
        game.GenreTranslations ??= "{}";

        // Translations (set both uk and en)
        var title = dto.Title?.Trim() ?? string.Empty;
        game!.NameTranslations = game.NameTranslations.SetTranslation("uk", title).SetTranslation("en", title);

        var description = string.IsNullOrWhiteSpace(dto.Description) ? dto.Short_Description : dto.Description;
        description = description?.Trim() ?? string.Empty;
        game.DescriptionTranslations = game.DescriptionTranslations.SetTranslation("uk", description).SetTranslation("en", description);

        var developer = dto.Developer?.Trim() ?? string.Empty;
        game.DeveloperTranslations = game.DeveloperTranslations.SetTranslation("uk", developer).SetTranslation("en", developer);

        var publisher = dto.Publisher?.Trim() ?? string.Empty;
        game.PublisherTranslations = game.PublisherTranslations.SetTranslation("uk", publisher).SetTranslation("en", publisher);

        var genreList = string.IsNullOrWhiteSpace(dto.Genre) ? new List<string>() : new List<string> { dto.Genre.Trim() };
        game.GenreTranslations = game.GenreTranslations.SetTranslationArray("uk", genreList).SetTranslationArray("en", genreList);

        // Dates (ensure UTC for timestamptz)
        if (DateTimeOffset.TryParse(dto.Release_Date, CultureInfo.InvariantCulture, DateTimeStyles.AssumeUniversal | DateTimeStyles.AdjustToUniversal, out var releaseOffset))
        {
            game.ReleaseDate = releaseOffset.UtcDateTime;
        }
        else
        {
            game.ReleaseDate = DateTime.UtcNow.Date;
        }

        // Images
        var images = new List<string>();
        if (!string.IsNullOrWhiteSpace(dto.Thumbnail)) images.Add(dto.Thumbnail);
        if (dto.Screenshots != null && dto.Screenshots.Count > 0)
        {
            images.AddRange(dto.Screenshots.Where(s => !string.IsNullOrWhiteSpace(s.Image)).Select(s => s.Image));
        }
        game.MainImage = images.FirstOrDefault() ?? game.MainImage;
        game.Images = images.Distinct().ToList();

        // Platforms normalization
        game.Platforms = NormalizePlatforms(dto.Platform);

        // Save game first to ensure we have an Id
        await _dbContext.SaveChangesAsync();

        // Seed platform-specific characteristics and console features
        await UpsertGameCharacteristicsAsync(game, dto);
        await UpsertGameConsoleFeaturesAsync(game);

        await _dbContext.SaveChangesAsync();

        _logger.LogInformation("{Action} game '{Title}' (Slug={Slug})", isNew ? "Inserted" : "Updated", title, slug);
    }

    private async Task UpsertGameCharacteristicsAsync(Game game, FreeToGameGameDto dto)
    {
        var existing = await _dbContext.GameCharacteristics
            .Where(gc => gc.GameId == game.Id)
            .ToListAsync();
        if (existing.Count > 0)
        {
            _dbContext.GameCharacteristics.RemoveRange(existing);
        }

        foreach (var platform in game.Platforms)
        {
            var characteristic = new GameCharacteristic
            {
                Id = Guid.NewGuid(),
                GameId = game.Id,
                Platform = platform,
                LangAudio = new List<string> { "en" },
                LangText = new List<string> { "en", "uk" }
            };

            if (string.Equals(platform, "PC", StringComparison.OrdinalIgnoreCase) && dto.Minimum_System_Requirements != null)
            {
                var req = dto.Minimum_System_Requirements;
                characteristic.MinVersion = req.Os;
                characteristic.MinCpu = req.Processor;
                characteristic.MinRam = req.Memory;
                characteristic.MinGpu = req.Graphics;
                characteristic.MinMemory = req.Storage;

                characteristic.RecommendedVersion = req.Os;
                characteristic.RecommendedCpu = EnhanceCpu(req.Processor);
                characteristic.RecommendedRam = EnhanceRam(req.Memory);
                characteristic.RecommendedGpu = EnhanceGpu(req.Graphics);
                characteristic.RecommendedMemory = req.Storage;
            }
            else if (string.Equals(platform, "Browser", StringComparison.OrdinalIgnoreCase))
            {
                characteristic.MinVersion = "Any modern browser (Chrome, Firefox, Safari)";
            }

            _dbContext.GameCharacteristics.Add(characteristic);
        }

        _logger.LogInformation("Added {Count} GameCharacteristics for platforms: {Platforms}", game.Platforms.Count, string.Join(", ", game.Platforms));
    }

    private async Task UpsertGameConsoleFeaturesAsync(Game game)
    {
        var existing = await _dbContext.GameConsoleFeatures
            .Where(cf => cf.GameId == game.Id)
            .ToListAsync();
        if (existing.Count > 0)
        {
            _dbContext.GameConsoleFeatures.RemoveRange(existing);
        }

        var consolePlatforms = game.Platforms.Where(IsConsole).ToList();
        foreach (var platform in consolePlatforms)
        {
            var feature = CreateConsoleFeaturesForPlatform(game.Id, platform);
            _dbContext.GameConsoleFeatures.Add(feature);
        }

        _logger.LogInformation("Added {Count} GameConsoleFeatures", consolePlatforms.Count);
    }

    private static bool IsConsole(string platform)
    {
        if (string.IsNullOrWhiteSpace(platform)) return false;
        var p = platform.Trim().ToLowerInvariant();
        return p is "ps4" or "playstation 4" or "ps5" or "playstation 5" or "xbox one" or "xbox series x" or "xbox series s";
    }

    private static GameConsoleFeature CreateConsoleFeaturesForPlatform(Guid gameId, string platform)
    {
        var p = platform.Trim().ToLowerInvariant();
        return p switch
        {
            "ps5" or "playstation 5" => new GameConsoleFeature
            {
                GameId = gameId,
                Platform = "PS5",
                Resolution = "4K (2160p)",
                FrameRate = "60 FPS",
                HDRSupport = true,
                RayTracingSupport = true,
                StorageRequired = "20 GB",
                ControllerFeatures = "DualSense haptic feedback, adaptive triggers"
            },
            "ps4" or "playstation 4" => new GameConsoleFeature
            {
                GameId = gameId,
                Platform = "PS4",
                Resolution = "1080p",
                FrameRate = "30 FPS",
                HDRSupport = false,
                RayTracingSupport = false,
                StorageRequired = "15 GB",
                ControllerFeatures = "DualShock 4"
            },
            "xbox series x" => new GameConsoleFeature
            {
                GameId = gameId,
                Platform = "Xbox Series X",
                Resolution = "4K (2160p)",
                FrameRate = "120 FPS",
                HDRSupport = true,
                RayTracingSupport = true,
                StorageRequired = "22 GB",
                ControllerFeatures = "Xbox Wireless Controller"
            },
            "xbox series s" => new GameConsoleFeature
            {
                GameId = gameId,
                Platform = "Xbox Series S",
                Resolution = "1440p",
                FrameRate = "60 FPS",
                HDRSupport = true,
                RayTracingSupport = false,
                StorageRequired = "18 GB",
                ControllerFeatures = "Xbox Wireless Controller"
            },
            "xbox one" => new GameConsoleFeature
            {
                GameId = gameId,
                Platform = "Xbox One",
                Resolution = "1080p",
                FrameRate = "30 FPS",
                HDRSupport = false,
                RayTracingSupport = false,
                StorageRequired = "15 GB",
                ControllerFeatures = "Xbox One Controller"
            },
            _ => new GameConsoleFeature { GameId = gameId, Platform = platform }
        };
    }

    private static string EnhanceCpu(string value)
    {
        if (string.IsNullOrWhiteSpace(value)) return string.Empty;
        return $"{value} (or better)";
    }

    private static string EnhanceRam(string value)
    {
        if (string.IsNullOrWhiteSpace(value)) return string.Empty;
        return value.Replace("4", "8").Replace("8", "16");
    }

    private static string EnhanceGpu(string value)
    {
        if (string.IsNullOrWhiteSpace(value)) return string.Empty;
        return $"{value} (recommended)";
    }
    private static List<string> NormalizePlatforms(string platform)
    {
        if (string.IsNullOrWhiteSpace(platform)) return new List<string>();
        var parts = platform
            .Replace(" and ", ",", StringComparison.OrdinalIgnoreCase)
            .Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
            .ToList();

        return parts.Select(p => p
                .Replace("PC (Windows)", "PC", StringComparison.OrdinalIgnoreCase)
                .Replace("Web Browser", "Browser", StringComparison.OrdinalIgnoreCase))
            .Distinct()
            .ToList();
    }

    private static string Slugify(string input)
    {
        if (string.IsNullOrWhiteSpace(input)) return string.Empty;
        var s = new string(input.ToLowerInvariant()
            .Select(ch => char.IsLetterOrDigit(ch) ? ch : '-')
            .ToArray());
        while (s.Contains("--", StringComparison.Ordinal)) s = s.Replace("--", "-");
        return s.Trim('-');
    }
}


