using System;
using System.ComponentModel.DataAnnotations;

namespace Domain.Entities;

public class PasswordResetToken
{
    public Guid Id { get; set; }
    
    [Required]
    public Guid UserId { get; set; }
    
    [Required]
    public string Token { get; set; } = string.Empty;
    
    [Required]
    public DateTime ExpiryDate { get; set; }
    
    [Required]
    public DateTime CreatedAt { get; set; }
    
    public bool IsUsed { get; set; }
    
    // Navigation property
    public User User { get; set; } = null!;
}
