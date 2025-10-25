using System;

namespace Application.DTOs;

public class TypingIndicatorDto
{
    public Guid UserId { get; set; }
    public string UserNickname { get; set; } = string.Empty;
    public string? UserAvatar { get; set; }
    public bool IsTyping { get; set; }
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;
}
