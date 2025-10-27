namespace Application.Common.Query;

public class UserReviewsQueryParameters : QueryParameters
{
    public UserReviewsQueryParameters()
    {
        Limit = 20;
        SortBy = "CreatedAt:desc"; // Default: newest first
    }
}
