using System;
using System.Collections.Generic;

namespace Application.DTOs;

public class BannerGameDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Image { get; set; } = string.Empty;
    public double Price { get; set; }
    public List<string> GameImages { get; set; } = new List<string>();
    public double? OldPrice { get; set; }
    public int? SalePercent { get; set; }
    public DateTime? SaleEndDate { get; set; }
}