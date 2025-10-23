using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Application.DTOs;
using Application.Interfaces;
using Domain.Entities;
using Infrastructure.Data;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Services;

public class CommunityService : ICommunityService
{
	private readonly AppDbContext _db;
	private readonly IStorageService _storageService;

	public CommunityService(AppDbContext db, IStorageService storageService)
	{
		_db = db;
		_storageService = storageService;
	}

	public async Task<IReadOnlyList<PostDto>> GetPostsByGameAsync(Guid gameId, PostType? type = null, string? sortBy = null, string? search = null)
	{
		var query = _db.Posts
			.AsNoTracking()
			.Include(p => p.Author)
			.Include(p => p.Likes)
			.Include(p => p.Comments)
			.Where(p => p.GameId == gameId);

		// Apply type filter
		if (type.HasValue)
		{
			query = query.Where(p => p.Type == type.Value);
		}

		// Apply search filter
		if (!string.IsNullOrEmpty(search))
		{
			query = query.Where(p => p.Title.Contains(search) || p.Content.Contains(search));
		}

		// Apply sorting
		query = sortBy?.ToLower() switch
		{
			"newest" => query.OrderByDescending(p => p.CreatedAt),
			"oldest" => query.OrderBy(p => p.CreatedAt),
			"popular" => query.OrderByDescending(p => p.Likes.Count),
			"comments" => query.OrderByDescending(p => p.Comments.Count),
			_ => query.OrderByDescending(p => p.CreatedAt) // Default to newest
		};

		return await query.Select(p => new PostDto
			{
				Id = p.Id,
				Title = p.Title,
				Content = p.Content,
				Type = p.Type,
				CreatedAt = p.CreatedAt,
				UpdatedAt = p.UpdatedAt,
				AuthorId = p.AuthorId,
				GameId = p.GameId,
				Media = p.Media.Select(m => new MediaDto
				{
					Id = m.Id,
					File = m.File,
					IsCover = m.IsCover,
					Type = m.Type
				}).ToList(),
				AuthorUsername = p.Author.Nickname,
				AuthorAvatar = p.Author.Avatar ?? string.Empty,
				LikesCount = p.Likes.Count,
				CommentsCount = p.Comments.Count
			}).ToListAsync();
	}

	public async Task<PostDto?> GetPostAsync(Guid gameId, Guid postId)
	{
		return await _db.Posts
			.AsNoTracking()
			.Include(p => p.Author)
			.Include(p => p.Likes)
			.Include(p => p.Comments)
			.Where(p => p.Id == postId && p.GameId == gameId)
			.Select(p => new PostDto
			{
				Id = p.Id,
				Title = p.Title,
				Content = p.Content,
				Type = p.Type,
				CreatedAt = p.CreatedAt,
				UpdatedAt = p.UpdatedAt,
				AuthorId = p.AuthorId,
				GameId = p.GameId,
				Media = p.Media.Select(m => new MediaDto
				{
					Id = m.Id,
					File = m.File,
					IsCover = m.IsCover,
					Type = m.Type
				}).ToList(),
				AuthorUsername = p.Author.Nickname,
				AuthorAvatar = p.Author.Avatar ?? string.Empty,
				LikesCount = p.Likes.Count,
				CommentsCount = p.Comments.Count
			}).FirstOrDefaultAsync();
	}

	public async Task<PostDto?> GetPostByIdAsync(Guid postId)
	{
		return await _db.Posts
			.AsNoTracking()
			.Include(p => p.Author)
			.Include(p => p.Likes)
			.Include(p => p.Comments)
			.Where(p => p.Id == postId)
			.Select(p => new PostDto
			{
				Id = p.Id,
				Title = p.Title,
				Content = p.Content,
				Type = p.Type,
				CreatedAt = p.CreatedAt,
				UpdatedAt = p.UpdatedAt,
				AuthorId = p.AuthorId,
				GameId = p.GameId,
				Media = p.Media.Select(m => new MediaDto
				{
					Id = m.Id,
					File = m.File,
					IsCover = m.IsCover,
					Type = m.Type
				}).ToList(),
				AuthorUsername = p.Author.Nickname,
				AuthorAvatar = p.Author.Avatar ?? string.Empty,
				LikesCount = p.Likes.Count,
				CommentsCount = p.Comments.Count
			}).FirstOrDefaultAsync();
	}

	public async Task<PostDto> CreatePostAsync(Guid authorId, Guid gameId, CreatePostDto dto)
	{
		var now = DateTime.UtcNow;
		var post = new Post
		{
			Id = Guid.NewGuid(),
			Title = dto.Title,
			Content = dto.Content,
			Type = dto.Type,
			CreatedAt = now,
			UpdatedAt = now,
			AuthorId = authorId,
			GameId = gameId
		};
		_db.Posts.Add(post);
		if (dto.Media != null && dto.Media.Count > 0)
		{
			foreach (var m in dto.Media)
			{
				_db.Media.Add(new Media
				{
					Id = Guid.NewGuid(),
					File = m.File,
					IsCover = m.IsCover,
					Type = m.Type,
					PostId = post.Id
				});
			}
		}
		await _db.SaveChangesAsync();
		return await GetPostAsync(gameId, post.Id) ?? throw new InvalidOperationException("Failed to fetch created post");
	}

	public async Task<PostDto?> UpdatePostAsync(Guid authorId, Guid gameId, Guid postId, UpdatePostDto dto)
	{
		var post = await _db.Posts.FirstOrDefaultAsync(p => p.Id == postId && p.GameId == gameId);
		if (post == null) return null;
		if (post.AuthorId != authorId) return null;
		post.Title = dto.Title;
		post.Content = dto.Content;
		post.Type = dto.Type;
		post.UpdatedAt = DateTime.UtcNow;
		await _db.SaveChangesAsync();
		return await GetPostAsync(gameId, postId);
	}

	public async Task<bool> DeletePostAsync(Guid authorId, Guid gameId, Guid postId)
	{
		var post = await _db.Posts
			.Include(p => p.Media)
			.FirstOrDefaultAsync(p => p.Id == postId && p.GameId == gameId);
		if (post == null) return false;
		if (post.AuthorId != authorId) return false;

		// Delete associated media files from storage
		foreach (var media in post.Media)
		{
			var filePath = ExtractFilePathFromUrl(media.File);
			if (!string.IsNullOrEmpty(filePath))
			{
				await _storageService.DeleteFileAsync(filePath);
			}
		}

		_db.Posts.Remove(post);
		await _db.SaveChangesAsync();
		return true;
	}

	public async Task<IReadOnlyList<CommentDto>> GetCommentsByPostAsync(Guid postId)
	{
		return await _db.Comments
			.AsNoTracking()
			.Include(c => c.Author)
			.Include(c => c.Likes)
			.Where(c => c.PostId == postId)
			.OrderBy(c => c.CreatedAt)
			.Select(c => new CommentDto
			{
				Id = c.Id,
				Content = c.Content,
				CreatedAt = c.CreatedAt,
				AuthorId = c.AuthorId,
				PostId = c.PostId,
				ParentCommentId = c.ParentCommentId,
				AuthorUsername = c.Author.Nickname,
				AuthorAvatar = c.Author.Avatar ?? string.Empty,
				LikesCount = c.Likes.Count
			}).ToListAsync();
	}

	public async Task<CommentDto> CreateCommentAsync(Guid authorId, Guid postId, CreateCommentDto dto)
	{
		var comment = new Comment
		{
			Id = Guid.NewGuid(),
			Content = dto.Content,
			CreatedAt = DateTime.UtcNow,
			AuthorId = authorId,
			PostId = postId,
			ParentCommentId = dto.ParentCommentId
		};
		_db.Comments.Add(comment);
		await _db.SaveChangesAsync();
		return new CommentDto
		{
			Id = comment.Id,
			Content = comment.Content,
			CreatedAt = comment.CreatedAt,
			AuthorId = comment.AuthorId,
			PostId = comment.PostId,
			ParentCommentId = comment.ParentCommentId
		};
	}

	public async Task<bool> DeleteCommentAsync(Guid authorId, Guid postId, Guid commentId)
	{
		var comment = await _db.Comments.FirstOrDefaultAsync(c => c.Id == commentId && c.PostId == postId);
		if (comment == null) return false;
		if (comment.AuthorId != authorId) return false;
		_db.Comments.Remove(comment);
		await _db.SaveChangesAsync();
		return true;
	}

	public async Task<bool> LikePostAsync(Guid userId, Guid postId)
	{
		var exists = await _db.PostLikes.AnyAsync(l => l.UserId == userId && l.PostId == postId);
		if (exists) return true;
		_db.PostLikes.Add(new PostLike { UserId = userId, PostId = postId });
		await _db.SaveChangesAsync();
		return true;
	}

	public async Task<bool> UnlikePostAsync(Guid userId, Guid postId)
	{
		var like = await _db.PostLikes.FirstOrDefaultAsync(l => l.UserId == userId && l.PostId == postId);
		if (like == null) return true;
		_db.PostLikes.Remove(like);
		await _db.SaveChangesAsync();
		return true;
	}

	public async Task<bool> LikeCommentAsync(Guid userId, Guid commentId)
	{
		var exists = await _db.CommentLikes.AnyAsync(l => l.UserId == userId && l.CommentId == commentId);
		if (exists) return true;
		_db.CommentLikes.Add(new CommentLike { UserId = userId, CommentId = commentId });
		await _db.SaveChangesAsync();
		return true;
	}

	public async Task<bool> UnlikeCommentAsync(Guid userId, Guid commentId)
	{
		var like = await _db.CommentLikes.FirstOrDefaultAsync(l => l.UserId == userId && l.CommentId == commentId);
		if (like == null) return true;
		_db.CommentLikes.Remove(like);
		await _db.SaveChangesAsync();
		return true;
	}

	public async Task<MediaDto> UploadMediaAsync(Guid postId, IFormFile file)
	{
		// Validate file
		var validation = _storageService.ValidateCommunityMediaFile(file);
		if (!validation.IsValid)
		{
			throw new ArgumentException(validation.ErrorMessage);
		}

		// Verify post exists
		var post = await _db.Posts.FirstOrDefaultAsync(p => p.Id == postId);
		if (post == null)
		{
			throw new ArgumentException("Post not found");
		}

		// Upload file to storage
		var folder = $"community/posts/{postId}";
		var result = await _storageService.UploadFileAsync(file, folder);

		// Determine media type based on file extension
		var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
		var mediaType = IsVideoExtension(extension) ? MediaType.Video : MediaType.Image;

		// Check if this is the first media for this post
		var existingMediaCount = await _db.Media.CountAsync(m => m.PostId == postId);
		
		// Save media record to database
		var media = new Media
		{
			Id = Guid.NewGuid(),
			File = result.Url,
			IsCover = existingMediaCount == 0, // Set as cover if it's the first media
			Type = mediaType,
			PostId = postId
		};

		_db.Media.Add(media);
		await _db.SaveChangesAsync();

		return new MediaDto
		{
			Id = media.Id,
			File = media.File,
			IsCover = media.IsCover,
			Type = media.Type
		};
	}

	private static bool IsVideoExtension(string extension)
	{
		var videoExtensions = new[] { ".mp4", ".webm", ".avi", ".mov", ".mkv" };
		return videoExtensions.Contains(extension);
	}

	private static string? ExtractFilePathFromUrl(string url)
	{
		if (string.IsNullOrEmpty(url)) return null;
		
		try
		{
			var uri = new Uri(url);
			var pathSegments = uri.AbsolutePath.Split('/', StringSplitOptions.RemoveEmptyEntries);
			
			// Supabase storage URLs typically have format: /storage/v1/object/public/bucket/path
			// We need to extract the path after the bucket name
			var bucketIndex = Array.IndexOf(pathSegments, "slush-storage");
			if (bucketIndex >= 0 && bucketIndex + 1 < pathSegments.Length)
			{
				return string.Join("/", pathSegments.Skip(bucketIndex + 1));
			}
		}
		catch
		{
			// If URL parsing fails, return null
		}
		
		return null;
	}

	public async Task<IReadOnlyList<PostDto>> GetPostsByUserLibraryAsync(Guid userId, PostType? type = null, string? sortBy = null, int? limit = null)
	{
		var query = _db.Posts
			.AsNoTracking()
			.Include(p => p.Author)
			.Include(p => p.Likes)
			.Include(p => p.Comments)
			.Include(p => p.Media)
			.Join(_db.Libraries, p => p.GameId, l => l.GameId, (p, l) => new { Post = p, Library = l })
			.Join(_db.Games, j => j.Post.GameId, g => g.Id, (j, g) => new { Post = j.Post, Library = j.Library, Game = g })
			.Where(j => j.Library.UserId == userId);

		// Apply type filter
		if (type.HasValue)
		{
			query = query.Where(j => j.Post.Type == type.Value);
		}

		// Apply sorting
		query = sortBy?.ToLower() switch
		{
			"recent" => query.OrderByDescending(j => j.Post.CreatedAt),
			"popular" => query.OrderByDescending(j => j.Post.Likes.Count + j.Post.Comments.Count),
			"comments" => query.OrderByDescending(j => j.Post.Comments.Count),
			"likes" => query.OrderByDescending(j => j.Post.Likes.Count),
			_ => query.OrderByDescending(j => j.Post.CreatedAt) // Default to recent
		};

		// Apply limit
		if (limit.HasValue)
		{
			query = query.Take(limit.Value);
		}

		return await query.Select(j => new PostDto
		{
			Id = j.Post.Id,
			Title = j.Post.Title,
			Content = j.Post.Content,
			Type = j.Post.Type,
			CreatedAt = j.Post.CreatedAt,
			UpdatedAt = j.Post.UpdatedAt,
			AuthorId = j.Post.AuthorId,
			GameId = j.Post.GameId,
			Media = j.Post.Media.Select(m => new MediaDto
			{
				Id = m.Id,
				File = m.File,
				IsCover = m.IsCover,
				Type = m.Type
			}).ToList(),
			AuthorUsername = j.Post.Author.Nickname,
			AuthorAvatar = j.Post.Author.Avatar ?? string.Empty,
			LikesCount = j.Post.Likes.Count,
			CommentsCount = j.Post.Comments.Count,
			GameMainImage = j.Game.MainImage
		}).ToListAsync();
	}
}


