using System;
using System.ComponentModel.DataAnnotations;

namespace Domain.Entities;

public class Friendship
{
    [Required]
    public Guid User1Id { get; set; }

    [Required]
    public Guid User2Id { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public User? User1 { get; set; }
    public User? User2 { get; set; }
}
