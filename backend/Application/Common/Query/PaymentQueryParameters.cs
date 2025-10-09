using System;

namespace Application.Common.Query;

public class PaymentQueryParameters : QueryParameters
{
    public PaymentQueryParameters()
    {
        Limit = 20;
        SortBy = "Data:desc";
    }
}
