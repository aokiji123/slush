using System;
using System.ComponentModel.DataAnnotations;

namespace Domain.Entities;

public class WalletTransaction
{
    [Key]
    public Guid Id { get; set; }

    [Required]
    public Guid UserId { get; set; }
    public User User { get; set; }

    [Required]
    [Range(-100000, 100000)]
    public decimal Amount { get; set; }

    [Required]
    [MaxLength(100)]
    public string Type { get; set; } // "deposit", "purchase", "refund"
    
    [Required]
    [MaxLength(200)]
    public string Title { get; set; }

    [MaxLength(500)]
    public string? Description { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}