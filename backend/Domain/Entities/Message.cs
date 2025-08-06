using System.ComponentModel.DataAnnotations;

namespace Domain.Entities;

public class Message
{
    public Guid Id { get; set; }
    
    [Required]
    public Guid ChatId { get; set; }
    
    [Required]
    public Guid UserId { get; set; }
    
    [Required]
    [MaxLength(4000)]
    public string Text { get; set; }
    
    [Required]
    public DateTime Timestamp { get; set; }
}