using FluentValidation;
using Application.DTOs;

namespace Application.Common.Validation;

public class WalletChangeDtoValidator : AbstractValidator<WalletChangeDto>
{
    public WalletChangeDtoValidator()
    {
        RuleFor(x => x.Amount)
            .NotEqual(0).WithMessage("Amount cannot be zero")
            .GreaterThanOrEqualTo(-10000).WithMessage("Amount cannot be less than -10,000")
            .LessThanOrEqualTo(10000).WithMessage("Amount cannot exceed 10,000");

        RuleFor(x => x.Title)
            .NotEmpty().WithMessage("Transaction title is required")
            .MaximumLength(200).WithMessage("Transaction title cannot exceed 200 characters");
    }
}
