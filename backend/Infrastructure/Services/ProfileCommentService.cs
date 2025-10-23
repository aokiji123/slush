using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.DTOs;
using Application.Interfaces;
using Domain.Entities;
using Domain.Interfaces;

namespace Infrastructure.Services;

public class ProfileCommentService : IProfileCommentService
{
    private readonly IProfileCommentRepository _profileCommentRepository;

    public ProfileCommentService(IProfileCommentRepository profileCommentRepository)
    {
        _profileCommentRepository = profileCommentRepository;
    }

    public async Task<IEnumerable<ProfileCommentDto>> GetByProfileUserIdAsync(Guid profileUserId)
    {
        var comments = await _profileCommentRepository.GetByProfileUserIdAsync(profileUserId);
        
        return comments.Select(c => new ProfileCommentDto
        {
            Id = c.Id,
            ProfileUserId = c.ProfileUserId,
            AuthorId = c.AuthorId,
            AuthorNickname = c.Author.Nickname ?? string.Empty,
            AuthorAvatar = c.Author.Avatar,
            Content = c.Content,
            CreatedAt = c.CreatedAt
        });
    }

    public async Task<ProfileCommentDto> CreateAsync(Guid authorId, CreateProfileCommentDto dto)
    {
        var profileComment = new ProfileComment
        {
            Id = Guid.NewGuid(),
            ProfileUserId = dto.ProfileUserId,
            AuthorId = authorId,
            Content = dto.Content,
            CreatedAt = DateTime.UtcNow
        };

        var created = await _profileCommentRepository.AddAsync(profileComment);
        
        return new ProfileCommentDto
        {
            Id = created.Id,
            ProfileUserId = created.ProfileUserId,
            AuthorId = created.AuthorId,
            AuthorNickname = created.Author.Nickname ?? string.Empty,
            AuthorAvatar = created.Author.Avatar,
            Content = created.Content,
            CreatedAt = created.CreatedAt
        };
    }

    public async Task<bool> DeleteAsync(Guid commentId, Guid userId)
    {
        var comment = await _profileCommentRepository.GetByIdAsync(commentId);
        if (comment == null) return false;

        // Only the author or the profile owner can delete the comment
        if (comment.AuthorId != userId && comment.ProfileUserId != userId)
        {
            return false;
        }

        await _profileCommentRepository.DeleteAsync(comment);
        return true;
    }
}
