using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Application.DTOs;
using Domain.Entities;
using Microsoft.AspNetCore.Http;

namespace Application.Interfaces;

public interface ICommunityService
{
	Task<IReadOnlyList<PostDto>> GetPostsByGameAsync(Guid gameId, PostType? type = null, string? sortBy = null, string? search = null);
	Task<PostDto?> GetPostAsync(Guid gameId, Guid postId);
	Task<PostDto?> GetPostByIdAsync(Guid postId);
	Task<PostDto> CreatePostAsync(Guid authorId, Guid gameId, CreatePostDto dto);
	Task<PostDto?> UpdatePostAsync(Guid authorId, Guid gameId, Guid postId, UpdatePostDto dto);
	Task<bool> DeletePostAsync(Guid authorId, Guid gameId, Guid postId);

	Task<IReadOnlyList<CommentDto>> GetCommentsByPostAsync(Guid postId);
	Task<CommentDto> CreateCommentAsync(Guid authorId, Guid postId, CreateCommentDto dto);
	Task<bool> DeleteCommentAsync(Guid authorId, Guid postId, Guid commentId);

	Task<bool> LikePostAsync(Guid userId, Guid postId);
	Task<bool> UnlikePostAsync(Guid userId, Guid postId);
	Task<bool> LikeCommentAsync(Guid userId, Guid commentId);
	Task<bool> UnlikeCommentAsync(Guid userId, Guid commentId);

	Task<MediaDto> UploadMediaAsync(Guid postId, IFormFile file);
	
	Task<IReadOnlyList<PostDto>> GetPostsByUserLibraryAsync(Guid userId, PostType? type = null, string? sortBy = null, int? limit = null);
}


