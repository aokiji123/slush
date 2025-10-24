using FluentValidation;
using Application.DTOs;

namespace Application.Common.Validation;

public class GamesFilterRequestDtoValidator : AbstractValidator<GamesFilterRequestDto>
{
    public GamesFilterRequestDtoValidator()
    {
        RuleFor(x => x.Page)
            .GreaterThan(0).WithMessage("Page must be greater than 0")
            .LessThanOrEqualTo(1000).WithMessage("Page cannot exceed 1000");

        RuleFor(x => x.Limit)
            .GreaterThan(0).WithMessage("Limit must be greater than 0")
            .LessThanOrEqualTo(100).WithMessage("Limit cannot exceed 100");

        RuleFor(x => x.SortBy)
            .MaximumLength(50).WithMessage("SortBy cannot exceed 50 characters")
            .When(x => !string.IsNullOrEmpty(x.SortBy));

        RuleFor(x => x.SortDirection)
            .Must(direction => string.IsNullOrEmpty(direction) || direction.ToLower() == "asc" || direction.ToLower() == "desc")
            .WithMessage("SortDirection must be 'asc' or 'desc'")
            .When(x => !string.IsNullOrEmpty(x.SortDirection));

        RuleFor(x => x.Search)
            .MaximumLength(200).WithMessage("Search term cannot exceed 200 characters")
            .When(x => !string.IsNullOrEmpty(x.Search));

        RuleFor(x => x.MinPrice)
            .GreaterThanOrEqualTo(0).WithMessage("Minimum price cannot be negative")
            .When(x => x.MinPrice.HasValue);

        RuleFor(x => x.MaxPrice)
            .GreaterThanOrEqualTo(0).WithMessage("Maximum price cannot be negative")
            .When(x => x.MaxPrice.HasValue);

        RuleFor(x => x)
            .Must(x => !x.MinPrice.HasValue || !x.MaxPrice.HasValue || x.MinPrice <= x.MaxPrice)
            .WithMessage("Minimum price must be less than or equal to maximum price");
    }
}
