using System;
using System.Threading.Tasks;
using Application.Interfaces;
using MailKit.Net.Smtp;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using MimeKit;
using System.Text;
using System.Collections.Generic; // Added for List
using Infrastructure.Configuration;

namespace Infrastructure.Services
{
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _configuration;
        private readonly ILogger<EmailService> _logger;

        public EmailService(IConfiguration configuration, ILogger<EmailService> logger)
        {
            _configuration = configuration;
            _logger = logger;
        }

        public async Task SendEmailAsync(string to, string subject, string htmlMessage)
        {
            if (string.IsNullOrEmpty(to)) throw new ArgumentException("Recipient email cannot be empty", nameof(to));
            if (string.IsNullOrEmpty(subject)) throw new ArgumentException("Email subject cannot be empty", nameof(subject));
            if (string.IsNullOrEmpty(htmlMessage)) throw new ArgumentException("Email body cannot be empty", nameof(htmlMessage));

            _logger.LogInformation("Preparing to send email to {To}", to);
            
            // Validate configuration before proceeding
            ValidateEmailConfiguration();
            
            var fromEmail = SecretsConfiguration.GetRequiredSecret("EMAIL_FROM", "Email sender address");
            var smtpServer = SecretsConfiguration.GetRequiredSecret("EMAIL_SMTP_SERVER", "SMTP server address");
            var port = SecretsConfiguration.GetRequiredIntSecret("EMAIL_PORT", "SMTP server port");
            var username = SecretsConfiguration.GetRequiredSecret("EMAIL_USERNAME", "Email username");
            
            _logger.LogDebug("SMTP Configuration - Server: {SmtpServer}, Port: {Port}, From: {From}", 
                smtpServer, port, fromEmail);

            var email = new MimeMessage();
            email.From.Add(MailboxAddress.Parse(fromEmail));
            email.To.Add(MailboxAddress.Parse(to));
            email.Subject = subject;
            email.Body = new TextPart(MimeKit.Text.TextFormat.Html) { Text = htmlMessage };

            using var smtp = new SmtpClient();
            try
            {
                _logger.LogInformation("Connecting to SMTP server...");
                await smtp.ConnectAsync(
                    smtpServer,
                    port,
                    MailKit.Security.SecureSocketOptions.StartTls);
                _logger.LogInformation("Connected to SMTP server");

                _logger.LogInformation("Authenticating with SMTP server...");
                await smtp.AuthenticateAsync(username, SecretsConfiguration.GetRequiredSecret("EMAIL_PASSWORD", "Email password"));
                _logger.LogInformation("Successfully authenticated with SMTP server");

                _logger.LogInformation("Sending email...");
                await smtp.SendAsync(email);
                _logger.LogInformation("Email sent successfully");
                
                await smtp.DisconnectAsync(true);
                _logger.LogInformation("Disconnected from SMTP server");
                
                _logger.LogInformation("Email successfully sent to {To}", to);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error sending email to {To}. SMTP Server: {SmtpServer}:{Port}", 
                    to, smtpServer, port);
                throw new InvalidOperationException($"Failed to send email to {to}. Error: {ex.Message}", ex);
            }
        }

        public async Task SendVerificationEmailAsync(string email, string code)
        {
            var subject = "🔐 Verify Your Email Address";
            var message = BuildEmailTemplate(
                "Verify Your Email",
                $"<p>Welcome to Slush! We're excited to have you on board.</p>" +
                $"<p>Your verification code is:</p>" +
                $"<h2 style='text-align:center; font-size: 32px; letter-spacing: 5px; margin: 20px 0;'>{code}</h2>" +
                $"<p>Enter this code in the app to verify your email address.</p>",
                null,
                null,
                "If you didn't create an account, you can safely ignore this email."
            );

            await SendEmailAsync(email, subject, message);
        }

        public async Task SendPasswordResetEmailAsync(string email, string resetLink, string code)
        {
            var subject = "🔑 Password Reset Request";
            var message = BuildEmailTemplate(
                "Reset Your Password",
                $"<p>We received a request to reset your password. Your verification code is:</p>" +
                $"<h2 style='text-align:center; font-size: 32px; letter-spacing: 5px; margin: 20px 0;'>{code}</h2>" +
                $"<p>Or click the button below to reset your password:</p>",
                resetLink,
                "Reset Password",
                $"This link will expire in 15 minutes.<br>If you didn't request a password reset, please ignore this email or contact support if you have concerns."
            );

            await SendEmailAsync(email, subject, message);
        }

        private string BuildEmailTemplate(string title, string message, string actionUrl, string actionText, string? footer = null)
        {
            var template = new StringBuilder();
            template.AppendLine(@"
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
                        .container { border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden; }
                        .header { background-color: #4a6cf7; color: white; padding: 20px; text-align: center; }
                        .content { padding: 30px; background-color: #ffffff; }
                        .button {
                            display: inline-block; 
                            padding: 12px 30px; 
                            margin: 20px 0; 
                            background-color: #4a6cf7; 
                            color: white; 
                            text-decoration: none; 
                            border-radius: 4px; 
                            font-weight: bold;
                        }
                        .footer { 
                            margin-top: 30px; 
                            padding-top: 20px; 
                            border-top: 1px solid #e0e0e0; 
                            font-size: 12px; 
                            color: #777;
                        }
                    </style>
                </head>
                <body>
                    <div class='container'>
                        <div class='header'>
                            <h1>Slush</h1>
                        </div>
                        <div class='content'>
                            <h2>" + title + @"</h2>");

            template.AppendLine(message);
            
            if (!string.IsNullOrEmpty(actionUrl))
            {
                template.AppendLine($"<div style='text-align: center;'><a href='{actionUrl}' class='button'>{actionText}</a></div>");
            }
            
            if (!string.IsNullOrEmpty(footer))
            {
                template.AppendLine($"<div class='footer'>{footer}</div>");
            }

            template.AppendLine(@"
                        </div>
                    </div>
                </body>
                </html>");

            return template.ToString();
        }

        private void ValidateEmailConfiguration()
        {
            var requiredSettings = new[] { "EMAIL_FROM", "EMAIL_SMTP_SERVER", "EMAIL_PORT", "EMAIL_USERNAME", "EMAIL_PASSWORD" };
            var missingSettings = new List<string>();

            foreach (var setting in requiredSettings)
            {
                if (string.IsNullOrEmpty(Environment.GetEnvironmentVariable(setting)))
                {
                    missingSettings.Add(setting);
                }
            }

            if (missingSettings.Count > 0)
            {
                throw new InvalidOperationException($"Missing required email configuration: {string.Join(", ", missingSettings)}");
            }
        }
    }
}
