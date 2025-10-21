using System;
using System.ComponentModel.DataAnnotations;

namespace Domain.Entities;

public class UserBlock
{
    [Key]
    public Guid Id { get; set; }
    
    [Required]
    public Guid BlockerId { get; set; }
    
    [Required]
    public Guid BlockedUserId { get; set; }
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    // Navigation properties
    public User? Blocker { get; set; }
    public User? BlockedUser { get; set; }
}
