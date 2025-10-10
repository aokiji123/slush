namespace Application.DTOs;

public class ResetPasswordDto
{
    public string Email { get; set; }
    public string NewPassword { get; set; }
    public string NewPasswordConfirmed { get; set; }
}