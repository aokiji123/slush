using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain.Entities;
using Domain.Interfaces;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

public class BadgeRepository : IBadgeRepository
{
    private readonly AppDbContext _db;

    public BadgeRepository(AppDbContext db)
    {
        _db = db;
    }

    public async Task<IEnumerable<Badge>> GetAllAsync()
    {
        return await _db.Set<Badge>()
            .OrderBy(b => b.RequirementType)
            .ThenBy(b => b.RequiredValue)
            .ToListAsync();
    }

    public async Task<Badge?> GetByIdAsync(Guid id)
    {
        return await _db.Set<Badge>()
            .FirstOrDefaultAsync(b => b.Id == id);
    }

    public async Task<Badge> AddAsync(Badge badge)
    {
        _db.Set<Badge>().Add(badge);
        await _db.SaveChangesAsync();
        return badge;
    }

    public async Task<IEnumerable<UserBadge>> GetUserBadgesAsync(Guid userId)
    {
        return await _db.Set<UserBadge>()
            .Include(ub => ub.Badge)
            .Where(ub => ub.UserId == userId)
            .OrderByDescending(ub => ub.EarnedAt)
            .ToListAsync();
    }

    public async Task<UserBadge> AddUserBadgeAsync(UserBadge userBadge)
    {
        _db.Set<UserBadge>().Add(userBadge);
        await _db.SaveChangesAsync();
        return userBadge;
    }

    public async Task<bool> UserHasBadgeAsync(Guid userId, Guid badgeId)
    {
        return await _db.Set<UserBadge>()
            .AnyAsync(ub => ub.UserId == userId && ub.BadgeId == badgeId);
    }
}
