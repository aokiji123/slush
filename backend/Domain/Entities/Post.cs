using System;
using System.Collections.Generic;

namespace Domain.Entities;

public enum PostType
{
	Discussion,
	Screenshot,
	Video,
	Guide,
	News
}

public class Post
{
	public Guid Id { get; set; }
	public string Title { get; set; } = string.Empty;
	public string Content { get; set; } = string.Empty;
	public PostType Type { get; set; }
	public DateTime CreatedAt { get; set; }
	public DateTime UpdatedAt { get; set; }
	public Guid AuthorId { get; set; }
	public Guid GameId { get; set; }

	public User? Author { get; set; }
	public List<Media> Media { get; set; } = new();
	public List<Comment> Comments { get; set; } = new();
	public List<PostLike> Likes { get; set; } = new();
}

public enum MediaType
{
	Image,
	Video
}

public class Media
{
	public Guid Id { get; set; }
	public string File { get; set; } = string.Empty; // url to file
	public bool IsCover { get; set; }
	public MediaType Type { get; set; }
	public Guid PostId { get; set; }
	public Post? Post { get; set; }
}

public class Comment
{
	public Guid Id { get; set; }
	public string Content { get; set; } = string.Empty;
	public DateTime CreatedAt { get; set; }
	public Guid AuthorId { get; set; }
	public Guid PostId { get; set; }
	public Guid? ParentCommentId { get; set; }

	public User? Author { get; set; }
	public Post? Post { get; set; }
	public Comment? ParentComment { get; set; }
	public List<Comment> Replies { get; set; } = new();
	public List<CommentLike> Likes { get; set; } = new();
}

public class PostLike
{
	public Guid UserId { get; set; }
	public Guid PostId { get; set; }

	public Post? Post { get; set; }
}

public class CommentLike
{
	public Guid UserId { get; set; }
	public Guid CommentId { get; set; }

	public Comment? Comment { get; set; }
}


