using System;

namespace Application.DTOs;

public class UserDto
{
    public Guid Id { get; set; }
    public string Username { get; set; }
    public string Email { get; set; }
    
    public UserDto() { }
    
    public UserDto(Guid id, string username, string email)
    {
        Id = id;
        Username = username;
        Email = email;
    }
}
