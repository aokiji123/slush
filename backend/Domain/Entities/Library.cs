using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Domain.Entities;

public class Library
{
    [Key]
    public Guid Id { get; set; }

    [Required]
    public Guid UserId { get; set; }

    [Required]
    public Guid GameId { get; set; }

    public DateTime AddedAt { get; set; } = DateTime.UtcNow;

    public bool IsFavorite { get; set; } = false;

    // Navigation properties
    [ForeignKey(nameof(UserId))]
    public virtual User User { get; set; } = null!;

    [ForeignKey(nameof(GameId))]
    public virtual Game Game { get; set; } = null!;
}