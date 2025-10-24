using System;
using FluentValidation;
using Application.DTOs;

namespace Application.Common.Validation;

public class CreateGameDtoValidator : AbstractValidator<CreateGameDto>
{
    public CreateGameDtoValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Game name is required")
            .MaximumLength(200).WithMessage("Game name cannot exceed 200 characters");

        RuleFor(x => x.Slug)
            .NotEmpty().WithMessage("Game slug is required")
            .Matches(@"^[a-z0-9-]+$").WithMessage("Slug must contain only lowercase letters, numbers, and hyphens");

        RuleFor(x => x.Description)
            .NotEmpty().WithMessage("Game description is required")
            .MaximumLength(2000).WithMessage("Description cannot exceed 2000 characters");

        RuleFor(x => x.Price)
            .GreaterThanOrEqualTo(0).WithMessage("Price must be non-negative");

        RuleFor(x => x.DiscountPercent)
            .InclusiveBetween(0, 100).WithMessage("Discount percent must be between 0 and 100");

        RuleFor(x => x.ReleaseDate)
            .NotEmpty().WithMessage("Release date is required")
            .LessThanOrEqualTo(DateTime.UtcNow.AddYears(10)).WithMessage("Release date cannot be more than 10 years in the future");

        RuleFor(x => x.Developer)
            .NotEmpty().WithMessage("Developer is required")
            .MaximumLength(100).WithMessage("Developer name cannot exceed 100 characters");

        RuleFor(x => x.Publisher)
            .NotEmpty().WithMessage("Publisher is required")
            .MaximumLength(100).WithMessage("Publisher name cannot exceed 100 characters");

        RuleFor(x => x.Genre)
            .NotEmpty().WithMessage("At least one genre is required")
            .Must(genres => genres.Count <= 10).WithMessage("Cannot have more than 10 genres");

        RuleFor(x => x.Platforms)
            .NotEmpty().WithMessage("At least one platform is required")
            .Must(platforms => platforms.Count <= 5).WithMessage("Cannot have more than 5 platforms");
    }
}
