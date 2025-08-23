using System;
using System.Collections.Generic;

namespace Application.DTOs;

public class GameSetDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public List<string> Content { get; set; } = new List<string>();
    public double Price { get; set; }
    public double? OldPrice { get; set; }
    public int? SalePercent { get; set; }
    public DateTime? SaleEndDate { get; set; }
}