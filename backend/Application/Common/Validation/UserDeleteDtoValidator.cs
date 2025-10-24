using Application.DTOs;
using FluentValidation;

namespace Application.Common.Validation;

public class UserDeleteDtoValidator : AbstractValidator<UserDeleteDto>
{
    public UserDeleteDtoValidator()
    {
        RuleFor(x => x.UserId)
            .NotEmpty().WithMessage("User ID is required");

        RuleFor(x => x.Nickname)
            .NotEmpty().WithMessage("Nickname is required")
            .MaximumLength(50).WithMessage("Nickname cannot exceed 50 characters");

        RuleFor(x => x.Password)
            .NotEmpty().WithMessage("Password is required")
            .MinimumLength(6).WithMessage("Password must be at least 6 characters long");

        RuleFor(x => x.ConfirmPassword)
            .NotEmpty().WithMessage("Password confirmation is required")
            .Equal(x => x.Password).WithMessage("Password and confirmation must match");
    }
}