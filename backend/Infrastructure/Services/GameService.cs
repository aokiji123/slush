using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using Application.Common.Query;
using Application.DTOs;
using Application.Interfaces;
using Domain.Entities;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Infrastructure.Repositories;

namespace Infrastructure.Services;

public class GameService : IGameService
{
    private readonly AppDbContext _db;

    public GameService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<GameDto?> GetGameByIdAsync(Guid id, string language = "uk")
    {
        var game = await _db.Set<Game>()
            .AsNoTracking()
            .Where(g => g.Id == id)
            .FirstOrDefaultAsync();
        
        return game != null ? GameDto.FromEntity(game, language) : null;
    }

    public async Task<IEnumerable<GameDto>> SearchAsync(string? genre, string? platform, decimal? priceUpperBound, string language = "uk")
    {
        var query = _db.Set<Game>().AsNoTracking().AsQueryable();

        if (priceUpperBound.HasValue)
        {
            query = query.Where(g => g.Price <= priceUpperBound.Value);
        }

        if (!string.IsNullOrWhiteSpace(genre))
        {
            var searchGenre = genre.ToLower();
            query = query.Where(g => g.Genre.Any(x => x.ToLower() == searchGenre));
        }

        if (!string.IsNullOrWhiteSpace(platform))
        {
            var searchPlatform = platform.ToLower();
            query = query.Where(g => g.Platforms.Any(x => x.ToLower() == searchPlatform));
        }

        var games = await query.ToListAsync();
        return games.Select(g => GameDto.FromEntity(g, language));
    }

    public async Task<IEnumerable<GameDto>> GetDiscountedAsync(string language = "uk")
    {
        var games = await _db.Set<Game>()
            .AsNoTracking()
            .Where(g => g.SalePrice > 0 && g.SalePrice < g.Price)
            .OrderByDescending(g => (g.Price - g.SalePrice) / g.Price)
            .ToListAsync();
        
        return games.Select(g => GameDto.FromEntity(g, language));
    }

    public async Task<IEnumerable<GameDto>> GetTopPopularGamesAsync(int top, string language = "uk")
    {
        var take = Math.Clamp(top, 1, 100);

        var games = await _db.Set<Game>()
            .AsNoTracking()
            .OrderByDescending(g => g.Rating)
            .ThenByDescending(g => g.SalePrice > 0 && g.SalePrice < g.Price ? (g.Price - g.SalePrice) / g.Price : 0)
            .Take(take)
            .ToListAsync();
        
        return games.Select(g => GameDto.FromEntity(g, language));
    }

    public async Task<IEnumerable<BannerGameDto>> GetBannerGamesAsync(string language = "uk")
    {
        const int defaultBannerCount = 5;

        var games = await _db.Set<Game>()
            .AsNoTracking()
            .OrderByDescending(g => g.SalePrice > 0 && g.SalePrice < g.Price ? (g.Price - g.SalePrice) / g.Price : 0)
            .ThenByDescending(g => g.Rating)
            .Take(defaultBannerCount)
            .ToListAsync();

        return games.Select(g => new BannerGameDto
        {
            Id = g.Id,
            Name = g.GetLocalizedName(language),
            Description = g.GetLocalizedDescription(language),
            Image = g.MainImage,
            Price = (double)g.Price,
            GameImages = g.Images,
            OldPrice = g.SalePrice > 0 && g.SalePrice < g.Price ? (double?)g.Price : null,
            SalePercent = g.SalePrice > 0 && g.SalePrice < g.Price
                ? (int)Math.Round((double)((g.Price - g.SalePrice) / g.Price * 100m))
                : 0,
            SaleEndDate = g.SaleDate
        });
    }

    public async Task<IEnumerable<GameDto>> GetSpecialOfferGamesAsync(int page, int limit, string sort, string language = "uk")
    {
        var parameters = CreateParameters(page, limit, sort);

        var games = await _db.Set<Game>()
            .AsNoTracking()
            .Where(g => g.SalePrice > 0 && g.SalePrice < g.Price)
            .ApplySorting(parameters)
            .ApplyPagination(parameters)
            .ToListAsync();

        var gameDtos = games.Select(g => GameDto.FromEntity(g, language));

        // Handle name sorting client-side if needed
        if (parameters.SortBy?.ToLowerInvariant() is "alphabet" or "name")
        {
            var isDescending = parameters.SortDirection?.ToLowerInvariant() == "desc";
            gameDtos = isDescending 
                ? gameDtos.OrderByDescending(g => g.Name)
                : gameDtos.OrderBy(g => g.Name);
        }

        return gameDtos;
    }

    public async Task<IEnumerable<GameDto>> GetNewAndTrendingGamesAsync(int page, int limit, string sort, string language = "uk")
    {
        var parameters = CreateParameters(page, limit, string.IsNullOrWhiteSpace(sort) ? "publish_date" : sort);

        var games = await _db.Set<Game>()
            .AsNoTracking()
            .ApplySorting(parameters)
            .ApplyPagination(parameters)
            .ToListAsync();

        var gameDtos = games.Select(g => GameDto.FromEntity(g, language));

        // Handle name sorting client-side if needed
        if (parameters.SortBy?.ToLowerInvariant() is "alphabet" or "name")
        {
            var isDescending = parameters.SortDirection?.ToLowerInvariant() == "desc";
            gameDtos = isDescending 
                ? gameDtos.OrderByDescending(g => g.Name)
                : gameDtos.OrderBy(g => g.Name);
        }

        return gameDtos;
    }

    public async Task<IEnumerable<GameDto>> GetBestsellerGamesAsync(int page, int limit, string sort, string language = "uk")
    {
        var parameters = CreateParameters(page, limit, string.IsNullOrWhiteSpace(sort) ? "discount" : sort);

        var games = await _db.Set<Game>()
            .AsNoTracking()
            .ApplySorting(parameters)
            .ApplyPagination(parameters)
            .ToListAsync();

        var gameDtos = games.Select(g => GameDto.FromEntity(g, language));

        // Handle name sorting client-side if needed
        if (parameters.SortBy?.ToLowerInvariant() is "alphabet" or "name")
        {
            var isDescending = parameters.SortDirection?.ToLowerInvariant() == "desc";
            gameDtos = isDescending 
                ? gameDtos.OrderByDescending(g => g.Name)
                : gameDtos.OrderBy(g => g.Name);
        }

        return gameDtos;
    }

    public async Task<IEnumerable<GameDto>> GetRecommendedGamesAsync(string userId, int page, int limit, string sort, string language = "uk")
    {
        var parameters = CreateParameters(page, limit, string.IsNullOrWhiteSpace(sort) ? "relevancy" : sort);

        var games = await _db.Set<Game>()
            .AsNoTracking()
            .Where(g => g.Rating >= 4)
            .ApplySorting(parameters)
            .ApplyPagination(parameters)
            .ToListAsync();

        var gameDtos = games.Select(g => GameDto.FromEntity(g, language));

        // Handle name sorting client-side if needed
        if (parameters.SortBy?.ToLowerInvariant() is "alphabet" or "name")
        {
            var isDescending = parameters.SortDirection?.ToLowerInvariant() == "desc";
            gameDtos = isDescending 
                ? gameDtos.OrderByDescending(g => g.Name)
                : gameDtos.OrderBy(g => g.Name);
        }

        return gameDtos;
    }

    public async Task<IEnumerable<GameDto>> GetGamesByFilterAsync(GamesFilterRequestDto request, string language = "uk")
    {
        if (request == null) throw new ArgumentNullException(nameof(request));

        var query = _db.Set<Game>().AsNoTracking().AsQueryable();

        // Note: Search is disabled for now due to localization - Name and Description are NotMapped properties
        // TODO: Implement proper search on JSON translation fields
        // query = query.ApplySearch(request, g => g.Name, g => g.Description);

        if (request.Genres?.Count > 0)
        {
            var genresFilter = request.Genres;
            query = query.Where(g => g.Genre.Any(genre => genresFilter.Contains(genre)));
        }

        if (request.Platforms?.Count > 0)
        {
            var platformsFilter = request.Platforms;
            query = query.Where(g => g.Platforms.Any(platform => platformsFilter.Contains(platform)));
        }

        if (request.MinPrice.HasValue)
        {
            query = query.Where(g => g.Price >= request.MinPrice.Value);
        }

        if (request.MaxPrice.HasValue)
        {
            query = query.Where(g => g.Price <= request.MaxPrice.Value);
        }

        if (request.OnSale.HasValue)
        {
            if (request.OnSale.Value)
            {
                query = query.Where(g => g.DiscountPercent > 0 || (g.SalePrice > 0 && g.SalePrice < g.Price));
            }
            else
            {
                query = query.Where(g => g.DiscountPercent == 0 && (g.SalePrice == 0 || g.SalePrice >= g.Price));
            }
        }

        if (request.IsDlc.HasValue)
        {
            query = query.Where(g => g.IsDlc == request.IsDlc.Value);
        }

        var games = await query
            .ApplySorting(request)
            .ApplyPagination(request)
            .ToListAsync();

        var gameDtos = games.Select(g => GameDto.FromEntity(g, language));

        // Handle name sorting client-side if needed
        if (request.SortBy?.ToLowerInvariant() is "alphabet" or "name")
        {
            var isDescending = request.SortDirection?.ToLowerInvariant() == "desc";
            gameDtos = isDescending 
                ? gameDtos.OrderByDescending(g => g.Name)
                : gameDtos.OrderBy(g => g.Name);
        }

        return gameDtos;
    }

    public async Task<IEnumerable<GameDto>> GetRecommendedAsync(string language = "uk")
    {
        var games = await _db.Set<Game>()
            .AsNoTracking()
            .Where(g => g.Rating >= 4 && g.SalePrice < 1000m)
            .OrderByDescending(g => g.Rating)
            .ToListAsync();

        return games.Select(g => GameDto.FromEntity(g, language));
    }

    public async Task<IEnumerable<GameDto>> GetCheaperThanAsync(decimal priceUpperBound, string language = "uk")
    {
        var games = await _db.Set<Game>()
            .AsNoTracking()
            .Where(g => g.Price <= priceUpperBound)
            .OrderBy(g => g.Price)
            .ToListAsync();

        return games.Select(g => GameDto.FromEntity(g, language));
    }

    public async Task<IEnumerable<GameDto>> GetHitsAsync(string language = "uk")
    {
        var games = await _db.Set<Game>()
            .AsNoTracking()
            .OrderByDescending(g => g.Rating)
            .ToListAsync();

        return games.Select(g => GameDto.FromEntity(g, language));
    }

    public async Task<IEnumerable<GameDto>> GetNewAsync(string language = "uk")
    {
        var games = await _db.Set<Game>()
            .AsNoTracking()
            .OrderByDescending(g => g.ReleaseDate)
            .ToListAsync();

        return games.Select(g => GameDto.FromEntity(g, language));
    }

    public async Task<IEnumerable<GameDto>> GetFreeAsync(string language = "uk")
    {
        var games = await _db.Set<Game>()
            .AsNoTracking()
            .Where(g => g.Price == 0)
            .OrderByDescending(g => g.Rating)
            .ToListAsync();

        return games.Select(g => GameDto.FromEntity(g, language));
    }

    public async Task<IEnumerable<GameDto>> GetDlcsByGameIdAsync(Guid gameId, string language = "uk")
    {
        var games = await _db.Set<Game>()
            .AsNoTracking()
            .Where(g => g.IsDlc && g.BaseGameId == gameId)
            .ToListAsync();

        // Sort by localized name after loading from database
        var sortedGames = games.OrderBy(g => g.GetLocalizedName(language));

        return sortedGames.Select(g => GameDto.FromEntity(g, language));
    }

    public async Task<GameCharacteristicDto?> GetGameCharacteristicsAsync(Guid gameId)
    {
        return await _db.Set<GameCharacteristic>()
            .AsNoTracking()
            .Where(gc => gc.GameId == gameId)
            .Select(gc => new GameCharacteristicDto
            {
                GameId = gc.GameId,
                Platform = gc.Platform,
                MinVersion = gc.MinVersion,
                MinCpu = gc.MinCpu,
                MinRam = gc.MinRam,
                MinGpu = gc.MinGpu,
                MinDirectX = gc.MinDirectX,
                MinMemory = gc.MinMemory,
                MinAudioCard = gc.MinAudioCard,
                RecommendedVersion = gc.RecommendedVersion,
                RecommendedCpu = gc.RecommendedCpu,
                RecommendedRam = gc.RecommendedRam,
                RecommendedGpu = gc.RecommendedGpu,
                RecommendedDirectX = gc.RecommendedDirectX,
                RecommendedMemory = gc.RecommendedMemory,
                RecommendedAudioCard = gc.RecommendedAudioCard,
                Controller = gc.Controller,
                Additional = gc.Additional,
                LangAudio = gc.LangAudio,
                LangText = gc.LangText
            })
            .FirstOrDefaultAsync();
    }


    private static QueryParameters CreateParameters(int page, int limit, string? sort)
    {
        return new QueryParameters
        {
            Page = page,
            Limit = limit,
            SortBy = sort
        };
    }

}