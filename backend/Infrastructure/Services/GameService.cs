using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.DTOs;
using Application.Interfaces;
using Domain.Entities;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Services;

public class GameService : IGameService
{
    private readonly AppDbContext _db;

    public GameService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<GameDto?> GetGameByIdAsync(Guid id)
    {
        var game = await _db.Set<Game>()
            .FirstOrDefaultAsync(g => g.Id == id);

        if (game == null) return null;

        return new GameDto
        {
            Id = game.Id,
            Name = game.Name,
            Slug = game.Slug,
            Description = game.Description,
            MainImage = game.MainImage,
            Images = game.Images.ToList(),
            Price = (double)game.Price,
            DiscountPercent = game.DiscountPercent,
            SalePrice = (double)game.SalePrice,
            SaleDate = game.SaleDate,
            Rating = game.Rating,
            ReleaseDate = game.ReleaseDate,
            Developer = game.Developer,
            Publisher = game.Publisher,
            Platforms = game.Platforms.ToList(),
            Genre = game.Genre.ToList(),
            IsDlc = game.IsDlc,
            BaseGameId = game.BaseGameId
        };
    }

    public async Task<IEnumerable<GameDto>> SearchAsync(string? genre, string? platform, decimal? priceUpperBound)
    {
        var games = _db.Set<Game>().AsQueryable();

        if (priceUpperBound.HasValue)
        {
            games = games.Where(g => g.Price <= priceUpperBound.Value);
        }

        if (!string.IsNullOrWhiteSpace(genre))
            games = games.Where(g => g.Genre.Any(x => x.ToLower() == genre.ToLower()));

        if (!string.IsNullOrWhiteSpace(platform))
            games = games.Where(g => g.Platforms.Any(x => x.ToLower() == platform.ToLower()));

        return await games
            .Select(g => new GameDto
            {
                Id = g.Id,
                Name = g.Name,
                Slug = g.Slug,
                MainImage = g.MainImage,
                Images = g.Images.ToList(),
                Price = (double)g.Price,
                DiscountPercent = g.DiscountPercent,
                SalePrice = (double)g.SalePrice,
                SaleDate = g.SaleDate,
                Rating = g.Rating,
                Genre = g.Genre.ToList(),
                Description = g.Description,
                ReleaseDate = g.ReleaseDate,
                Developer = g.Developer,
                Publisher = g.Publisher,
                Platforms = g.Platforms.ToList(),
                IsDlc = g.IsDlc,
                BaseGameId = g.BaseGameId
            })
            .ToListAsync();
    }

    public async Task<IEnumerable<GameDto>> GetDiscountedAsync()
    {
        return await _db.Set<Game>()
            .Where(g => g.DiscountPercent > 0)
            .OrderByDescending(g => g.DiscountPercent)
            .Select(g => new GameDto
            {
                Id = g.Id,
                Name = g.Name,
                Slug = g.Slug,
                MainImage = g.MainImage,
                Images = g.Images,
                Price = (double)g.Price,
                DiscountPercent = g.DiscountPercent,
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
            })
            .ToListAsync();
    }

    public async Task<IEnumerable<GameDto>> GetRecommendedAsync()
    {
        return await _db.Set<Game>()
            .Where(g => g.Rating >= 4 && g.SalePrice < 1000m)
            .OrderByDescending(g => g.Rating)
            .Select(g => new GameDto
            {
                Id = g.Id,
                Name = g.Name,
                Slug = g.Slug,
                MainImage = g.MainImage,
                Images = g.Images,
                Price = (double)g.Price,
                DiscountPercent = g.DiscountPercent,
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
            })
            .ToListAsync();
    }

    public async Task<IEnumerable<GameDto>> GetCheaperThanAsync(decimal priceUpperBound)
    {
        return await _db.Set<Game>()
            .Where(g => g.Price <= priceUpperBound)
            .OrderBy(g => g.Price)
            .Select(g => new GameDto
            {
                Id = g.Id,
                Name = g.Name,
                Slug = g.Slug,
                MainImage = g.MainImage,
                Images = g.Images,
                Price = (double)g.Price,
                DiscountPercent = g.DiscountPercent,
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
            })
            .ToListAsync();
    }

    public async Task<IEnumerable<GameDto>> GetHitsAsync()
    {
        return await _db.Set<Game>()
            .OrderByDescending(g => g.Rating)
            .Select(g => new GameDto
            {
                Id = g.Id,
                Name = g.Name,
                Slug = g.Slug,
                MainImage = g.MainImage,
                Images = g.Images,
                Price = (double)g.Price,
                DiscountPercent = g.DiscountPercent,
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
            })
            .ToListAsync();
    }

    public async Task<IEnumerable<GameDto>> GetNewAsync()
    {
        return await _db.Set<Game>()
            .OrderByDescending(g => g.ReleaseDate)
            .Select(g => new GameDto
            {
                Id = g.Id,
                Name = g.Name,
                Slug = g.Slug,
                MainImage = g.MainImage,
                Images = g.Images,
                Price = (double)g.Price,
                DiscountPercent = g.DiscountPercent,
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
            })
            .ToListAsync();
    }

    public async Task<IEnumerable<GameDto>> GetFreeAsync()
    {
        return await _db.Set<Game>()
            .Where(g => g.Price == 0)
            .OrderByDescending(g => g.Rating)
            .Select(g => new GameDto
            {
                Id = g.Id,
                Name = g.Name,
                Slug = g.Slug,
                MainImage = g.MainImage,
                Images = g.Images,
                Price = (double)g.Price,
                DiscountPercent = g.DiscountPercent,
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
            })
            .ToListAsync();
    }

    // inline selectors above to keep expression tree translatable
}