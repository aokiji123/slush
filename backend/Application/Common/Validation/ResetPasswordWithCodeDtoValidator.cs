using FluentValidation;
using Application.DTOs;

namespace Application.Common.Validation;

public class ResetPasswordWithCodeDtoValidator : AbstractValidator<ResetPasswordWithCodeDto>
{
    public ResetPasswordWithCodeDtoValidator()
    {
        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("Email is required")
            .EmailAddress().WithMessage("Email must be a valid email address")
            .MaximumLength(256).WithMessage("Email cannot exceed 256 characters");

        RuleFor(x => x.Code)
            .NotEmpty().WithMessage("Verification code is required")
            .Length(6).WithMessage("Verification code must be exactly 6 characters")
            .Matches(@"^[0-9]+$").WithMessage("Verification code must contain only numbers");

        RuleFor(x => x.NewPassword)
            .NotEmpty().WithMessage("New password is required")
            .MinimumLength(6).WithMessage("New password must be at least 6 characters long")
            .MaximumLength(100).WithMessage("New password cannot exceed 100 characters")
            .Matches(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)").WithMessage("New password must contain at least one lowercase letter, one uppercase letter, and one number");
    }
}
