using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Domain.Entities;

namespace Domain.Interfaces;

public interface IBadgeRepository
{
    Task<IEnumerable<Badge>> GetAllAsync();
    Task<Badge?> GetByIdAsync(Guid id);
    Task<Badge> AddAsync(Badge badge);
    Task<IEnumerable<UserBadge>> GetUserBadgesAsync(Guid userId);
    Task<UserBadge> AddUserBadgeAsync(UserBadge userBadge);
    Task<bool> UserHasBadgeAsync(Guid userId, Guid badgeId);
}
