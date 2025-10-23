using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Application.DTOs;

namespace Application.Interfaces;

public interface IProfileCommentService
{
    Task<IEnumerable<ProfileCommentDto>> GetByProfileUserIdAsync(Guid profileUserId);
    Task<ProfileCommentDto> CreateAsync(Guid authorId, CreateProfileCommentDto dto);
    Task<bool> DeleteAsync(Guid commentId, Guid userId);
}
