using System;

namespace Application.DTOs;

public class FriendWithGameDto
{
    public Guid Id { get; set; }
    public string Nickname { get; set; } = string.Empty;
    public string? Avatar { get; set; }
}
