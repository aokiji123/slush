using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Domain.Entities;

public class Game
{
    [Key]
    public Guid Id { get; set; }

    [Required]
    [MaxLength(200)]
    public string Name { get; set; } = string.Empty;

    [NotMapped]
    public string Title
    {
        get => Name;
        set => Name = value;
    }

    [Required]
    public string Slug { get; set; } = string.Empty;

    [Required]
    [MaxLength(200)]
    public string Description { get; set; } = string.Empty;

    [Required]
    [Range(0, 100000)]
    public decimal Price { get; set; }

    [MaxLength(500)]
    public string MainImage { get; set; } = string.Empty;

    public List<string> Images { get; set; } = new();

    [Range(0, 100)]
    public int DiscountPercent { get; set; }

    [Range(0, 100000)]
    public decimal SalePrice { get; set; }

    public DateTime? SaleDate { get; set; }

    [Range(0, 5)]
    public double Rating { get; set; }

    public DateTime ReleaseDate { get; set; }

    [MaxLength(200)]
    public string Developer { get; set; } = string.Empty;

    [MaxLength(200)]
    public string Publisher { get; set; } = string.Empty;

    public List<string> Platforms { get; set; } = new();

    public List<string> Genre { get; set; } = new();

    public bool IsDlc { get; set; }

    public Guid? BaseGameId { get; set; }

    // Removed discount relation; SalePrice is now the source of truth

    public List<Review> Reviews { get; set; } = new();

    public GameCharacteristic? GameCharacteristic { get; set; }
}