using Application.DTOs;
using FluentValidation;

namespace Application.Common.Validation;

public class SendMediaMessageDtoValidator : AbstractValidator<SendMediaMessageDto>
{
    public SendMediaMessageDtoValidator()
    {
        RuleFor(x => x.ReceiverId)
            .NotEmpty()
            .WithMessage("Receiver ID is required");

        RuleFor(x => x.MessageType)
            .IsInEnum()
            .WithMessage("Invalid message type");

        RuleFor(x => x.MediaUrl)
            .NotEmpty()
            .WithMessage("Media URL is required")
            .MaximumLength(500)
            .WithMessage("Media URL cannot exceed 500 characters");

        RuleFor(x => x.FileName)
            .NotEmpty()
            .WithMessage("File name is required")
            .MaximumLength(255)
            .WithMessage("File name cannot exceed 255 characters");

        RuleFor(x => x.FileSize)
            .GreaterThan(0)
            .WithMessage("File size must be greater than 0");

        RuleFor(x => x.ContentType)
            .MaximumLength(100)
            .WithMessage("Content type cannot exceed 100 characters");

        RuleFor(x => x.Content)
            .MaximumLength(2000)
            .WithMessage("Message content cannot exceed 2000 characters")
            .When(x => !string.IsNullOrEmpty(x.Content));
    }
}
