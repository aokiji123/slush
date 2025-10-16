using System;

namespace Application.Common.Query
{
    public class ReviewQueryParameters
    {
        public Guid? GameId { get; set; }
        public Guid? UserId { get; set; }
        public int? MinRating { get; set; }
        public int? MaxRating { get; set; }
        public string? SortBy { get; set; } = "CreatedAt";
        public string? SortOrder { get; set; } = "desc";
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 10;
    }
}
