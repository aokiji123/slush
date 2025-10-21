using System;

namespace Application.DTOs;

/// <summary>
/// DTO for blocking a user
/// </summary>
public class BlockUserDto
{
    /// <summary>
    /// The ID of the user to block
    /// </summary>
    public Guid BlockedUserId { get; set; }
}
