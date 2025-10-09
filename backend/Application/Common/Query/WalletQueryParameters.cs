using System;

namespace Application.Common.Query;

public class WalletQueryParameters : QueryParameters
{
    /// <summary>
    /// Optional transaction type filter (e.g., deposit, purchase, refund).
    /// </summary>
    public string? Type { get; set; }

    /// <summary>
    /// Optional lower bound for CreatedAt (inclusive, UTC).
    /// </summary>
    public DateTime? From { get; set; }

    /// <summary>
    /// Optional upper bound for CreatedAt (inclusive, UTC).
    /// </summary>
    public DateTime? To { get; set; }

    public WalletQueryParameters()
    {
        Limit = 20;
        SortBy = "CreatedAt:desc";
    }
}
