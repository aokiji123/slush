using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Domain.Entities;

public class BannerGame
{
    public Guid Id { get; set; }

    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    [Required]
    [MaxLength(1000)]
    public string Description { get; set; } = string.Empty;

    [Required]
    [MaxLength(255)]
    public string Image { get; set; } = string.Empty;

    [Required]
    [Range(0, double.MaxValue)]
    public double Price { get; set; }

    public List<string> GameImages { get; set; } = new List<string>();

    public double? OldPrice { get; set; }

    [Range(0, 100)]
    public int? SalePercent { get; set; }

    public DateTime? SaleEndDate { get; set; }
    
    [Required]
    public DateTime CreatedAtDateTime { get; set; }
}