using System;

namespace Application.DTOs;

public class CommentDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Text { get; set; } = string.Empty;
    public string Avatar { get; set; } = string.Empty;
    public int Rating { get; set; }
    public int FavoritesCount { get; set; }
    public int RepliesCount { get; set; }
    public DateTime PostedAt { get; set; }
}