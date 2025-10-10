using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Domain.Entities;

namespace Domain.Interfaces;

public interface IFriendshipRepository
{
    Task<Friendship> CreateAsync(Friendship friendship);
    Task<bool> ExistsForPairAsync(Guid userAId, Guid userBId);
    Task<IReadOnlyList<Friendship>> GetForUserAsync(Guid userId);
    Task<Friendship?> GetForPairAsync(Guid userAId, Guid userBId);
    Task DeleteAsync(Friendship friendship);
}
