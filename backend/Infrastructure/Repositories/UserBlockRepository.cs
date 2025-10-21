using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain.Entities;
using Domain.Interfaces;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

public class UserBlockRepository : IUserBlockRepository
{
    private readonly AppDbContext _context;

    public UserBlockRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<UserBlock> CreateAsync(UserBlock block)
    {
        block.CreatedAt = DateTime.UtcNow;
        await _context.UserBlocks.AddAsync(block);
        await _context.SaveChangesAsync();
        return block;
    }

    public async Task DeleteAsync(UserBlock block)
    {
        _context.UserBlocks.Remove(block);
        await _context.SaveChangesAsync();
    }

    public async Task<UserBlock?> GetBlockAsync(Guid blockerId, Guid blockedUserId)
    {
        return await _context.UserBlocks
            .FirstOrDefaultAsync(ub => ub.BlockerId == blockerId && ub.BlockedUserId == blockedUserId);
    }

    public async Task<bool> IsBlockedAsync(Guid userId, Guid otherUserId)
    {
        // Check if either user has blocked the other (mutual check)
        return await _context.UserBlocks
            .AnyAsync(ub => 
                (ub.BlockerId == userId && ub.BlockedUserId == otherUserId) ||
                (ub.BlockerId == otherUserId && ub.BlockedUserId == userId));
    }

    public async Task<IReadOnlyList<UserBlock>> GetBlockedByUserAsync(Guid userId)
    {
        return await _context.UserBlocks
            .Where(ub => ub.BlockerId == userId)
            .OrderByDescending(ub => ub.CreatedAt)
            .ToListAsync();
    }
}
