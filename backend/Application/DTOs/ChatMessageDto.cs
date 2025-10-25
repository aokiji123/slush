using System;
using System.Collections.Generic;

namespace Application.DTOs;

public class ChatMessageDto
{
    public Guid Id { get; set; }
    public Guid SenderId { get; set; }
    public Guid ReceiverId { get; set; }
    public string? Content { get; set; }
    public ChatMessageTypeDto MessageType { get; set; }
    public string? MediaUrl { get; set; }
    public string? FileName { get; set; }
    public long? FileSize { get; set; }
    public string? ContentType { get; set; }
    public DateTime CreatedAt { get; set; }
    public bool IsEdited { get; set; }
    public DateTime? EditedAt { get; set; }
    public UserBasicDto? Sender { get; set; }
    public UserBasicDto? Receiver { get; set; }
    public List<ChatMessageAttachmentDto> Attachments { get; set; } = new();
}

public class ChatMessageAttachmentDto
{
    public Guid Id { get; set; }
    public Guid MessageId { get; set; }
    public ChatMessageTypeDto AttachmentType { get; set; }
    public string Url { get; set; } = string.Empty;
    public string FileName { get; set; } = string.Empty;
    public long FileSize { get; set; }
    public string? ContentType { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class UserBasicDto
{
    public Guid Id { get; set; }
    public string UserName { get; set; } = string.Empty;
    public string Nickname { get; set; } = string.Empty;
    public string? Avatar { get; set; }
    public bool IsOnline { get; set; }
}

public enum ChatMessageTypeDto
{
    Text = 0,
    Image = 1,
    Video = 2,
    Audio = 3
}
