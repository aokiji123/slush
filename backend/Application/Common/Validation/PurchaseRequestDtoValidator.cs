using FluentValidation;
using Application.DTOs;

namespace Application.Common.Validation;

public class PurchaseRequestDtoValidator : AbstractValidator<PurchaseRequestDto>
{
    public PurchaseRequestDtoValidator()
    {
        RuleFor(x => x.GameId)
            .NotEmpty().WithMessage("Game ID is required");

        RuleFor(x => x.Title)
            .MaximumLength(200).WithMessage("Title cannot exceed 200 characters")
            .When(x => !string.IsNullOrEmpty(x.Title));
    }
}
