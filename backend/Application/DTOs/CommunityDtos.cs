using System;
using System.Collections.Generic;
using Domain.Entities;

namespace Application.DTOs;

public class MediaDto
{
	public Guid Id { get; set; }
	public string File { get; set; } = string.Empty;
	public bool IsCover { get; set; }
	public MediaType Type { get; set; }
}

public class UploadMediaDto
{
	public string File { get; set; } = string.Empty;
	public bool IsCover { get; set; }
	public MediaType Type { get; set; }
}

public class PostDto
{
	public Guid Id { get; set; }
	public string Title { get; set; } = string.Empty;
	public string Content { get; set; } = string.Empty;
	public PostType Type { get; set; }
	public DateTime CreatedAt { get; set; }
	public DateTime UpdatedAt { get; set; }
	public Guid AuthorId { get; set; }
	public Guid GameId { get; set; }
	public List<MediaDto> Media { get; set; } = new();
	public string AuthorUsername { get; set; } = string.Empty;
	public string AuthorAvatar { get; set; } = string.Empty;
	public int LikesCount { get; set; }
	public int CommentsCount { get; set; }
	public string GameMainImage { get; set; } = string.Empty;
	public bool IsLikedByCurrentUser { get; set; }
}

public class CreatePostDto
{
	public string Title { get; set; } = string.Empty;
	public string Content { get; set; } = string.Empty;
	public PostType Type { get; set; }
	public List<UploadMediaDto>? Media { get; set; }
}

public class UpdatePostDto
{
	public string Title { get; set; } = string.Empty;
	public string Content { get; set; } = string.Empty;
	public PostType Type { get; set; }
}

public class CommentDto
{
	public Guid Id { get; set; }
	public string Content { get; set; } = string.Empty;
	public DateTime CreatedAt { get; set; }
	public Guid AuthorId { get; set; }
	public Guid PostId { get; set; }
	public Guid? ParentCommentId { get; set; }
	public string AuthorUsername { get; set; } = string.Empty;
	public string AuthorAvatar { get; set; } = string.Empty;
	public int LikesCount { get; set; }
}

public class CreateCommentDto
{
	public string Content { get; set; } = string.Empty;
	public Guid? ParentCommentId { get; set; }
}


