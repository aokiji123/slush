using System;

namespace Application.DTOs;

/// <summary>
/// DTO for unblocking a user
/// </summary>
public class UnblockUserDto
{
    /// <summary>
    /// The ID of the user to unblock
    /// </summary>
    public Guid BlockedUserId { get; set; }
}
