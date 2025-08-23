using System;

namespace Application.DTOs;

public class FriendDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Avatar { get; set; } = string.Empty;
}