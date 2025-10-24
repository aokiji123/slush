using FluentValidation;
using Application.DTOs;

namespace Application.Common.Validation;

public class CreatePostDtoValidator : AbstractValidator<CreatePostDto>
{
    public CreatePostDtoValidator()
    {
        RuleFor(x => x.Title)
            .NotEmpty().WithMessage("Post title is required")
            .MinimumLength(3).WithMessage("Post title must be at least 3 characters long")
            .MaximumLength(200).WithMessage("Post title cannot exceed 200 characters");

        RuleFor(x => x.Content)
            .NotEmpty().WithMessage("Post content is required")
            .MinimumLength(10).WithMessage("Post content must be at least 10 characters long")
            .MaximumLength(5000).WithMessage("Post content cannot exceed 5000 characters");

        RuleFor(x => x.Type)
            .IsInEnum().WithMessage("Post type must be a valid value");
    }
}

public class UpdatePostDtoValidator : AbstractValidator<UpdatePostDto>
{
    public UpdatePostDtoValidator()
    {
        RuleFor(x => x.Title)
            .NotEmpty().WithMessage("Post title is required")
            .MinimumLength(3).WithMessage("Post title must be at least 3 characters long")
            .MaximumLength(200).WithMessage("Post title cannot exceed 200 characters");

        RuleFor(x => x.Content)
            .NotEmpty().WithMessage("Post content is required")
            .MinimumLength(10).WithMessage("Post content must be at least 10 characters long")
            .MaximumLength(5000).WithMessage("Post content cannot exceed 5000 characters");

        RuleFor(x => x.Type)
            .IsInEnum().WithMessage("Post type must be a valid value");
    }
}

public class CreateCommentDtoValidator : AbstractValidator<CreateCommentDto>
{
    public CreateCommentDtoValidator()
    {
        RuleFor(x => x.Content)
            .NotEmpty().WithMessage("Comment content is required")
            .MinimumLength(1).WithMessage("Comment content cannot be empty")
            .MaximumLength(1000).WithMessage("Comment content cannot exceed 1000 characters");
    }
}
