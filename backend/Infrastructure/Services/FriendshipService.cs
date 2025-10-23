using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.DTOs;
using Application.Interfaces;
using Domain.Entities;
using Domain.Interfaces;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Services;

public class FriendshipService : IFriendshipService
{
    private readonly IFriendRequestRepository _friendRequestRepository;
    private readonly IFriendshipRepository _friendshipRepository;
    private readonly IUserBlockRepository _userBlockRepository;
    private readonly AppDbContext _context;

    public FriendshipService(
        IFriendRequestRepository friendRequestRepository,
        IFriendshipRepository friendshipRepository,
        IUserBlockRepository userBlockRepository,
        AppDbContext context)
    {
        _friendRequestRepository = friendRequestRepository;
        _friendshipRepository = friendshipRepository;
        _userBlockRepository = userBlockRepository;
        _context = context;
    }

    public async Task<FriendRequest> SendRequestAsync(Guid senderId, Guid receiverId)
    {
        ValidateNotSelf(senderId, receiverId);

        // Check if users have blocked each other
        var isBlocked = await _userBlockRepository.IsBlockedAsync(senderId, receiverId);
        if (isBlocked)
        {
            throw new InvalidOperationException("Cannot send friend request to blocked user.");
        }

        // Validate that both users exist
        var senderExists = await _context.Set<User>().AnyAsync(u => u.Id == senderId);
        if (!senderExists)
        {
            throw new ArgumentException("Sender user not found.");
        }

        var receiverExists = await _context.Set<User>().AnyAsync(u => u.Id == receiverId);
        if (!receiverExists)
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

        // Check if users have blocked each other
        var isBlocked = await _userBlockRepository.IsBlockedAsync(senderId, receiverId);
        if (isBlocked)
        {
            throw new InvalidOperationException("Cannot accept friend request from blocked user.");
        }

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

    public async Task<IReadOnlyList<Guid>> GetOnlineFriendIdsAsync(Guid userId)
    {
        // Get online friend IDs directly from database
        var friendships = await _friendshipRepository.GetForUserAsync(userId);
        var friendIds = friendships.Select(f => f.User1Id == userId ? f.User2Id : f.User1Id).ToList();
        
        var onlineFriendIds = await _context.Set<User>()
            .Where(u => friendIds.Contains(u.Id) && u.IsOnline)
            .Select(u => u.Id)
            .ToListAsync();
            
        return onlineFriendIds;
    }

    public async Task<IReadOnlyList<Guid>> GetFriendsWithGameAsync(Guid userId, Guid gameId)
    {
        var friendIds = await GetFriendIdsAsync(userId);
        if (!friendIds.Any())
        {
            return new List<Guid>();
        }

        // Query Library table for friends who own the specified game
        var friendsWithGame = await _context.Libraries
            .AsNoTracking()
            .Where(l => friendIds.Contains(l.UserId) && l.GameId == gameId)
            .Select(l => l.UserId)
            .ToListAsync();

        return friendsWithGame;
    }

    public async Task<IReadOnlyList<FriendWithGameDto>> GetFriendsWithGameDetailsAsync(Guid userId, Guid gameId)
    {
        var friendIds = await GetFriendIdsAsync(userId);
        if (!friendIds.Any())
        {
            return new List<FriendWithGameDto>();
        }

        // Query Library table for friends who own the specified game and join with Users to get details
        var friendsWithGame = await _context.Libraries
            .AsNoTracking()
            .Where(l => friendIds.Contains(l.UserId) && l.GameId == gameId)
            .Join(_context.Users, l => l.UserId, u => u.Id, (l, u) => new FriendWithGameDto
            {
                Id = u.Id,
                Nickname = u.Nickname,
                Avatar = u.Avatar
            })
            .ToListAsync();

        return friendsWithGame;
    }

    public async Task<Friendship?> GetFriendshipBetweenUsersAsync(Guid userId1, Guid userId2)
    {
        if (userId1 == userId2)
        {
            return null;
        }

        var friendship = await _friendshipRepository.GetForPairAsync(userId1, userId2);
        return friendship;
    }

    public async Task<IReadOnlyList<FriendDetailsDto>> GetFriendsWithDetailsAsync(Guid userId)
    {
        var friendships = await _friendshipRepository.GetForUserAsync(userId);
        var friendIds = friendships.Select(f => f.User1Id == userId ? f.User2Id : f.User1Id).ToList();
        
        var friends = await _context.Set<User>()
            .Where(u => friendIds.Contains(u.Id))
            .Select(u => new FriendDetailsDto
            {
                Id = u.Id,
                Nickname = u.Nickname ?? string.Empty,
                Avatar = u.Avatar,
                IsOnline = u.IsOnline,
                Level = 1, // Will be calculated by UserService
                LastSeenAt = u.LastSeenAt
            })
            .ToListAsync();

        // Get friendship creation dates
        var friendshipMap = friendships.ToDictionary(
            f => f.User1Id == userId ? f.User2Id : f.User1Id,
            f => f.CreatedAt
        );

        // Set friendship creation dates
        foreach (var friend in friends)
        {
            if (friendshipMap.TryGetValue(friend.Id, out var createdAt))
            {
                friend.FriendshipCreatedAt = createdAt;
            }
        }

            // Calculate levels for each friend (simplified calculation to avoid circular dependency)
            foreach (var friend in friends)
            {
                // Simple level calculation based on basic activity
                var gamesCount = await _context.Set<Library>().CountAsync(l => l.UserId == friend.Id);
                var reviewsCount = await _context.Set<Review>().CountAsync(r => r.UserId == friend.Id);
                var postsCount = await _context.Set<Post>().CountAsync(p => p.AuthorId == friend.Id);
                
                var points = gamesCount + (reviewsCount * 2) + (friends.Count * 3) + (postsCount * 2);
                friend.Level = points switch
                {
                    < 10 => 1,
                    < 25 => 2,
                    < 50 => 3,
                    < 100 => 4,
                    _ => Math.Min(5 + (points - 100) / 50, 50)
                };
            }

        return friends.OrderByDescending(f => f.IsOnline)
                     .ThenByDescending(f => f.FriendshipCreatedAt)
                     .ToList();
    }

    private static void ValidateNotSelf(Guid senderId, Guid receiverId)
    {
        if (senderId == receiverId)
        {
            throw new ArgumentException("Cannot perform friendship action with self.");
        }
    }
}
