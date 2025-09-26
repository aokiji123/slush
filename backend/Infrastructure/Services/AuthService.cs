using System.Collections.Concurrent;
using Application.DTOs;
using Application.Interfaces;
using Microsoft.Extensions.Logging;

namespace Infrastructure.Services;

public class AuthService : IAuthService
{
    private readonly ILogger<AuthService> _logger;
    private static ConcurrentDictionary<string, string> _verificationCodes = new(); // email -> code
    private static ConcurrentDictionary<string, string> _resetCodes = new();
    
    public AuthService(ILogger<AuthService> logger)
    {
        _logger = logger;
    }
    
    public Task SendVerificationCodeAsync(string email)
    {
        var code = GenerateCode();
        _verificationCodes[email] = code;

        // У продакшені замість логування треба відправити email
        _logger.LogInformation($"Verification code for {email}: {code}");

        return Task.CompletedTask;
    }

    public Task<bool> VerifyCodeAsync(string email, string code)
    {
        if (_verificationCodes.TryGetValue(email, out var storedCode) && storedCode == code)
        {
            _verificationCodes.TryRemove(email, out _);
            return Task.FromResult(true);
        }
        return Task.FromResult(false);
    }

    // ------------------- Forgot Password -------------------
    public Task SendResetPasswordCodeAsync(string email)
    {
        var code = GenerateCode();
        _resetCodes[email] = code;

        // У продакшені – відправка email
        _logger.LogInformation($"Password reset code for {email}: {code}");

        return Task.CompletedTask;
    }

    public Task<bool> ResetPasswordAsync(ResetPasswordDto dto)
    {
        if (_resetCodes.TryGetValue(dto.Email, out var storedCode) && storedCode == dto.Code)
        {
            _resetCodes.TryRemove(dto.Email, out _);

            // Тут логіка оновлення пароля у БД
            // var user = await _db.Users.FirstOrDefaultAsync(u => u.Email == dto.Email);
            // user.PasswordHash = HashPassword(dto.NewPassword);
            // await _db.SaveChangesAsync();

            return Task.FromResult(true);
        }
        return Task.FromResult(false);
    }

    // ------------------- Helper -------------------
    private string GenerateCode()
    {
        var random = new Random();
        return random.Next(100000, 999999).ToString(); // 6-значний код
    }
}