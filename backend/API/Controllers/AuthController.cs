using System;
using System.Linq;
using Application.DTOs;
using Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;
    private readonly ILogger<AuthController> _logger;

    public AuthController(IAuthService authService, ILogger<AuthController> logger)
    {
        _authService = authService;
        _logger = logger;
    }

    /// <summary>
    /// User login
    /// </summary>
    /// <param name="loginDto">Login credentials</param>
    /// <returns>Authentication response with JWT token</returns>
    [HttpPost("login")]
    public async Task<ActionResult<AuthResponseDto>> Login([FromBody] LoginDto loginDto)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                _logger.LogWarning("Login attempt with invalid model state");
                return BadRequest(new AuthResponseDto
                {
                    Success = false,
                    Message = "Invalid input data",
                    Errors = ModelState.Values
                        .SelectMany(v => v.Errors)
                        .Select(e => e.ErrorMessage)
                        .ToList()
                });
            }

            _logger.LogInformation("Login attempt for email: {Email}", loginDto.Email);
            var result = await _authService.LoginAsync(loginDto);
            
            if (!result.Success)
            {
                _logger.LogWarning("Failed login attempt for email: {Email}", loginDto.Email);
                return BadRequest(result);
            }

            _logger.LogInformation("Successful login for user: {Email}", loginDto.Email);
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during login for email: {Email}", loginDto?.Email);
            return StatusCode(500, new AuthResponseDto
            {
                Success = false,
                Message = "An error occurred during login. Please try again."
            });
        }
    }

    /// <summary>
    /// User registration
    /// </summary>
    /// <param name="signUpDto">Registration data</param>
    /// <returns>Authentication response with JWT token</returns>
    [HttpPost("sign-up")]
    public async Task<ActionResult<AuthResponseDto>> SignUp([FromBody] SignUpDto signUpDto)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                _logger.LogWarning("Sign up attempt with invalid model state");
                return BadRequest(new AuthResponseDto
                {
                    Success = false,
                    Message = "Invalid input data",
                    Errors = ModelState.Values
                        .SelectMany(v => v.Errors)
                        .Select(e => e.ErrorMessage)
                        .ToList()
                });
            }

            _logger.LogInformation("Sign up attempt for email: {Email}, username: {Username}", 
                signUpDto.Email, signUpDto.Login);
            
            var result = await _authService.SignUpAsync(signUpDto);
            
            if (!result.Success)
            {
                _logger.LogWarning("Failed sign up attempt for email: {Email}", signUpDto.Email);
                return BadRequest(result);
            }

            _logger.LogInformation("Successful registration for user: {Email}", signUpDto.Email);
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during sign up for email: {Email}", signUpDto?.Email);
            return StatusCode(500, new AuthResponseDto
            {
                Success = false,
                Message = "An error occurred during registration. Please try again."
            });
        }
    }

    /// <summary>
    /// Request password reset
    /// </summary>
    /// <param name="forgotPasswordDto">Email and captcha verification</param>
    /// <returns>Success response</returns>
    [HttpPost("forgot-password")]
    public async Task<ActionResult<AuthResponseDto>> ForgotPassword([FromBody] ForgotPasswordDto forgotPasswordDto)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                _logger.LogWarning("Forgot password attempt with invalid model state");
                return BadRequest(new AuthResponseDto
                {
                    Success = false,
                    Message = "Invalid input data",
                    Errors = ModelState.Values
                        .SelectMany(v => v.Errors)
                        .Select(e => e.ErrorMessage)
                        .ToList()
                });
            }

            if (!forgotPasswordDto.Captcha)
            {
                _logger.LogWarning("Forgot password attempt without captcha verification for email: {Email}", 
                    forgotPasswordDto.Email);
                return BadRequest(new AuthResponseDto
                {
                    Success = false,
                    Message = "Please complete the captcha verification"
                });
            }

            _logger.LogInformation("Password reset request for email: {Email}", forgotPasswordDto.Email);
            var result = await _authService.ForgotPasswordAsync(forgotPasswordDto);
            
            if (!result.Success)
            {
                _logger.LogWarning("Failed password reset request for email: {Email}", forgotPasswordDto.Email);
                return BadRequest(result);
            }

            _logger.LogInformation("Password reset email sent for: {Email}", forgotPasswordDto.Email);
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during forgot password for email: {Email}", forgotPasswordDto?.Email);
            return StatusCode(500, new AuthResponseDto
            {
                Success = false,
                Message = "An error occurred while processing your request. Please try again."
            });
        }
    }

    /// <summary>
    /// Change password (authenticated user)
    /// </summary>
    /// <param name="changePasswordDto">Old and new password</param>
    /// <returns>Success response</returns>
    [HttpPost("change-password")]
    [Authorize]
    public async Task<ActionResult<AuthResponseDto>> ChangePassword([FromBody] ChangePasswordDto changePasswordDto)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                _logger.LogWarning("Change password attempt with invalid model state");
                return BadRequest(new AuthResponseDto
                {
                    Success = false,
                    Message = "Invalid input data",
                    Errors = ModelState.Values
                        .SelectMany(v => v.Errors)
                        .Select(e => e.ErrorMessage)
                        .ToList()
                });
            }

            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out Guid userId))
            {
                _logger.LogWarning("Change password attempt with invalid user claim");
                return Unauthorized(new AuthResponseDto
                {
                    Success = false,
                    Message = "Invalid authentication token"
                });
            }

            _logger.LogInformation("Password change attempt for user ID: {UserId}", userId);
            var result = await _authService.ChangePasswordAsync(userId, changePasswordDto);
            
            if (!result.Success)
            {
                _logger.LogWarning("Failed password change attempt for user ID: {UserId}", userId);
                return BadRequest(result);
            }

            _logger.LogInformation("Successful password change for user ID: {UserId}", userId);
            return Ok(result);
        }
        catch (Exception ex)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            _logger.LogError(ex, "Error during password change for user ID: {UserId}", userId);
            return StatusCode(500, new AuthResponseDto
            {
                Success = false,
                Message = "An error occurred while changing password. Please try again."
            });
        }
    }

    /// <summary>
    /// Change password (PUT method for authenticated user)
    /// </summary>
    /// <param name="changePasswordDto">Old and new password</param>
    /// <returns>Success response</returns>
    [HttpPut("change-password")]
    [Authorize]
    public async Task<ActionResult<AuthResponseDto>> ChangePasswordPut([FromBody] ChangePasswordDto changePasswordDto)
    {
        return await ChangePassword(changePasswordDto);
    }

    /// <summary>
    /// Reset password using reset token
    /// </summary>
    /// <param name="resetPasswordDto">Reset token and new password</param>
    /// <returns>Success response</returns>
    [HttpPost("reset-password")]
    public async Task<ActionResult<AuthResponseDto>> ResetPassword([FromBody] ResetPasswordDto resetPasswordDto)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                _logger.LogWarning("Reset password attempt with invalid model state");
                return BadRequest(new AuthResponseDto
                {
                    Success = false,
                    Message = "Invalid input data",
                    Errors = ModelState.Values
                        .SelectMany(v => v.Errors)
                        .Select(e => e.ErrorMessage)
                        .ToList()
                });
            }

            _logger.LogInformation("Password reset attempt with token: {Token}", 
                resetPasswordDto.Token.Substring(0, Math.Min(10, resetPasswordDto.Token.Length)) + "...");
            
            var result = await _authService.ResetPasswordAsync(resetPasswordDto);
            
            if (!result.Success)
            {
                _logger.LogWarning("Failed password reset attempt with token: {Token}", 
                    resetPasswordDto.Token.Substring(0, Math.Min(10, resetPasswordDto.Token.Length)) + "...");
                return BadRequest(result);
            }

            _logger.LogInformation("Successful password reset with token: {Token}", 
                resetPasswordDto.Token.Substring(0, Math.Min(10, resetPasswordDto.Token.Length)) + "...");
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during password reset");
            return StatusCode(500, new AuthResponseDto
            {
                Success = false,
                Message = "An error occurred while resetting password. Please try again."
            });
        }
    }

    /// <summary>
    /// Validate JWT token
    /// </summary>
    /// <returns>Token validation result</returns>
    [HttpGet("validate-token")]
    [Authorize]
    public async Task<ActionResult<AuthResponseDto>> ValidateToken()
    {
        try
        {
            var token = Request.Headers["Authorization"].FirstOrDefault()?.Split(" ").Last();
            
            if (string.IsNullOrEmpty(token))
            {
                _logger.LogWarning("Token validation attempt without token");
                return Unauthorized(new AuthResponseDto
                {
                    Success = false,
                    Message = "No token provided"
                });
            }

            var isValid = await _authService.ValidateTokenAsync(token);
            
            if (!isValid)
            {
                _logger.LogWarning("Token validation failed for token: {Token}", 
                    token.Substring(0, Math.Min(10, token.Length)) + "...");
                return Unauthorized(new AuthResponseDto
                {
                    Success = false,
                    Message = "Invalid token"
                });
            }

            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            _logger.LogInformation("Token validation successful for user ID: {UserId}", userId);
            
            return Ok(new AuthResponseDto
            {
                Success = true,
                Message = "Token is valid",
                User = new UserDto
                {
                    Id = Guid.Parse(userId!),
                    Username = User.FindFirst(ClaimTypes.Name)?.Value ?? "",
                    Email = User.FindFirst(ClaimTypes.Email)?.Value ?? ""
                }
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during token validation");
            return StatusCode(500, new AuthResponseDto
            {
                Success = false,
                Message = "An error occurred while validating token"
            });
        }
    }

    /// <summary>
    /// Get current user profile
    /// </summary>
    /// <returns>Current user information</returns>
    [HttpGet("profile")]
    [Authorize]
    public ActionResult<AuthResponseDto> GetProfile()
    {
        try
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out Guid userId))
            {
                return Unauthorized(new AuthResponseDto
                {
                    Success = false,
                    Message = "Invalid authentication token"
                });
            }

            var userDto = new UserDto
            {
                Id = userId,
                Username = User.FindFirst(ClaimTypes.Name)?.Value ?? "",
                Email = User.FindFirst(ClaimTypes.Email)?.Value ?? ""
            };

            return Ok(new AuthResponseDto
            {
                Success = true,
                Message = "Profile retrieved successfully",
                User = userDto
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving user profile");
            return StatusCode(500, new AuthResponseDto
            {
                Success = false,
                Message = "An error occurred while retrieving profile"
            });
        }
    }
}
