using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Interfaces;
using Domain.Entities;
using Domain.Interfaces;

namespace Infrastructure.Services;

public class UserBlockService : IUserBlockService
{
    private readonly IUserBlockRepository _userBlockRepository;
    private readonly IFriendshipRepository _friendshipRepository;

    public UserBlockService(IUserBlockRepository userBlockRepository, IFriendshipRepository friendshipRepository)
    {
        _userBlockRepository = userBlockRepository;
        _friendshipRepository = friendshipRepository;
    }

    public async Task BlockUserAsync(Guid blockerId, Guid blockedUserId)
    {
        ValidateNotSelf(blockerId, blockedUserId);

        // Check if already blocked
        var existingBlock = await _userBlockRepository.GetBlockAsync(blockerId, blockedUserId);
        if (existingBlock != null)
        {
            throw new InvalidOperationException("User is already blocked.");
        }

        // Remove existing friendship if it exists
        var friendship = await _friendshipRepository.GetForPairAsync(blockerId, blockedUserId);
        if (friendship != null)
        {
            await _friendshipRepository.DeleteAsync(friendship);
        }

        // Create block relationship
        var block = new UserBlock
        {
            BlockerId = blockerId,
            BlockedUserId = blockedUserId
        };

        await _userBlockRepository.CreateAsync(block);
    }

    public async Task UnblockUserAsync(Guid blockerId, Guid blockedUserId)
    {
        ValidateNotSelf(blockerId, blockedUserId);

        var block = await _userBlockRepository.GetBlockAsync(blockerId, blockedUserId);
        if (block == null)
        {
            throw new KeyNotFoundException("Block relationship not found.");
        }

        await _userBlockRepository.DeleteAsync(block);
    }

    public async Task<bool> IsBlockedAsync(Guid userId, Guid otherUserId)
    {
        return await _userBlockRepository.IsBlockedAsync(userId, otherUserId);
    }

    public async Task<IReadOnlyList<Guid>> GetBlockedUserIdsAsync(Guid userId)
    {
        var blocks = await _userBlockRepository.GetBlockedByUserAsync(userId);
        return blocks.Select(b => b.BlockedUserId).ToList();
    }

    private static void ValidateNotSelf(Guid blockerId, Guid blockedUserId)
    {
        if (blockerId == blockedUserId)
        {
            throw new ArgumentException("Cannot block yourself.");
        }
    }
}
