using FluentValidation;
using Application.DTOs;

namespace Application.Common.Validation;

public class SendFriendRequestDtoValidator : AbstractValidator<SendFriendRequestDto>
{
    public SendFriendRequestDtoValidator()
    {
        RuleFor(x => x.ReceiverId)
            .NotEmpty().WithMessage("Receiver ID is required");
    }
}
