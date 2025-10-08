using System;

namespace Application.DTOs;

public class UserDeleteDto
{
    public Guid UserId { get; set; }
    public string Nickname { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string ConfirmPassword { get; set; } = string.Empty;
}


