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
    private readonly ReviewRepository _reviewRepo;

    public GameService(AppDbContext db)
    {
        _db = db;
        _reviewRepo = new ReviewRepository(db);
    }

    public async Task<GameDto?> GetGameByIdAsync(Guid id)
    {
        return await _db.Set<Game>()
            .AsNoTracking()
            .Where(g => g.Id == id)
            .Select(SelectGameDto())
            .FirstOrDefaultAsync();
    }

    public async Task<IEnumerable<GameDto>> SearchAsync(string? genre, string? platform, decimal? priceUpperBound)
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

        return await query.Select(SelectGameDto()).ToListAsync();
    }

    public async Task<IEnumerable<GameDto>> GetDiscountedAsync()
    {
        return await _db.Set<Game>()
            .AsNoTracking()
            .Where(g => g.SalePrice > 0 && g.SalePrice < g.Price)
            .OrderByDescending(g => (g.Price - g.SalePrice) / g.Price)
            .Select(SelectGameDto())
            .ToListAsync();
    }

    public async Task<IEnumerable<GameDto>> GetTopPopularGamesAsync(int top)
    {
        var take = Math.Clamp(top, 1, 100);

        return await _db.Set<Game>()
            .AsNoTracking()
            .OrderByDescending(g => g.Rating)
            .ThenByDescending(g => g.SalePrice > 0 && g.SalePrice < g.Price ? (g.Price - g.SalePrice) / g.Price : 0)
            .Take(take)
            .Select(SelectGameDto())
            .ToListAsync();
    }

    public async Task<IEnumerable<BannerGameDto>> GetBannerGamesAsync()
    {
        const int defaultBannerCount = 5;

        return await _db.Set<Game>()
            .AsNoTracking()
            .OrderByDescending(g => g.SalePrice > 0 && g.SalePrice < g.Price ? (g.Price - g.SalePrice) / g.Price : 0)
            .ThenByDescending(g => g.Rating)
            .Take(defaultBannerCount)
            .Select(g => new BannerGameDto
            {
                Id = g.Id,
                Name = g.Name,
                Description = g.Description,
                Image = g.MainImage,
                Price = (double)g.Price,
                GameImages = g.Images,
                OldPrice = g.SalePrice > 0 && g.SalePrice < g.Price ? (double?)g.Price : null,
                SalePercent = g.SalePrice > 0 && g.SalePrice < g.Price
                    ? (int)Math.Round((double)((g.Price - g.SalePrice) / g.Price * 100m))
                    : 0,
                SaleEndDate = g.SaleDate
            })
            .ToListAsync();
    }

    public async Task<IEnumerable<GameDto>> GetSpecialOfferGamesAsync(int page, int limit, string sort)
    {
        var parameters = CreateParameters(page, limit, sort);

        var query = _db.Set<Game>()
            .AsNoTracking()
            .Where(g => g.SalePrice > 0 && g.SalePrice < g.Price)
            .ApplySorting(parameters)
            .ApplyPagination(parameters)
            .Select(SelectGameDto());

        return await query.ToListAsync();
    }

    public async Task<IEnumerable<GameDto>> GetNewAndTrendingGamesAsync(int page, int limit, string sort)
    {
        var parameters = CreateParameters(page, limit, string.IsNullOrWhiteSpace(sort) ? "publish_date" : sort);

        var query = _db.Set<Game>()
            .AsNoTracking()
            .ApplySorting(parameters)
            .ApplyPagination(parameters)
            .Select(SelectGameDto());

        return await query.ToListAsync();
    }

    public async Task<IEnumerable<GameDto>> GetBestsellerGamesAsync(int page, int limit, string sort)
    {
        var parameters = CreateParameters(page, limit, string.IsNullOrWhiteSpace(sort) ? "discount" : sort);

        var query = _db.Set<Game>()
            .AsNoTracking()
            .ApplySorting(parameters)
            .ApplyPagination(parameters)
            .Select(SelectGameDto());

        return await query.ToListAsync();
    }

    public async Task<IEnumerable<GameDto>> GetRecommendedGamesAsync(string userId, int page, int limit, string sort)
    {
        var parameters = CreateParameters(page, limit, string.IsNullOrWhiteSpace(sort) ? "relevancy" : sort);

        var query = _db.Set<Game>()
            .AsNoTracking()
            .Where(g => g.Rating >= 4)
            .ApplySorting(parameters)
            .ApplyPagination(parameters)
            .Select(SelectGameDto());

        return await query.ToListAsync();
    }

    public async Task<IEnumerable<GameDto>> GetGamesByFilterAsync(GamesFilterRequestDto request)
    {
        if (request == null) throw new ArgumentNullException(nameof(request));

        var query = _db.Set<Game>().AsNoTracking().AsQueryable();

        query = query.ApplySearch(request, g => g.Name, g => g.Description);

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

        query = query
            .ApplySorting(request)
            .ApplyPagination(request);

        var dtoQuery = query.Select(SelectGameDto());
        return await dtoQuery.ToListAsync();
    }

    public async Task<IEnumerable<GameDto>> GetRecommendedAsync()
    {
        return await _db.Set<Game>()
            .AsNoTracking()
            .Where(g => g.Rating >= 4 && g.SalePrice < 1000m)
            .OrderByDescending(g => g.Rating)
            .Select(SelectGameDto())
            .ToListAsync();
    }

    public async Task<IEnumerable<GameDto>> GetCheaperThanAsync(decimal priceUpperBound)
    {
        return await _db.Set<Game>()
            .AsNoTracking()
            .Where(g => g.Price <= priceUpperBound)
            .OrderBy(g => g.Price)
            .Select(SelectGameDto())
            .ToListAsync();
    }

    public async Task<IEnumerable<GameDto>> GetHitsAsync()
    {
        return await _db.Set<Game>()
            .AsNoTracking()
            .OrderByDescending(g => g.Rating)
            .Select(SelectGameDto())
            .ToListAsync();
    }

    public async Task<IEnumerable<GameDto>> GetNewAsync()
    {
        return await _db.Set<Game>()
            .AsNoTracking()
            .OrderByDescending(g => g.ReleaseDate)
            .Select(SelectGameDto())
            .ToListAsync();
    }

    public async Task<IEnumerable<GameDto>> GetFreeAsync()
    {
        return await _db.Set<Game>()
            .AsNoTracking()
            .Where(g => g.Price == 0)
            .OrderByDescending(g => g.Rating)
            .Select(SelectGameDto())
            .ToListAsync();
    }

    public async Task<IEnumerable<GameDto>> GetDlcsByGameIdAsync(Guid gameId)
    {
        return await _db.Set<Game>()
            .AsNoTracking()
            .Where(g => g.IsDlc && g.BaseGameId == gameId)
            .OrderBy(g => g.Name)
            .Select(SelectGameDto())
            .ToListAsync();
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

    public async Task AddReviewAsync(CreateReviewDto dto)
    {
        var review = new Review
        {
            Id = Guid.NewGuid(),
            GameId = dto.GameId,
            Username = dto.Username,
            Content = dto.Content,
            Rating = dto.Rating,
            CreatedAt = DateTime.UtcNow,
        };
        await _reviewRepo.AddReviewAsync(review);
        // Update game's rating to new average
        var reviews = await _reviewRepo.GetReviewsByGameIdAsync(dto.GameId);
        if (reviews.Count > 0)
        {
            var game = await _db.Games.FindAsync(dto.GameId);
            if (game != null)
            {
                game.Rating = reviews.Average(r => r.Rating);
                await _db.SaveChangesAsync();
            }
        }
    }

    public async Task<List<ReviewDto>> GetReviewsByGameIdAsync(Guid gameId)
    {
        var list = await _reviewRepo.GetReviewsByGameIdAsync(gameId);
        return list.Select(r => new ReviewDto {
            Id = r.Id,
            GameId = r.GameId,
            Username = r.Username,
            Content = r.Content,
            Rating = r.Rating,
            CreatedAt = r.CreatedAt,
            Likes = r.Likes,
            Dislikes = r.Dislikes
        }).ToList();
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

    private static Expression<Func<Game, GameDto>> SelectGameDto()
    {
        return g => new GameDto
        {
            Id = g.Id,
            Name = g.Name,
            Slug = g.Slug,
            MainImage = g.MainImage,
            Images = g.Images,
            Price = (double)g.Price,
            // Compute discount percent dynamically from SalePrice if valid
            DiscountPercent = g.SalePrice > 0 && g.SalePrice < g.Price
                ? (int)Math.Round((double)((g.Price - g.SalePrice) / g.Price * 100m))
                : 0,
            SalePrice = (double)g.SalePrice,
            SaleDate = g.SaleDate,
            Rating = g.Rating,
            Genre = g.Genre,
            Description = g.Description,
            ReleaseDate = g.ReleaseDate,
            Developer = g.Developer,
            Publisher = g.Publisher,
            Platforms = g.Platforms,
            IsDlc = g.IsDlc,
            BaseGameId = g.BaseGameId
        };
    }
}