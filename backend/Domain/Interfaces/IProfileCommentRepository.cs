using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Domain.Entities;

namespace Domain.Interfaces;

public interface IProfileCommentRepository
{
    Task<IEnumerable<ProfileComment>> GetByProfileUserIdAsync(Guid profileUserId);
    Task<ProfileComment?> GetByIdAsync(Guid id);
    Task<ProfileComment> AddAsync(ProfileComment profileComment);
    Task DeleteAsync(ProfileComment profileComment);
}
