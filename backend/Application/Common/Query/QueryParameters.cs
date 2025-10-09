using System;

namespace Application.Common.Query;

public class QueryParameters
{
    /// <summary>
    /// 1-based page number
    /// </summary>
    public int Page { get; set; } = 1;

    /// <summary>
    /// Items per page
    /// </summary>
    public int Limit { get; set; } = 10;

    /// <summary>
    /// Sort specification.
    /// Examples:
    ///  - "Price" (uses SortDirection if provided)
    ///  - "Price:desc" (inline direction)
    ///  - "Rating:desc,Name:asc" (multi-level sort)
    /// </summary>
    public string? SortBy { get; set; } = "relevancy";

    /// <summary>
    /// Optional sort direction: "asc" or "desc". Used when SortBy has a single property without inline direction.
    /// </summary>
    public string? SortDirection { get; set; }

    /// <summary>
    /// Optional free-text search string
    /// </summary>
    public string? Search { get; set; }

    public (int skip, int take) Normalize(int minPageSize = 1, int maxPageSize = 100)
    {
        var take = Math.Clamp(Limit <= 0 ? 10 : Limit, minPageSize, maxPageSize);
        var page = Page <= 0 ? 1 : Page;
        var skip = (page - 1) * take;
        return (skip, take);
    }
}
