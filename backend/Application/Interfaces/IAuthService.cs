using System;
using System.Threading.Tasks;
using Application.DTOs;

namespace Application.Interfaces;

public interface IAuthService
{
    Task<AuthResponseDto> LoginAsync(LoginDto loginDto);
    Task<AuthResponseDto> SignUpAsync(SignUpDto signUpDto);
    Task<AuthResponseDto> ForgotPasswordAsync(ForgotPasswordDto forgotPasswordDto);
    Task<AuthResponseDto> ChangePasswordAsync(Guid userId, ChangePasswordDto changePasswordDto);
    Task<AuthResponseDto> ResetPasswordAsync(ResetPasswordDto resetPasswordDto);
    Task<bool> ValidateTokenAsync(string token);
    Task<Guid?> GetUserIdFromTokenAsync(string token);
}
