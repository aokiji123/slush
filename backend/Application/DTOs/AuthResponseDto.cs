namespace Application.DTOs;

public class AuthResponseDto
{
    public string Token { get; set; } = null!;
    public string Username { get; set; } = null!;
    public string Email { get; set; } = null!;
    public string Avatar { get; set; } = string.Empty;
}