using System;
using System.ComponentModel.DataAnnotations;

namespace Domain.Entities;

public class UserOwnedGame
{
    [Key]
    public Guid Id { get; set; }
    
    [Required]
    public Guid UserId { get; set; }
    public User User { get; set; }

    [Required]
    public Guid GameId { get; set; }
    public Game Game { get; set; }

    [Required]
    public DateTime PurchasedAtDateTime { get; set; }

    [Required]
    [Range(0, 10000)]
    public decimal PurchasePrice { get; set; }
}