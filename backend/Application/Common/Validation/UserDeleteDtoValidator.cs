using FluentValidation;
using Application.DTOs;

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
            .MaximumLength(100).WithMessage("Password cannot exceed 100 characters");

        RuleFor(x => x.ConfirmPassword)
            .NotEmpty().WithMessage("Password confirmation is required")
            .Equal(x => x.Password).WithMessage("Password confirmation must match the password");
    }
}
