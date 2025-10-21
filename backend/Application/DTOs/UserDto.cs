using System;

namespace Application.DTOs;

public class UserDto
{
    public Guid Id { get; set; }
    public string Nickname { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? Bio { get; set; }
    public string Lang { get; set; } = "UA";
    public string? Avatar { get; set; }
    public string? Banner { get; set; }
    public double Balance { get; set; }
    
    /// <summary>
    /// When the user was last seen online
    /// </summary>
    public DateTime? LastSeenAt { get; set; }
    
    /// <summary>
    /// Whether the user is currently online
    /// </summary>
    public bool IsOnline { get; set; }
}
