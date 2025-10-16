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

namespace Infrastructure.Services;

public class WishlistService : IWishlistService
{
    private readonly AppDbContext _db;

    public WishlistService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<IEnumerable<Guid>> GetWishlistGameIdsAsync(Guid userId)
    {
        return await _db.Wishlists
            .AsNoTracking()
            .Where(w => w.UserId == userId)
            .Select(w => w.GameId)
            .ToListAsync();
    }

    public async Task<IEnumerable<GameDto>> GetWishlistGamesAsync(Guid userId)
    {
        return await _db.Wishlists
            .AsNoTracking()
            .Where(w => w.UserId == userId)
            .Include(w => w.Game)
            .Select(w => w.Game)
            .Select(SelectGameDto())
            .ToListAsync();
    }

    public async Task<PagedResult<GameDto>> GetWishlistGamesAsync(Guid userId, WishlistQueryParameters parameters)
    {
        parameters ??= new WishlistQueryParameters();

        IQueryable<Wishlist> baseQuery = _db.Wishlists
            .AsNoTracking()
            .Where(w => w.UserId == userId)
            .Include(w => w.Game);

        // Apply filters
        if (parameters.Genres?.Count > 0)
        {
            var genresFilter = parameters.Genres;
            baseQuery = baseQuery.Where(w => w.Game.Genre.Any(genre => genresFilter.Contains(genre)));
        }

        if (parameters.Platforms?.Count > 0)
        {
            var platformsFilter = parameters.Platforms;
            baseQuery = baseQuery.Where(w => w.Game.Platforms.Any(platform => platformsFilter.Contains(platform)));
        }

        if (parameters.MinPrice.HasValue)
        {
            baseQuery = baseQuery.Where(w => w.Game.Price >= parameters.MinPrice.Value);
        }

        if (parameters.MaxPrice.HasValue)
        {
            baseQuery = baseQuery.Where(w => w.Game.Price <= parameters.MaxPrice.Value);
        }

        if (parameters.OnSale.HasValue)
        {
            if (parameters.OnSale.Value)
            {
                baseQuery = baseQuery.Where(w => w.Game.DiscountPercent > 0 || (w.Game.SalePrice > 0 && w.Game.SalePrice < w.Game.Price));
            }
            else
            {
                baseQuery = baseQuery.Where(w => w.Game.DiscountPercent == 0 && (w.Game.SalePrice == 0 || w.Game.SalePrice >= w.Game.Price));
            }
        }

        if (parameters.IsDlc.HasValue)
        {
            baseQuery = baseQuery.Where(w => w.Game.IsDlc == parameters.IsDlc.Value);
        }

        // Apply search
        baseQuery = baseQuery.ApplySearch(parameters,
            w => w.Game.Name,
            w => w.Game.Developer,
            w => w.Game.Publisher,
            w => w.Game.Description);

        // Get total count before pagination
        var total = await baseQuery.CountAsync();

        // Apply sorting and pagination
        var items = await baseQuery
            .ApplySorting(parameters)
            .ApplyPagination(parameters)
            .Select(w => w.Game)
            .Select(SelectGameDto())
            .ToListAsync();

        return new PagedResult<GameDto>(items, parameters.Page, parameters.Limit, total);
    }

    public async Task<bool> AddToWishlistAsync(Guid userId, Guid gameId)
    {
        var existing = await _db.Wishlists.FindAsync(userId, gameId);
        if (existing is not null)
        {
            return false;
        }

        var wishlistItem = new Wishlist
        {
            UserId = userId,
            GameId = gameId,
            AddedAtUtc = DateTime.UtcNow
        };

        _db.Wishlists.Add(wishlistItem);
        await _db.SaveChangesAsync();

        return true;
    }

    public async Task<bool> RemoveFromWishlistAsync(Guid userId, Guid gameId)
    {
        var wishlistItem = await _db.Wishlists.FindAsync(userId, gameId);
        if (wishlistItem is null)
        {
            return false;
        }

        _db.Wishlists.Remove(wishlistItem);
        await _db.SaveChangesAsync();

        return true;
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
