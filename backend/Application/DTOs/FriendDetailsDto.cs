using System;

namespace Application.DTOs;

public class FriendDetailsDto
{
    public Guid Id { get; set; }
    public string Nickname { get; set; } = string.Empty;
    public string? Avatar { get; set; }
    public bool IsOnline { get; set; }
    public int Level { get; set; }
    public DateTime? LastSeenAt { get; set; }
    public DateTime FriendshipCreatedAt { get; set; }
}
