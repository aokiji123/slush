using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Domain.Entities;

namespace Domain.Interfaces;

public interface IUserBlockRepository
{
    Task<UserBlock> CreateAsync(UserBlock block);
    Task DeleteAsync(UserBlock block);
    Task<UserBlock?> GetBlockAsync(Guid blockerId, Guid blockedUserId);
    Task<bool> IsBlockedAsync(Guid userId, Guid otherUserId);
    Task<IReadOnlyList<UserBlock>> GetBlockedByUserAsync(Guid userId);
}
