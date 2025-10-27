using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Domain.Entities;

public class CollectionGame
{
    [Key]
    public Guid CollectionId { get; set; }

    [Key]
    public Guid GameId { get; set; }

    public DateTime AddedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    [ForeignKey(nameof(CollectionId))]
    public virtual GameCollection Collection { get; set; } = null!;

    [ForeignKey(nameof(GameId))]
    public virtual Game Game { get; set; } = null!;
}

