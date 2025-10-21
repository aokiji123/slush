using System;

namespace Application.DTOs;

/// <summary>
/// DTO for responding to friend requests (accept, decline, cancel, remove)
/// </summary>
public class RespondFriendRequestDto
{
    /// <summary>
    /// The ID of the user who sent the friend request
    /// </summary>
    public Guid SenderId { get; set; }
    
    /// <summary>
    /// The ID of the user who received the friend request
    /// </summary>
    public Guid ReceiverId { get; set; }
}
