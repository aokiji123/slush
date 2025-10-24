using FluentValidation;
using Application.DTOs;

namespace Application.Common.Validation;

public class FileUploadDtoValidator : AbstractValidator<FileUploadDto>
{
    public FileUploadDtoValidator()
    {
        RuleFor(x => x.Url)
            .NotEmpty().WithMessage("File URL is required")
            .MaximumLength(500).WithMessage("File URL cannot exceed 500 characters");

        RuleFor(x => x.FileName)
            .NotEmpty().WithMessage("File name is required")
            .MaximumLength(255).WithMessage("File name cannot exceed 255 characters");

        RuleFor(x => x.FileSize)
            .GreaterThan(0).WithMessage("File size must be greater than 0");

        RuleFor(x => x.ContentType)
            .NotEmpty().WithMessage("Content type is required");

        RuleFor(x => x.FilePath)
            .NotEmpty().WithMessage("File path is required")
            .MaximumLength(500).WithMessage("File path cannot exceed 500 characters");
    }
}
