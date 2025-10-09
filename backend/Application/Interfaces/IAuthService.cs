using System;
using System.Threading.Tasks;
using Application.DTOs;

namespace Application.Interfaces;

public interface IAuthService
{
    Task<AuthResponseDto> RegisterAsync(RegisterDto dto);
    Task<AuthResponseDto> LoginAsync(LoginDto dto);
    Task SendVerificationCodeAsync(string email);
    Task<bool> VerifyCodeAsync(string email, string code);
    Task SendVerificationEmailAsync(string email);
    Task<bool> VerifyEmailAsync(string userId, string token);
    Task SendResetPasswordCodeAsync(string email);
    Task<bool> ResetPasswordAsync(ResetPasswordDto dto);
}
