using System;

namespace Application.DTOs;

public class ChatConversationDto
{
    public Guid FriendId { get; set; }
    public string FriendNickname { get; set; } = string.Empty;
    public string? FriendAvatar { get; set; }
    public bool FriendIsOnline { get; set; }
    public ChatMessageDto? LastMessage { get; set; }
    public int UnreadCount { get; set; }
    public DateTime LastActivityAt { get; set; }
}
