using System;

namespace Application.DTOs;

public class OwnedGameDto
{
    public Guid GameId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string MainImage { get; set; } = string.Empty;
    public DateTime PurchasedAt { get; set; }
    public double PurchasePrice { get; set; }
}
