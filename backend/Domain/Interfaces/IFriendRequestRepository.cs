using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Domain.Entities;

namespace Domain.Interfaces;

public interface IFriendRequestRepository
{
    Task<FriendRequest> CreateAsync(FriendRequest request);
    Task UpdateAsync(FriendRequest request);
    Task<bool> ExistsPendingAsync(Guid userAId, Guid userBId);
    Task<IReadOnlyList<FriendRequest>> GetPendingBySenderAsync(Guid senderId);
    Task<FriendRequest?> GetByPairAsync(Guid senderId, Guid receiverId);
}
