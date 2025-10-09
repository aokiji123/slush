namespace Application.Common.Query;

public class LibraryQueryParameters : QueryParameters
{
    public bool? IsDlc { get; set; }

    public LibraryQueryParameters()
    {
        Limit = 20;
        SortBy = "PurchasedAtDateTime:desc";
    }
}
