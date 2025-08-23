using System;

namespace Application.DTOs;

public class UserDto
{
    public Guid Id { get; set; }
    public string Username { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? Bio { get; set; }
    public string? Avatar { get; set; }
    public DateTime CreatedAtDateTime { get; set; }
    
    public UserDto() { }
    
    public UserDto(Guid id, string username, string email)
    {
        Id = id;
        Username = username;
        Email = email;
    }
}
