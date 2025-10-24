using Application.DTOs;
using FluentValidation;

namespace Application.Common.Validation;

public class UserUpdateDtoValidator : AbstractValidator<UserUpdateDto>
{
    public UserUpdateDtoValidator()
    {
        RuleFor(x => x.Nickname)
            .NotEmpty().WithMessage("Nickname is required")
            .MinimumLength(2).WithMessage("Nickname must be at least 2 characters long")
            .MaximumLength(50).WithMessage("Nickname cannot exceed 50 characters")
            .Matches(@"^[a-zA-Z0-9_-]+$").WithMessage("Nickname can only contain letters, numbers, underscores, and hyphens");

        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("Email is required")
            .EmailAddress().WithMessage("Email must be a valid email address")
            .MaximumLength(256).WithMessage("Email cannot exceed 256 characters");

        RuleFor(x => x.Bio)
            .MaximumLength(500).WithMessage("Bio cannot exceed 500 characters")
            .When(x => !string.IsNullOrEmpty(x.Bio));

        RuleFor(x => x.Lang)
            .NotEmpty().WithMessage("Language is required")
            .Length(2).WithMessage("Language must be a 2-character code")
            .Matches(@"^[a-zA-Z]{2}$").WithMessage("Language must be a valid 2-letter language code");
    }
}