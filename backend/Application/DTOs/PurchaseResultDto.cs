using System;

namespace Application.DTOs;

public class PurchaseResultDto
{
    public bool Success { get; set; }
    public string Message { get; set; } = string.Empty;
    public Guid? OwnedGameId { get; set; }
    public BalanceDto? Balance { get; set; }
}
