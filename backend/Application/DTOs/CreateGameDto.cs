using System;
using System.Collections.Generic;

namespace Application.DTOs;

public class CreateGameDto
{
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string MainImage { get; set; } = string.Empty;
    public List<string> Images { get; set; } = new();
    public decimal Price { get; set; }
    public int DiscountPercent { get; set; }
    public decimal SalePrice { get; set; }
    public DateTime? SaleDate { get; set; }
    public double Rating { get; set; }
    public List<string> Genre { get; set; } = new();
    public string Description { get; set; } = string.Empty;
    public DateTime ReleaseDate { get; set; }
    public string Developer { get; set; } = string.Empty;
    public string Publisher { get; set; } = string.Empty;
    public List<string> Platforms { get; set; } = new();
    public bool IsDlc { get; set; }
    public Guid? BaseGameId { get; set; }
}
