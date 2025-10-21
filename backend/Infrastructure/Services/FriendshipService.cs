using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Interfaces;
using Domain.Entities;
using Domain.Interfaces;

namespace Infrastructure.Services;

public class FriendshipService : IFriendshipService
{
    private readonly IFriendRequestRepository _friendRequestRepository;
    private readonly IFriendshipRepository _friendshipRepository;
    private readonly IUserService _userService;

    public FriendshipService(
        IFriendRequestRepository friendRequestRepository,
        IFriendshipRepository friendshipRepository,
        IUserService userService)
    {
        _friendRequestRepository = friendRequestRepository;
        _friendshipRepository = friendshipRepository;
        _userService = userService;
    }

    public async Task<FriendRequest> SendRequestAsync(Guid senderId, Guid receiverId)
    {
        ValidateNotSelf(senderId, receiverId);

        // Validate that both users exist
        var sender = await _userService.GetUserAsync(senderId);
        if (sender == null)
        {
            throw new ArgumentException("Sender user not found.");
        }

        var receiver = await _userService.GetUserAsync(receiverId);
        if (receiver == null)
        {
            throw new ArgumentException("Receiver user not found.");
        }

        var pendingExists = await _friendRequestRepository.ExistsPendingAsync(senderId, receiverId);
        if (pendingExists)
        {
            throw new InvalidOperationException("A pending friend request already exists between these users.");
        }

        var alreadyFriends = await _friendshipRepository.ExistsForPairAsync(senderId, receiverId);
        if (alreadyFriends)
        {
            throw new InvalidOperationException("Users are already friends.");
        }

        var existingRequest = await _friendRequestRepository.GetByPairAsync(senderId, receiverId);
        if (existingRequest is not null)
        {
            existingRequest.Status = FriendRequestStatus.Pending;
            existingRequest.CreatedAt = DateTime.UtcNow;
            await _friendRequestRepository.UpdateAsync(existingRequest);
            return existingRequest;
        }

        var request = new FriendRequest
        {
            SenderId = senderId,
            ReceiverId = receiverId,
            Status = FriendRequestStatus.Pending
        };

        return await _friendRequestRepository.CreateAsync(request);
    }

    public async Task<Friendship> AcceptRequestAsync(Guid senderId, Guid receiverId)
    {
        ValidateNotSelf(senderId, receiverId);

        var request = await _friendRequestRepository.GetByPairAsync(senderId, receiverId);
        if (request is null || request.Status != FriendRequestStatus.Pending)
        {
            throw new KeyNotFoundException("Pending friend request not found.");
        }

        request.Status = FriendRequestStatus.Accepted;
        await _friendRequestRepository.UpdateAsync(request);

        var existingFriendship = await _friendshipRepository.GetForPairAsync(senderId, receiverId);
        if (existingFriendship is not null)
        {
            return existingFriendship;
        }

        var friendship = new Friendship
        {
            User1Id = senderId,
            User2Id = receiverId
        };

        return await _friendshipRepository.CreateAsync(friendship);
    }

    public async Task DeclineRequestAsync(Guid senderId, Guid receiverId)
    {
        ValidateNotSelf(senderId, receiverId);

        var request = await _friendRequestRepository.GetByPairAsync(senderId, receiverId);
        if (request is null || request.Status != FriendRequestStatus.Pending)
        {
            throw new KeyNotFoundException("Pending friend request not found.");
        }

        request.Status = FriendRequestStatus.Declined;
        await _friendRequestRepository.UpdateAsync(request);
    }

    public async Task CancelRequestAsync(Guid senderId, Guid receiverId)
    {
        ValidateNotSelf(senderId, receiverId);

        var request = await _friendRequestRepository.GetByPairAsync(senderId, receiverId);
        if (request is null || request.Status != FriendRequestStatus.Pending)
        {
            throw new KeyNotFoundException("Pending friend request not found.");
        }

        await _friendRequestRepository.DeleteAsync(request);
    }

    public async Task RemoveFriendshipAsync(Guid userId, Guid friendId)
    {
        ValidateNotSelf(userId, friendId);

        var friendship = await _friendshipRepository.GetForPairAsync(userId, friendId);
        if (friendship is null)
        {
            throw new KeyNotFoundException("Friendship not found.");
        }

        await _friendshipRepository.DeleteAsync(friendship);
    }

    public async Task<IReadOnlyList<Guid>> GetPendingSentAsync(Guid senderId)
    {
        var pending = await _friendRequestRepository.GetPendingBySenderAsync(senderId);
        return pending.Select(fr => fr.ReceiverId).ToList();
    }

    public async Task<IReadOnlyList<Guid>> GetPendingReceivedAsync(Guid receiverId)
    {
        var pending = await _friendRequestRepository.GetPendingByReceiverAsync(receiverId);
        return pending.Select(fr => fr.SenderId).ToList();
    }

    public Task<IReadOnlyList<Friendship>> GetFriendshipsAsync(Guid userId)
    {
        return _friendshipRepository.GetForUserAsync(userId);
    }

    public async Task<IReadOnlyList<Guid>> GetFriendIdsAsync(Guid userId)
    {
        var friendships = await _friendshipRepository.GetForUserAsync(userId);
        return friendships.Select(f => f.User1Id == userId ? f.User2Id : f.User1Id).ToList();
    }

    private static void ValidateNotSelf(Guid senderId, Guid receiverId)
    {
        if (senderId == receiverId)
        {
            throw new ArgumentException("Cannot perform friendship action with self.");
        }
    }
}
