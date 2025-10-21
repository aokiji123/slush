using System;

namespace Application.DTOs;

/// <summary>
/// DTO representing a friendship relationship with optional user details
/// </summary>
public class FriendshipDto
{
    /// <summary>
    /// The ID of the first user in the friendship
    /// </summary>
    public Guid User1Id { get; set; }
    
    /// <summary>
    /// The ID of the second user in the friendship
    /// </summary>
    public Guid User2Id { get; set; }
    
    /// <summary>
    /// When the friendship was established
    /// </summary>
    public DateTime CreatedAt { get; set; }
    
    /// <summary>
    /// Optional detailed information about the first user (included in detailed responses)
    /// </summary>
    public UserDto? User1 { get; set; }
    
    /// <summary>
    /// Optional detailed information about the second user (included in detailed responses)
    /// </summary>
    public UserDto? User2 { get; set; }
}
