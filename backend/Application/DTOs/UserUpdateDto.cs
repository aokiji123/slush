using System;

namespace Application.DTOs;

public class UserUpdateDto
{
    public Guid Id { get; set; }
    public string Nickname { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? Bio { get; set; }
    public string? Avatar { get; set; }
    public string? Banner { get; set; }
    public string Lang { get; set; } = "UA"; // UA, UK
}


