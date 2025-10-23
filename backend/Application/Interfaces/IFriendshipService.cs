using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Application.DTOs;
using Domain.Entities;

namespace Application.Interfaces;

public interface IFriendshipService
{
    Task<FriendRequest> SendRequestAsync(Guid senderId, Guid receiverId);
    Task<Friendship> AcceptRequestAsync(Guid senderId, Guid receiverId);
    Task DeclineRequestAsync(Guid senderId, Guid receiverId);
    Task CancelRequestAsync(Guid senderId, Guid receiverId);
    Task RemoveFriendshipAsync(Guid userId, Guid friendId);
    Task<IReadOnlyList<Guid>> GetPendingSentAsync(Guid senderId);
    Task<IReadOnlyList<Guid>> GetPendingReceivedAsync(Guid receiverId);
    Task<IReadOnlyList<Friendship>> GetFriendshipsAsync(Guid userId);
    Task<IReadOnlyList<Guid>> GetFriendIdsAsync(Guid userId);
    Task<IReadOnlyList<Guid>> GetOnlineFriendIdsAsync(Guid userId);
    Task<IReadOnlyList<Guid>> GetFriendsWithGameAsync(Guid userId, Guid gameId);
    Task<IReadOnlyList<FriendWithGameDto>> GetFriendsWithGameDetailsAsync(Guid userId, Guid gameId);
    Task<Friendship?> GetFriendshipBetweenUsersAsync(Guid userId1, Guid userId2);
    Task<IReadOnlyList<FriendDetailsDto>> GetFriendsWithDetailsAsync(Guid userId);
}
