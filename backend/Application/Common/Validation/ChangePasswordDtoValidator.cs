using FluentValidation;
using Application.DTOs;

namespace Application.Common.Validation;

public class ChangePasswordDtoValidator : AbstractValidator<ChangePasswordDto>
{
    public ChangePasswordDtoValidator()
    {
        RuleFor(x => x.OldPassword)
            .NotEmpty().WithMessage("Current password is required")
            .MaximumLength(100).WithMessage("Current password cannot exceed 100 characters");

        RuleFor(x => x.NewPassword)
            .NotEmpty().WithMessage("New password is required")
            .MinimumLength(6).WithMessage("New password must be at least 6 characters long")
            .MaximumLength(100).WithMessage("New password cannot exceed 100 characters")
            .Matches(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)").WithMessage("New password must contain at least one lowercase letter, one uppercase letter, and one number")
            .NotEqual(x => x.OldPassword).WithMessage("New password must be different from current password");
    }
}
