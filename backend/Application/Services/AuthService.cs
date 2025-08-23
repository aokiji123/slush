using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using Application.DTOs;
using Application.Interfaces;
using Domain.Entities;
using Domain.Interfaces;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace Application.Services;

public class AuthService : IAuthService
{
    private readonly IAuthRepository _authRepository;
    private readonly IConfiguration _configuration;

    public AuthService(IAuthRepository authRepository, IConfiguration configuration)
    {
        _authRepository = authRepository;
        _configuration = configuration;
    }

    public async Task<AuthResponseDto> LoginAsync(LoginDto loginDto)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(loginDto.Email) || string.IsNullOrWhiteSpace(loginDto.Password))
            {
                return new AuthResponseDto
                {
                    Success = false,
                    Message = "Email and password are required",
                    Errors = new List<string> { "Email and password cannot be empty" }
                };
            }

            var user = await _authRepository.GetUserByEmailAsync(loginDto.Email.Trim().ToLower());
            
            if (user == null)
            {
                return new AuthResponseDto
                {
                    Success = false,
                    Message = "Invalid email or password",
                    Errors = new List<string> { "Invalid credentials" }
                };
            }

            if (!VerifyPassword(loginDto.Password, user.Password))
            {
                return new AuthResponseDto
                {
                    Success = false,
                    Message = "Invalid email or password",
                    Errors = new List<string> { "Invalid credentials" }
                };
            }

            var token = GenerateJwtToken(user);
            var userDto = MapToUserDto(user);

            return new AuthResponseDto
            {
                Success = true,
                Message = "Login successful",
                Token = token,
                User = userDto
            };
        }
        catch (Exception ex)
        {
            return new AuthResponseDto
            {
                Success = false,
                Message = "An error occurred during login",
                Errors = new List<string> { ex.Message }
            };
        }
    }

    public async Task<AuthResponseDto> SignUpAsync(SignUpDto signUpDto)
    {
        try
        {
            var errors = new List<string>();

            // Validate input
            if (string.IsNullOrWhiteSpace(signUpDto.Login))
                errors.Add("Username is required");
            else if (signUpDto.Login.Length < 3)
                errors.Add("Username must be at least 3 characters long");
            else if (signUpDto.Login.Length > 100)
                errors.Add("Username cannot exceed 100 characters");

            if (string.IsNullOrWhiteSpace(signUpDto.Email))
                errors.Add("Email is required");
            else if (!IsValidEmail(signUpDto.Email))
                errors.Add("Invalid email format");

            if (string.IsNullOrWhiteSpace(signUpDto.Password))
                errors.Add("Password is required");
            else if (signUpDto.Password.Length < 6)
                errors.Add("Password must be at least 6 characters long");

            if (signUpDto.Password != signUpDto.RepeatPassword)
                errors.Add("Passwords do not match");

            if (errors.Any())
            {
                return new AuthResponseDto
                {
                    Success = false,
                    Message = "Validation failed",
                    Errors = errors
                };
            }

            // Check if user already exists
            var normalizedEmail = signUpDto.Email.Trim().ToLower();
            var normalizedUsername = signUpDto.Login.Trim();

            if (await _authRepository.UserExistsByEmailAsync(normalizedEmail))
            {
                return new AuthResponseDto
                {
                    Success = false,
                    Message = "User with this email already exists",
                    Errors = new List<string> { "Email is already registered" }
                };
            }

            if (await _authRepository.UserExistsByUsernameAsync(normalizedUsername))
            {
                return new AuthResponseDto
                {
                    Success = false,
                    Message = "Username is already taken",
                    Errors = new List<string> { "Username is already in use" }
                };
            }

            // Create new user
            var hashedPassword = HashPassword(signUpDto.Password);
            var user = new User
            {
                Id = Guid.NewGuid(),
                Username = normalizedUsername,
                Email = normalizedEmail,
                Password = hashedPassword,
                CreatedAtDateTime = DateTime.UtcNow
            };

            await _authRepository.CreateUserAsync(user);

            var token = GenerateJwtToken(user);
            var userDto = MapToUserDto(user);

            return new AuthResponseDto
            {
                Success = true,
                Message = "Registration successful",
                Token = token,
                User = userDto
            };
        }
        catch (Exception ex)
        {
            return new AuthResponseDto
            {
                Success = false,
                Message = "An error occurred during registration",
                Errors = new List<string> { ex.Message }
            };
        }
    }

    public async Task<AuthResponseDto> ForgotPasswordAsync(ForgotPasswordDto forgotPasswordDto)
    {
        if (!forgotPasswordDto.Captcha)
        {
            return new AuthResponseDto
            {
                Success = false,
                Message = "Please complete the captcha"
            };
        }

        var user = await _authRepository.GetUserByEmailAsync(forgotPasswordDto.Email);
        
        if (user == null)
        {
            // Return success even if user doesn't exist for security reasons
            return new AuthResponseDto
            {
                Success = true,
                Message = "If the email exists, a password reset link has been sent"
            };
        }

        // Generate reset token
        var resetToken = GenerateResetToken();
        var expiry = DateTime.UtcNow.AddHours(24); // Token expires in 24 hours

        await _authRepository.SavePasswordResetTokenAsync(user.Id, resetToken, expiry);

        // TODO: Send email with reset link
        // For now, we'll just return success
        // In production, you would send an email with the reset link

        return new AuthResponseDto
        {
            Success = true,
            Message = "If the email exists, a password reset link has been sent"
        };
    }

    public async Task<AuthResponseDto> ChangePasswordAsync(Guid userId, ChangePasswordDto changePasswordDto)
    {
        try
        {
            var errors = new List<string>();

            // Validate input
            if (string.IsNullOrWhiteSpace(changePasswordDto.OldPassword))
                errors.Add("Current password is required");

            if (string.IsNullOrWhiteSpace(changePasswordDto.NewPassword))
                errors.Add("New password is required");
            else if (changePasswordDto.NewPassword.Length < 6)
                errors.Add("New password must be at least 6 characters long");

            if (errors.Any())
            {
                return new AuthResponseDto
                {
                    Success = false,
                    Message = "Validation failed",
                    Errors = errors
                };
            }

            var user = await _authRepository.GetUserByIdAsync(userId);
            
            if (user == null)
            {
                return new AuthResponseDto
                {
                    Success = false,
                    Message = "User not found",
                    Errors = new List<string> { "User account not found" }
                };
            }

            if (!VerifyPassword(changePasswordDto.OldPassword, user.Password))
            {
                return new AuthResponseDto
                {
                    Success = false,
                    Message = "Current password is incorrect",
                    Errors = new List<string> { "The current password you entered is incorrect" }
                };
            }

            if (changePasswordDto.OldPassword == changePasswordDto.NewPassword)
            {
                return new AuthResponseDto
                {
                    Success = false,
                    Message = "New password must be different from current password",
                    Errors = new List<string> { "New password cannot be the same as current password" }
                };
            }

            user.Password = HashPassword(changePasswordDto.NewPassword);
            await _authRepository.UpdateUserAsync(user);

            return new AuthResponseDto
            {
                Success = true,
                Message = "Password changed successfully"
            };
        }
        catch (Exception ex)
        {
            return new AuthResponseDto
            {
                Success = false,
                Message = "An error occurred while changing password",
                Errors = new List<string> { ex.Message }
            };
        }
    }

    public async Task<AuthResponseDto> ResetPasswordAsync(ResetPasswordDto resetPasswordDto)
    {
        try
        {
            var errors = new List<string>();

            // Validate input
            if (string.IsNullOrWhiteSpace(resetPasswordDto.Token))
                errors.Add("Reset token is required");

            if (string.IsNullOrWhiteSpace(resetPasswordDto.NewPassword))
                errors.Add("New password is required");
            else if (resetPasswordDto.NewPassword.Length < 6)
                errors.Add("New password must be at least 6 characters long");

            if (errors.Any())
            {
                return new AuthResponseDto
                {
                    Success = false,
                    Message = "Validation failed",
                    Errors = errors
                };
            }

            var userId = await _authRepository.GetUserIdByResetTokenAsync(resetPasswordDto.Token);
            
            if (userId == null)
            {
                return new AuthResponseDto
                {
                    Success = false,
                    Message = "Invalid or expired reset token",
                    Errors = new List<string> { "The password reset link is invalid or has expired" }
                };
            }

            var user = await _authRepository.GetUserByIdAsync(userId.Value);
            
            if (user == null)
            {
                return new AuthResponseDto
                {
                    Success = false,
                    Message = "User not found",
                    Errors = new List<string> { "User account not found" }
                };
            }

            user.Password = HashPassword(resetPasswordDto.NewPassword);
            await _authRepository.UpdateUserAsync(user);
            await _authRepository.DeleteResetTokenAsync(resetPasswordDto.Token);

            return new AuthResponseDto
            {
                Success = true,
                Message = "Password reset successfully"
            };
        }
        catch (Exception ex)
        {
            return new AuthResponseDto
            {
                Success = false,
                Message = "An error occurred while resetting password",
                Errors = new List<string> { ex.Message }
            };
        }
    }

    public Task<bool> ValidateTokenAsync(string token)
    {
        try
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_configuration["Jwt:Key"] ?? "your-super-secret-key-with-at-least-32-characters");
            
            tokenHandler.ValidateToken(token, new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(key),
                ValidateIssuer = true,
                ValidIssuer = _configuration["Jwt:Issuer"] ?? "SlushAPI",
                ValidateAudience = true,
                ValidAudience = _configuration["Jwt:Audience"] ?? "SlushUsers",
                ClockSkew = TimeSpan.Zero
            }, out SecurityToken validatedToken);

            return Task.FromResult(true);
        }
        catch
        {
            return Task.FromResult(false);
        }
    }

    public Task<Guid?> GetUserIdFromTokenAsync(string token)
    {
        try
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var jwtToken = tokenHandler.ReadJwtToken(token);
            
            var userIdClaim = jwtToken.Claims.FirstOrDefault(x => x.Type == ClaimTypes.NameIdentifier);
            if (userIdClaim != null && Guid.TryParse(userIdClaim.Value, out Guid userId))
            {
                return Task.FromResult<Guid?>(userId);
            }
            
            return Task.FromResult<Guid?>(null);
        }
        catch
        {
            return Task.FromResult<Guid?>(null);
        }
    }

    private string GenerateJwtToken(User user)
    {
        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.ASCII.GetBytes(_configuration["Jwt:Key"] ?? "your-super-secret-key-with-at-least-32-characters");
        
        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.Email, user.Email)
            }),
            Expires = DateTime.UtcNow.AddDays(7), // Token expires in 7 days
            Issuer = _configuration["Jwt:Issuer"] ?? "SlushAPI",
            Audience = _configuration["Jwt:Audience"] ?? "SlushUsers",
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
        };
        
        var token = tokenHandler.CreateToken(tokenDescriptor);
        return tokenHandler.WriteToken(token);
    }

    private string HashPassword(string password)
    {
        using var sha256 = SHA256.Create();
        var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
        return Convert.ToBase64String(hashedBytes);
    }

    private bool VerifyPassword(string password, string hashedPassword)
    {
        var hashedInput = HashPassword(password);
        return hashedInput == hashedPassword;
    }

    private string GenerateResetToken()
    {
        return Convert.ToBase64String(Guid.NewGuid().ToByteArray())
            .Replace("/", "_")
            .Replace("+", "-")
            .Replace("=", "")
            .Substring(0, 22);
    }

    private UserDto MapToUserDto(User user)
    {
        return new UserDto
        {
            Id = user.Id,
            Username = user.Username,
            Email = user.Email,
            Bio = user.Bio,
            Avatar = user.Avatar,
            CreatedAtDateTime = user.CreatedAtDateTime
        };
    }

    private bool IsValidEmail(string email)
    {
        try
        {
            var addr = new System.Net.Mail.MailAddress(email);
            return addr.Address == email;
        }
        catch
        {
            return false;
        }
    }
}
