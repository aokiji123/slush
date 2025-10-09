using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
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
}
