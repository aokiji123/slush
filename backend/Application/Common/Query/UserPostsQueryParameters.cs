using Domain.Entities;

namespace Application.Common.Query;

public class UserPostsQueryParameters : QueryParameters
{
    /// <summary>
    /// Filter posts by type (Screenshot, Video, Guide, Discussion)
    /// </summary>
    public PostType? Type { get; set; }
    
    public UserPostsQueryParameters()
    {
        Limit = 20;
        SortBy = "CreatedAt:desc";
    }
}
