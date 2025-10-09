using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Application.DTOs;

/// <summary>
/// DTO for creating a new DLC for a specific game.
/// </summary>
public class AddDlcDto
{
    /// <summary>Base game identifier to which the DLC belongs.</summary>
    [Required]
    public Guid BaseGameId { get; set; }

    /// <summary>DLC name.</summary>
    [Required]
    [StringLength(100, MinimumLength = 3)]
    public string Name { get; set; } = string.Empty;

    /// <summary>DLC description.</summary>
    [Required]
    [StringLength(1000, MinimumLength = 10)]
    public string Description { get; set; } = string.Empty;

    /// <summary>DLC price.</summary>
    [Required]
    [Range(0.01, 100000)]
    public decimal Price { get; set; }

    /// <summary>DLC release date.</summary>
    [Required]
    public DateTime ReleaseDate { get; set; }

    /// <summary>Main image URL of the DLC.</summary>
    [Required]
    [StringLength(300)]
    public string MainImage { get; set; } = string.Empty;

    /// <summary>Image URLs of the DLC.</summary>
    public List<string> Images { get; set; } = new();

    /// <summary>Discount percentage (0-100).</summary>
    [Range(0, 100)]
    public int DiscountPercent { get; set; }

    /// <summary>Sale price.</summary>
    [Range(0, 100000)]
    public decimal SalePrice { get; set; }

    /// <summary>Sale end date (if applicable).</summary>
    public DateTime? SaleDate { get; set; }

    /// <summary>Genres. At least one required.</summary>
    [Required]
    [MinLength(1)]
    public List<string> Genre { get; set; } = new();

    /// <summary>Developer name.</summary>
    [StringLength(100)]
    public string Developer { get; set; } = string.Empty;

    /// <summary>Publisher name.</summary>
    [StringLength(100)]
    public string Publisher { get; set; } = string.Empty;

    /// <summary>Release platforms. At least one required.</summary>
    [Required]
    [MinLength(1)]
    public List<string> Platforms { get; set; } = new();
}
