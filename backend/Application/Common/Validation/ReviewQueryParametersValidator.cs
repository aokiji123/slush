using FluentValidation;
using Application.Common.Query;

namespace Application.Common.Validation;

public class ReviewQueryParametersValidator : AbstractValidator<ReviewQueryParameters>
{
    public ReviewQueryParametersValidator()
    {
        RuleFor(x => x.Page)
            .GreaterThan(0).WithMessage("Page must be greater than 0")
            .LessThanOrEqualTo(1000).WithMessage("Page cannot exceed 1000");

        RuleFor(x => x.PageSize)
            .GreaterThan(0).WithMessage("Page size must be greater than 0")
            .LessThanOrEqualTo(100).WithMessage("Page size cannot exceed 100");

        RuleFor(x => x.SortBy)
            .Must(sortBy => string.IsNullOrEmpty(sortBy) || 
                sortBy.ToLower() == "createdat" || 
                sortBy.ToLower() == "rating" ||
                sortBy.ToLower() == "likes")
            .WithMessage("SortBy must be 'CreatedAt', 'Rating', or 'Likes'")
            .When(x => !string.IsNullOrEmpty(x.SortBy));

        RuleFor(x => x.SortOrder)
            .Must(order => string.IsNullOrEmpty(order) || order.ToLower() == "asc" || order.ToLower() == "desc")
            .WithMessage("SortOrder must be 'asc' or 'desc'")
            .When(x => !string.IsNullOrEmpty(x.SortOrder));

        RuleFor(x => x.MinRating)
            .InclusiveBetween(1, 5).WithMessage("Minimum rating must be between 1 and 5")
            .When(x => x.MinRating.HasValue);

        RuleFor(x => x.MaxRating)
            .InclusiveBetween(1, 5).WithMessage("Maximum rating must be between 1 and 5")
            .When(x => x.MaxRating.HasValue);

        RuleFor(x => x)
            .Must(x => !x.MinRating.HasValue || !x.MaxRating.HasValue || x.MinRating <= x.MaxRating)
            .WithMessage("Minimum rating must be less than or equal to maximum rating");
    }
}
