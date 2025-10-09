using System;
using Application.Common.Query;

namespace Application.DTOs;

public class GamesFilterRequestDto : GameQueryParameters
{
    public override int GetHashCode()
    {
        var hash = new HashCode();
        hash.Add(Page);
        hash.Add(Limit);
        hash.Add(SortBy, StringComparer.OrdinalIgnoreCase);
        hash.Add(SortDirection, StringComparer.OrdinalIgnoreCase);
        hash.Add(Search, StringComparer.OrdinalIgnoreCase);
        foreach (var genre in Genres)
        {
            hash.Add(genre, StringComparer.OrdinalIgnoreCase);
        }
        foreach (var platform in Platforms)
        {
            hash.Add(platform, StringComparer.OrdinalIgnoreCase);
        }
        hash.Add(MinPrice);
        hash.Add(MaxPrice);
        hash.Add(OnSale);
        hash.Add(IsDlc);
        return hash.ToHashCode();
    }
}
