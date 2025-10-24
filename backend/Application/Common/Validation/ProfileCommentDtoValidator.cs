using FluentValidation;
using Application.DTOs;

namespace Application.Common.Validation;

public class ProfileCommentDtoValidator : AbstractValidator<CreateProfileCommentDto>
{
    public ProfileCommentDtoValidator()
    {
        RuleFor(x => x.ProfileUserId)
            .NotEmpty().WithMessage("Profile user ID is required");

        RuleFor(x => x.Content)
            .NotEmpty().WithMessage("Comment content is required")
            .MinimumLength(1).WithMessage("Comment content cannot be empty")
            .MaximumLength(1000).WithMessage("Comment content cannot exceed 1000 characters");
    }
}
