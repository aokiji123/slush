using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain.Entities;
using Domain.Interfaces;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

public class CollectionRepository : ICollectionRepository
{
    private readonly AppDbContext _context;

    public CollectionRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<GameCollection>> GetByUserIdAsync(Guid userId)
    {
        return await _context.Collections
            .AsNoTracking()
            .Include(c => c.Games)
            .Where(c => c.UserId == userId)
            .ToListAsync();
    }

    public async Task<GameCollection?> GetByIdAsync(Guid id)
    {
        return await _context.Collections
            .Include(c => c.Games)
                .ThenInclude(cg => cg.Game)
            .FirstOrDefaultAsync(c => c.Id == id);
    }

    public async Task<GameCollection> CreateAsync(GameCollection collection)
    {
        collection.CreatedAt = DateTime.UtcNow;
        collection.UpdatedAt = DateTime.UtcNow;
        
        await _context.Collections.AddAsync(collection);
        await _context.SaveChangesAsync();
        
        return collection;
    }

    public async Task<GameCollection> UpdateAsync(GameCollection collection)
    {
        collection.UpdatedAt = DateTime.UtcNow;
        
        _context.Collections.Update(collection);
        await _context.SaveChangesAsync();
        
        return collection;
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var collection = await _context.Collections.FindAsync(id);
        if (collection == null)
        {
            return false;
        }

        _context.Collections.Remove(collection);
        await _context.SaveChangesAsync();
        
        return true;
    }

    public async Task<bool> AddGameToCollectionAsync(Guid collectionId, Guid gameId)
    {
        // Check if game is already in collection
        var exists = await _context.CollectionGames
            .AnyAsync(cg => cg.CollectionId == collectionId && cg.GameId == gameId);

        if (exists)
        {
            return false;
        }

        var collectionGame = new CollectionGame
        {
            CollectionId = collectionId,
            GameId = gameId,
            AddedAt = DateTime.UtcNow
        };

        await _context.CollectionGames.AddAsync(collectionGame);
        await _context.SaveChangesAsync();
        
        return true;
    }

    public async Task<bool> RemoveGameFromCollectionAsync(Guid collectionId, Guid gameId)
    {
        var collectionGame = await _context.CollectionGames
            .FirstOrDefaultAsync(cg => cg.CollectionId == collectionId && cg.GameId == gameId);

        if (collectionGame == null)
        {
            return false;
        }

        _context.CollectionGames.Remove(collectionGame);
        await _context.SaveChangesAsync();
        
        return true;
    }

    public async Task<bool> IsGameInCollectionAsync(Guid collectionId, Guid gameId)
    {
        return await _context.CollectionGames
            .AnyAsync(cg => cg.CollectionId == collectionId && cg.GameId == gameId);
    }
}

