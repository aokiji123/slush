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

	public async Task<IReadOnlyList<PostDto>> GetPostsByGameAsync(Guid gameId)
	{
		return await _db.Posts
			.AsNoTracking()
			.Where(p => p.GameId == gameId)
			.OrderByDescending(p => p.CreatedAt)
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
				}).ToList()
			}).ToListAsync();
	}

	public async Task<PostDto?> GetPostAsync(Guid gameId, Guid postId)
	{
		return await _db.Posts
			.AsNoTracking()
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
				}).ToList()
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
			.Where(c => c.PostId == postId)
			.OrderBy(c => c.CreatedAt)
			.Select(c => new CommentDto
			{
				Id = c.Id,
				Content = c.Content,
				CreatedAt = c.CreatedAt,
				AuthorId = c.AuthorId,
				PostId = c.PostId,
				ParentCommentId = c.ParentCommentId
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

		// Save media record to database
		var media = new Media
		{
			Id = Guid.NewGuid(),
			File = result.Url,
			IsCover = false, // Default to false, can be updated later
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
}


