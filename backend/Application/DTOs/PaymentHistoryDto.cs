using System;
using Application.Common.Query;

namespace Application.DTOs;

public enum PaymentTypeDto
{
    Purchase,
    TopUp,
    Refund
}

public class PaymentHistoryItemDto
{
    public Guid Id { get; set; }
    public DateTime Date { get; set; }
    public PaymentTypeDto Type { get; set; }
    public string Description { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public string Currency { get; set; } = "UAH";
    public string Status { get; set; } = "Completed";
    public Guid? GameId { get; set; }
    public string? GameName { get; set; }
    public string? GameImage { get; set; }
}

public class PaymentHistoryQueryParams : QueryParameters
{
    public DateTime? From { get; set; }
    public DateTime? To { get; set; }
    public PaymentTypeDto? Type { get; set; }

    public PaymentHistoryQueryParams()
    {
        Limit = 20;
        SortBy = "Date:desc";
    }
}


