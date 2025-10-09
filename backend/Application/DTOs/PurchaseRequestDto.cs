using System;

namespace Application.DTOs;

public class PurchaseRequestDto
{
    public Guid GameId { get; set; }
    public string? Title { get; set; }
}
