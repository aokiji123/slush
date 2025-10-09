namespace Application.DTOs;

public class ForgotPasswordDto
{
    public string Email { get; set; } = string.Empty;
    public bool Captcha { get; set; }
}
