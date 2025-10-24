using FluentValidation;
using Application.DTOs;

namespace Application.Common.Validation;

public class BlockUserDtoValidator : AbstractValidator<BlockUserDto>
{
    public BlockUserDtoValidator()
    {
        RuleFor(x => x.BlockedUserId)
            .NotEmpty().WithMessage("Blocked user ID is required");
    }
}
