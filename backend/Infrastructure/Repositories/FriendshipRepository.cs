using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain.Entities;
using Domain.Interfaces;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

public class FriendshipRepository : IFriendshipRepository
{
    private readonly AppDbContext _context;

    public FriendshipRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<Friendship> CreateAsync(Friendship friendship)
    {
        var (first, second) = OrderPair(friendship.User1Id, friendship.User2Id);
        friendship.User1Id = first;
        friendship.User2Id = second;
        friendship.CreatedAt = DateTime.UtcNow;
        await _context.Friendships.AddAsync(friendship);
        await _context.SaveChangesAsync();
        return friendship;
    }

    public async Task<bool> ExistsForPairAsync(Guid userAId, Guid userBId)
    {
        var (first, second) = OrderPair(userAId, userBId);
        return await _context.Friendships.AnyAsync(f => f.User1Id == first && f.User2Id == second);
    }

    public async Task<IReadOnlyList<Friendship>> GetForUserAsync(Guid userId)
    {
        return await _context.Friendships
            .Where(f => f.User1Id == userId || f.User2Id == userId)
            .OrderByDescending(f => f.CreatedAt)
            .ToListAsync();
    }

    public async Task<Friendship?> GetForPairAsync(Guid userAId, Guid userBId)
    {
        var (first, second) = OrderPair(userAId, userBId);
        return await _context.Friendships
            .FirstOrDefaultAsync(f => f.User1Id == first && f.User2Id == second);
    }

    public async Task DeleteAsync(Friendship friendship)
    {
        var (first, second) = OrderPair(friendship.User1Id, friendship.User2Id);
        var entity = await GetForPairAsync(first, second);
        if (entity is null)
        {
            return;
        }

        _context.Friendships.Remove(entity);
        await _context.SaveChangesAsync();
    }

    private static (Guid first, Guid second) OrderPair(Guid a, Guid b)
    {
        return a.CompareTo(b) <= 0 ? (a, b) : (b, a);
    }
}
