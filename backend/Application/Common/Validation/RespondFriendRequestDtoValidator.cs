using FluentValidation;
using Application.DTOs;

namespace Application.Common.Validation;

public class RespondFriendRequestDtoValidator : AbstractValidator<RespondFriendRequestDto>
{
    public RespondFriendRequestDtoValidator()
    {
        RuleFor(x => x.SenderId)
            .NotEmpty().WithMessage("Sender ID is required");

        RuleFor(x => x.ReceiverId)
            .NotEmpty().WithMessage("Receiver ID is required");
    }
}
