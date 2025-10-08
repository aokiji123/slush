using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Domain.Entities;

public class Game
{
    [Key]
    public Guid Id { get; set; }

    [Required, MaxLength(255)]
    public string Name { get; set; } = null!;

    [Required, MaxLength(255)]
    public string Slug { get; set; } = null!;

    [Required]
    public string MainImage { get; set; } = null!;

    public List<string> Images { get; set; } = new();

    [Range(0, 100000)]
    public decimal Price { get; set; }

    [Range(0, 100)]
    public int DiscountPercent { get; set; } = 0;

    public DateTime? SaleDate { get; set; }

    [Range(0, 5)]
    public double Rating { get; set; }

    public List<string> Genre { get; set; } = new();

    [Required]
    public string Description { get; set; } = null!;

    [Required]
    public DateTime ReleaseDate { get; set; }

    [Required]
    public string Developer { get; set; } = null!;

    [Required]
    public string Publisher { get; set; } = null!;

    public List<string> Platforms { get; set; } = new();

    public bool IsDlc { get; set; }
    public Guid? BaseGameId { get; set; }

    public decimal SalePrice => Math.Round(Price - Price * DiscountPercent / 100m, 2);
}