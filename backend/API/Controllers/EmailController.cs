using System;
using System.Threading.Tasks;
using Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Domain.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class EmailController : ControllerBase
{
    private readonly IAuthService _authService;
    private readonly ILogger<EmailController> _logger;
    private readonly IEmailService _emailService;
    private readonly UserManager<User> _userManager;
    private readonly IConfiguration _configuration;

    public EmailController(
        IAuthService authService, 
        ILogger<EmailController> logger, 
        IEmailService emailService,
        UserManager<User> userManager,
        IConfiguration configuration)
    {
        _authService = authService;
        _logger = logger;
        _emailService = emailService;
        _userManager = userManager;
        _configuration = configuration;
    }

    [HttpGet("verify-email")]
    [AllowAnonymous]
    public async Task<IActionResult> VerifyEmail([FromQuery] string userId, [FromQuery] string token)
    {
        if (string.IsNullOrEmpty(userId) || string.IsNullOrEmpty(token))
        {
            return BadRequest("Invalid verification link");
        }

        var result = await _authService.VerifyEmailAsync(userId, token);
        
        if (result)
        {
            return Ok("Email verified successfully. You can now log in.");
        }
        
        return BadRequest("Invalid or expired verification link. Please request a new one.");
    }

    [HttpPost("resend-verification")]
    [AllowAnonymous]
    public async Task<IActionResult> ResendVerificationEmail([FromBody] ResendVerificationEmailDto dto)
    {
        if (string.IsNullOrEmpty(dto?.Email))
        {
            return BadRequest("Email is required");
        }

        try
        {
            await _authService.SendVerificationEmailAsync(dto.Email);
            return Ok("Verification email sent. Please check your inbox.");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error sending verification email to {Email}", dto.Email);
            return StatusCode(500, "Failed to send verification email. Please try again later.");
        }
    }
}

public class ResendVerificationEmailDto
{
    public string Email { get; set; } = string.Empty;
}
