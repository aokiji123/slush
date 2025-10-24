using FluentValidation;
using Application.DTOs;

namespace Application.Common.Validation;

public class UserBalanceDtoValidator : AbstractValidator<UserBalanceDto>
{
    public UserBalanceDtoValidator()
    {
        RuleFor(x => x.UserId)
            .NotEmpty().WithMessage("User ID is required");

        RuleFor(x => x.AmountToAdd)
            .GreaterThan(0).WithMessage("Amount to add must be greater than 0")
            .LessThanOrEqualTo(10000).WithMessage("Amount to add cannot exceed 10,000");
    }
}
