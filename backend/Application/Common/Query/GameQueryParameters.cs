using System.Collections.Generic;

namespace Application.Common.Query;

public class GameQueryParameters : QueryParameters
{
    public List<string> Genres { get; set; } = new();
    public List<string> Platforms { get; set; } = new();
    public decimal? MinPrice { get; set; }
    public decimal? MaxPrice { get; set; }
    public bool? OnSale { get; set; }
    public bool? IsDlc { get; set; }
}
