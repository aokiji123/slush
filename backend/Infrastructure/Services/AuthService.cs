using System;
using System.Collections.Concurrent;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using Application.DTOs;
using Application.Interfaces;
using Domain.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using Infrastructure.Configuration;
using Infrastructure.Services;

namespace Infrastructure.Services;

public class AuthService : IAuthService
{
    private readonly ILogger<AuthService> _logger;
    private readonly UserManager<User> _userManager;
    private readonly SignInManager<User> _signInManager;
    private readonly IConfiguration _configuration;
    private readonly IEmailService _emailService;
    private readonly IRedisVerificationCodeService _verificationCodeService;

    private const int ResetTokenExpirationMinutes = 15;

    public AuthService(
        ILogger<AuthService> logger,
        UserManager<User> userManager,
        SignInManager<User> signInManager,
        IConfiguration configuration,
        IEmailService emailService,
        IRedisVerificationCodeService verificationCodeService)
    {
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        _userManager = userManager ?? throw new ArgumentNullException(nameof(userManager));
        _signInManager = signInManager ?? throw new ArgumentNullException(nameof(signInManager));
        _configuration = configuration ?? throw new ArgumentNullException(nameof(configuration));
        _emailService = emailService ?? throw new ArgumentNullException(nameof(emailService));
        _verificationCodeService = verificationCodeService ?? throw new ArgumentNullException(nameof(verificationCodeService));
    }

    public async Task<AuthResponseDto> RegisterAsync(RegisterDto dto)
    {
        if (dto == null) throw new ArgumentNullException(nameof(dto));
        if (string.IsNullOrWhiteSpace(dto.Email))
            throw new ArgumentException("Email is required.", nameof(dto.Email));
        if (string.IsNullOrWhiteSpace(dto.Username))
            throw new ArgumentException("Username is required.", nameof(dto.Username));
        if (string.IsNullOrWhiteSpace(dto.Password))
            throw new ArgumentException("Password is required.", nameof(dto.Password));

        var existingUser = await _userManager.FindByEmailAsync(dto.Email);
        if (existingUser != null)
        {
            throw new InvalidOperationException("User with this email already exists.");
        }

        var user = new User
        {
            UserName = dto.Username,
            Email = dto.Email,
            Nickname = dto.Username, // Set nickname from username
            CreatedAtDateTime = DateTime.UtcNow,
            EmailConfirmed = false // Will be confirmed after email verification
        };

        var result = await _userManager.CreateAsync(user, dto.Password);
        if (!result.Succeeded)
        {
            var errors = string.Join(", ", result.Errors.Select(e => e.Description));
            throw new InvalidOperationException($"User creation failed: {errors}");
        }

        // Generate email confirmation token and send verification email
        var registeredEmail = user.Email ?? throw new InvalidOperationException("User email not set after creation.");
        await SendVerificationCodeAsync(registeredEmail);

        return new AuthResponseDto
        {
            Email = registeredEmail,
            Username = user.UserName ?? string.Empty,
            Token = await GenerateJwtToken(user),
            Avatar = user.Avatar ?? string.Empty,
            EmailConfirmed = user.EmailConfirmed
        };
    }

    public async Task<AuthResponseDto> LoginAsync(LoginDto dto)
    {
        if (dto == null) throw new ArgumentNullException(nameof(dto));

        var user = await _userManager.FindByEmailAsync(dto.Email);
        if (user == null)
        {
            throw new UnauthorizedAccessException("Invalid login attempt.");
        }

        var result = await _signInManager.CheckPasswordSignInAsync(user, dto.Password, false);
        if (!result.Succeeded)
        {
            throw new UnauthorizedAccessException("Invalid login attempt.");
        }
        // Check if email is confirmed (optional: enable this in production)
        // {
        //     throw new UnauthorizedAccessException("Please verify your email address before logging in.");
        // }

        return new AuthResponseDto
        {
            Email = user.Email ?? string.Empty,
            Username = user.UserName ?? string.Empty,
            Token = await GenerateJwtToken(user),
            Avatar = user.Avatar ?? string.Empty,
            EmailConfirmed = user.EmailConfirmed
        };
    }

    public async Task SendVerificationCodeAsync(string email)
    {
        if (string.IsNullOrWhiteSpace(email))
            throw new ArgumentException("Email cannot be empty", nameof(email));
        var user = await _userManager.FindByEmailAsync(email);
        if (user == null)
        {
            _logger.LogInformation("Verification code requested for non-existent email: {Email}", email);
            return;
        }

        var code = await _verificationCodeService.GenerateAndStoreCodeAsync(email, "email_verification", TimeSpan.FromMinutes(ResetTokenExpirationMinutes));

        _logger.LogInformation("Verification code generated for {Email}", email);

        // Send code directly in email, no link
        await _emailService.SendVerificationEmailAsync(email, code);
    }

    public async Task<bool> VerifyCodeAsync(string email, string code)
    {
        if (string.IsNullOrWhiteSpace(email) || string.IsNullOrWhiteSpace(code))
            return false;

        var isValid = await _verificationCodeService.VerifyCodeAsync(email, code, "email_verification");
        
        if (!isValid)
        {
            _logger.LogWarning("Invalid verification code for {Email}", email);
            return false;
        }

        var user = await _userManager.FindByEmailAsync(email);
        if (user == null) return false;

        // Generate a new confirmation token since we verified the code
        var token = await _userManager.GenerateEmailConfirmationTokenAsync(user);
        var result = await _userManager.ConfirmEmailAsync(user, token);
        if (result.Succeeded)
        {
            SetVerifiedFlag(email);
            return true;
        }
        return false;
    }

    public async Task SendVerificationEmailAsync(string email)
    {
        var user = await _userManager.FindByEmailAsync(email);
        if (user == null) 
            throw new InvalidOperationException("User not found.");

        // Generate code using Redis service
        var code = await _verificationCodeService.GenerateAndStoreCodeAsync(email, "email_verification", TimeSpan.FromMinutes(ResetTokenExpirationMinutes));

        if (string.IsNullOrEmpty(user.Email))
            throw new InvalidOperationException("User email is not set.");

        await _emailService.SendVerificationEmailAsync(user.Email, code);
    }

    public async Task<bool> VerifyEmailAsync(string userId, string token)
    {
        if (string.IsNullOrWhiteSpace(userId) || string.IsNullOrWhiteSpace(token))
            return false;

        var user = await _userManager.FindByIdAsync(userId);
        if (user == null) return false;

        var result = await _userManager.ConfirmEmailAsync(user, token);
        if (result.Succeeded)
        {
            _logger.LogInformation("Email {Email} verified successfully", user.Email);
            return true;
        }

        _logger.LogWarning("Failed to verify email for user {UserId}: {Errors}", 
            userId, string.Join(", ", result.Errors.Select(e => e.Description)));
        return false;
    }

    public async Task SendResetPasswordCodeAsync(string email)
    {
        if (string.IsNullOrWhiteSpace(email))
            throw new ArgumentException("Email cannot be empty", nameof(email));

        var user = await _userManager.FindByEmailAsync(email);
        if (user == null)
        {
            _logger.LogInformation("Password reset requested for non-existent email: {Email}", email);
            return;
        }

        var code = await _verificationCodeService.GenerateAndStoreCodeAsync(email, "password_reset", TimeSpan.FromMinutes(ResetTokenExpirationMinutes));

        _logger.LogInformation("Password reset code generated for {Email}", email);

        var baseUrl = _configuration["BaseUrl"] ?? "https://localhost:7020";
        var resetLink = $"{baseUrl}/api/auth/reset-password?email={Uri.EscapeDataString(email)}&code={code}";

        await _emailService.SendPasswordResetEmailAsync(email, resetLink, code);
    }

    public async Task<bool> ResetPasswordAsync(ResetPasswordDto dto)
    {
        if (dto == null) 
            throw new ArgumentNullException(nameof(dto));

        if (string.IsNullOrWhiteSpace(dto.Email) || string.IsNullOrWhiteSpace(dto.NewPassword) || string.IsNullOrWhiteSpace(dto.NewPasswordConfirmed))
            return false;

        if (dto.NewPassword != dto.NewPasswordConfirmed)
            return false;

        // Require verification before allowing password reset
        // if (!WasCodeVerified(dto.Email))
        //     return false;

        var user = await _userManager.FindByEmailAsync(dto.Email);
        if (user == null)
        {
            _logger.LogWarning("Password reset attempt for non-existent email: {Email}", dto.Email);
            return false;
        }

        var token = await _userManager.GeneratePasswordResetTokenAsync(user);
        var result = await _userManager.ResetPasswordAsync(user, token, dto.NewPassword);
        if (result.Succeeded)
        {
            _logger.LogInformation("Password reset successful for {Email}", dto.Email);
            await _userManager.UpdateSecurityStampAsync(user);
            RemoveVerifiedFlag(dto.Email);
            return true;
        }

        var errors = string.Join(", ", result.Errors.Select(e => e.Description));
        _logger.LogWarning("Failed to reset password for {Email}: {Errors}", dto.Email, errors);
        return false;
    }

    public async Task<bool> VerifyResetPasswordCodeAsync(string email, string code)
    {
        if (string.IsNullOrWhiteSpace(email) || string.IsNullOrWhiteSpace(code))
            return false;
        
        return await _verificationCodeService.VerifyCodeAsync(email, code, "password_reset");
    }

    // In-memory verification flag store for one-time use per email
    private static readonly ConcurrentDictionary<string, bool> _verifiedEmails = new();
    public bool WasCodeVerified(string email) => _verifiedEmails.TryGetValue(email, out var ok) && ok;
    public void SetVerifiedFlag(string email) => _verifiedEmails[email] = true;
    public void RemoveVerifiedFlag(string email) => _verifiedEmails.TryRemove(email, out _);

    private Task<string> GenerateJwtToken(User user)
    {
        if (user == null) throw new ArgumentNullException(nameof(user));

        var jwtKey = SecretsConfiguration.GetRequiredSecret("JWT_KEY", "JWT signing key");

        var email = user.Email ?? throw new InvalidOperationException("User email is not set.");
        var username = user.UserName ?? throw new InvalidOperationException("User username is not set.");

        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.ASCII.GetBytes(jwtKey);
        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Email, email),
                new Claim(ClaimTypes.Name, username)
            }),
            Expires = DateTime.UtcNow.AddDays(7),
            Issuer = SecretsConfiguration.GetRequiredSecret("JWT_ISSUER", "JWT issuer"),
            Audience = SecretsConfiguration.GetRequiredSecret("JWT_AUDIENCE", "JWT audience"),
            SigningCredentials = new SigningCredentials(
                new SymmetricSecurityKey(key),
                SecurityAlgorithms.HmacSha256Signature)
        };

        var token = tokenHandler.CreateToken(tokenDescriptor);
        return Task.FromResult(tokenHandler.WriteToken(token));
    }

}
