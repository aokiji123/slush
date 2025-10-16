using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
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
