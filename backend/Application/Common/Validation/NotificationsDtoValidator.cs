using FluentValidation;
using Application.DTOs;

namespace Application.Common.Validation;

public class NotificationsDtoValidator : AbstractValidator<NotificationsDto>
{
    public NotificationsDtoValidator()
    {
        RuleFor(x => x.UserId)
            .NotEmpty().WithMessage("User ID is required");
    }
}
