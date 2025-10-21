using System;

namespace Application.DTOs;

/// <summary>
/// DTO representing a friend request with optional user details
/// </summary>
public class FriendRequestDto
{
    /// <summary>
    /// The ID of the user who sent the friend request
    /// </summary>
    public Guid SenderId { get; set; }
    
    /// <summary>
    /// The ID of the user who received the friend request
    /// </summary>
    public Guid ReceiverId { get; set; }
    
    /// <summary>
    /// The current status of the friend request (e.g., "Pending", "Accepted", "Declined")
    /// </summary>
    public string Status { get; set; } = string.Empty;
    
    /// <summary>
    /// When the friend request was created
    /// </summary>
    public DateTime CreatedAt { get; set; }
    
    /// <summary>
    /// Optional detailed information about the sender (included in detailed responses)
    /// </summary>
    public UserDto? Sender { get; set; }
    
    /// <summary>
    /// Optional detailed information about the receiver (included in detailed responses)
    /// </summary>
    public UserDto? Receiver { get; set; }
}
