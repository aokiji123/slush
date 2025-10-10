using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Domain.Entities;

namespace Application.Interfaces;

public interface IFriendshipService
{
    Task<FriendRequest> SendRequestAsync(Guid senderId, Guid receiverId);
    Task<Friendship> AcceptRequestAsync(Guid senderId, Guid receiverId);
    Task DeclineRequestAsync(Guid senderId, Guid receiverId);
    Task<IReadOnlyList<Guid>> GetPendingSentAsync(Guid senderId);
    Task<IReadOnlyList<Friendship>> GetFriendshipsAsync(Guid userId);
}
