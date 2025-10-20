using System;
using System.Collections.Generic;

namespace Application.Common.Query;

public class WishlistQueryParameters : QueryParameters
{
    public List<string> Genres { get; set; } = new();
    public List<string> Platforms { get; set; } = new();
    public decimal? MinPrice { get; set; }
    public decimal? MaxPrice { get; set; }
    public bool? OnSale { get; set; }
    public bool? IsDlc { get; set; }

    public WishlistQueryParameters()
    {
        Limit = 20;
        SortBy = "AddedAtUtc:desc"; // Default sort by when added to wishlist
    }
}
