using System;

namespace Application.Common.Configuration;

/// <summary>
/// Strongly-typed configuration settings for the application
/// </summary>
public class AppSettings
{
    public DatabaseSettings Database { get; set; } = new();
    public JwtSettings Jwt { get; set; } = new();
    public EmailSettings Email { get; set; } = new();
    public SupabaseSettings Supabase { get; set; } = new();
    public CorsSettings Cors { get; set; } = new();
    public CacheSettings Cache { get; set; } = new();
}

public class DatabaseSettings
{
    public string Host { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Username { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public bool UseSsl { get; set; } = true;
    public string SslMode { get; set; } = "VerifyFull";
    public bool ChannelBinding { get; set; } = true;
}

public class JwtSettings
{
    public string Key { get; set; } = string.Empty;
    public string Issuer { get; set; } = string.Empty;
    public string Audience { get; set; } = string.Empty;
    public int ExpirationDays { get; set; } = 7;
    public int RefreshTokenExpirationDays { get; set; } = 30;
}

public class EmailSettings
{
    public string From { get; set; } = string.Empty;
    public string SmtpServer { get; set; } = string.Empty;
    public int Port { get; set; } = 587;
    public string Username { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public bool UseSsl { get; set; } = true;
}

public class SupabaseSettings
{
    public string Url { get; set; } = string.Empty;
    public string Key { get; set; } = string.Empty;
    public string Bucket { get; set; } = string.Empty;
}

public class CorsSettings
{
    public string[] AllowedOrigins { get; set; } = Array.Empty<string>();
    public int PreflightMaxAgeSeconds { get; set; } = 2520;
}

public class CacheSettings
{
    public int DefaultExpirationMinutes { get; set; } = 5;
    public string RedisConnectionString { get; set; } = string.Empty;
    public bool UseRedis { get; set; } = false;
}
