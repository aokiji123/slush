using Application.DTOs;
using FluentValidation;

namespace Application.Common.Validation;

public class CreateUserReportDtoValidator : AbstractValidator<CreateUserReportDto>
{
    public CreateUserReportDtoValidator()
    {
        RuleFor(x => x.ReportedUserId)
            .NotEmpty()
            .WithMessage("Reported user ID is required");

        RuleFor(x => x.Reason)
            .IsInEnum()
            .WithMessage("Invalid report reason");

        RuleFor(x => x.Description)
            .NotEmpty()
            .WithMessage("Description is required")
            .MaximumLength(1000)
            .WithMessage("Description cannot exceed 1000 characters")
            .MinimumLength(10)
            .WithMessage("Description must be at least 10 characters");
    }
}

