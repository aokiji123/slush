using Application.DTOs;
using FluentValidation;

namespace Application.Common.Validation;

public class SendTextMessageDtoValidator : AbstractValidator<SendTextMessageDto>
{
    public SendTextMessageDtoValidator()
    {
        RuleFor(x => x.ReceiverId)
            .NotEmpty()
            .WithMessage("Receiver ID is required");

        RuleFor(x => x.Content)
            .NotEmpty()
            .WithMessage("Message content is required")
            .MaximumLength(2000)
            .WithMessage("Message content cannot exceed 2000 characters")
            .MinimumLength(1)
            .WithMessage("Message content cannot be empty");
    }
}
