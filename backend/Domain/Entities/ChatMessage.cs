using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Domain.Entities;

public class ChatMessage
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    public Guid SenderId { get; set; }

    [Required]
    public Guid ReceiverId { get; set; }

    [MaxLength(2000)]
    public string? Content { get; set; }

    [Required]
    public ChatMessageType MessageType { get; set; } = ChatMessageType.Text;

    [MaxLength(500)]
    public string? MediaUrl { get; set; }

    [MaxLength(255)]
    public string? FileName { get; set; }

    public long? FileSize { get; set; }

    [MaxLength(100)]
    public string? ContentType { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public bool IsEdited { get; set; } = false;

    public DateTime? EditedAt { get; set; }

    public bool IsDeleted { get; set; } = false;

    public DateTime? DeletedAt { get; set; }

    // Navigation properties
    public User? Sender { get; set; }
    public User? Receiver { get; set; }
    public virtual ICollection<ChatMessageAttachment> Attachments { get; set; } = new List<ChatMessageAttachment>();
}

public enum ChatMessageType
{
    Text = 0,
    Image = 1,
    Video = 2,
    Audio = 3
}
