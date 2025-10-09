using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Application.Interfaces;
using Microsoft.Extensions.Logging;

namespace API.Controllers;

[ApiController]
[Route("api/test")]
[AllowAnonymous] // Only for testing - remove in production
public class TestEmailController : ControllerBase
{
    private readonly IEmailService _emailService;
    private readonly ILogger<TestEmailController> _logger;

    public TestEmailController(
        IEmailService emailService,
        ILogger<TestEmailController> logger)
    {
        _emailService = emailService;
        _logger = logger;
    }

    [HttpPost("send-test-email")]
    public async Task<IActionResult> SendTestEmail(string to = "slavik.art.off@gmail.com")
    {
        try
        {
            var subject = "✅ Test Email from Slush";
            var message = "<h1>Hello from Slush!</h1>" +
                        "<p>This is a test email to verify that email sending is working correctly.</p>" +
                        "<p>If you're seeing this, your email configuration is correct!</p>" +
                        "<p>Best regards,<br/>The Slush Team</p>";

            await _emailService.SendEmailAsync(to, subject, message);
            
            return Ok(new { success = true, message = $"Test email sent to {to}" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error sending test email to {Email}", to);
            return StatusCode(500, new { 
                success = false, 
                message = "Failed to send test email",
                error = ex.Message
            });
        }
    }
}
