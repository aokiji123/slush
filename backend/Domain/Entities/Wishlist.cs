using System;
using System.ComponentModel.DataAnnotations;

namespace Domain.Entities;

public class Wishlist
{
    [Required]
    public Guid UserId { get; set; }
    public User? User { get; set; }

    [Required]
    public Guid GameId { get; set; }
    public Game? Game { get; set; }

    [Required]
    public DateTime AddedAtUtc { get; set; } = DateTime.UtcNow;
}
