using System.ComponentModel.DataAnnotations;

namespace Application.DTOs;

public class SendMediaMessageDto
{
    [Required]
    public Guid ReceiverId { get; set; }

    [MaxLength(2000, ErrorMessage = "Message content cannot exceed 2000 characters")]
    public string? Content { get; set; }

    [Required]
    public ChatMessageTypeDto MessageType { get; set; }

    [Required]
    [MaxLength(500, ErrorMessage = "Media URL cannot exceed 500 characters")]
    public string MediaUrl { get; set; } = string.Empty;

    [Required]
    [MaxLength(255, ErrorMessage = "File name cannot exceed 255 characters")]
    public string FileName { get; set; } = string.Empty;

    [Required]
    [Range(1, long.MaxValue, ErrorMessage = "File size must be greater than 0")]
    public long FileSize { get; set; }

    [MaxLength(100, ErrorMessage = "Content type cannot exceed 100 characters")]
    public string? ContentType { get; set; }
}
