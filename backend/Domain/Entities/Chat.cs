using System;
using System.ComponentModel.DataAnnotations;

namespace Domain.Entities;

public class Chat
{
    public Guid Id { get; set; }
    
    [Required]
    public ChatType Type { get; set; }
    
    [MaxLength(255)]
    public string Name { get; set; }
    
    [Required]
    public DateTime Timestamp { get; set; }
}