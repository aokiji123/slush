using System;

namespace Application.DTOs;

/// <summary>
/// DTO for sending a friend request to another user
/// </summary>
public class SendFriendRequestDto
{
    /// <summary>
    /// The ID of the user to send the friend request to
    /// </summary>
    public Guid ReceiverId { get; set; }
}
