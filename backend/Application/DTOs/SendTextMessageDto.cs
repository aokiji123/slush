using System.ComponentModel.DataAnnotations;

namespace Application.DTOs;

public class SendTextMessageDto
{
    [Required]
    public Guid ReceiverId { get; set; }

    [Required]
    [MaxLength(2000, ErrorMessage = "Message content cannot exceed 2000 characters")]
    [MinLength(1, ErrorMessage = "Message content cannot be empty")]
    public string Content { get; set; } = string.Empty;
}
