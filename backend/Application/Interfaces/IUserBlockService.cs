using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Application.Interfaces;

public interface IUserBlockService
{
    Task BlockUserAsync(Guid blockerId, Guid blockedUserId);
    Task UnblockUserAsync(Guid blockerId, Guid blockedUserId);
    Task<bool> IsBlockedAsync(Guid userId, Guid otherUserId);
    Task<IReadOnlyList<Guid>> GetBlockedUserIdsAsync(Guid userId);
}
