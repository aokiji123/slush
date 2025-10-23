using System;

namespace Application.DTOs;

public class ProfileCommentDto
{
    public Guid Id { get; set; }
    public Guid ProfileUserId { get; set; }
    public Guid AuthorId { get; set; }
    public string AuthorNickname { get; set; } = string.Empty;
    public string? AuthorAvatar { get; set; }
    public string Content { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}

public class CreateProfileCommentDto
{
    public Guid ProfileUserId { get; set; }
    public string Content { get; set; } = string.Empty;
}
