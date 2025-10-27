namespace Application.Common.Query;

public class UserGamesQueryParameters : QueryParameters
{
    public UserGamesQueryParameters()
    {
        Limit = 20;
        SortBy = "AddedAt:desc"; // Default: recently added first
    }
}
