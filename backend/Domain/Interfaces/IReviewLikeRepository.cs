using System;
using System.Threading.Tasks;
using Domain.Entities;

namespace Domain.Interfaces;

/// <summary>
/// Repository interface for managing review likes
/// </summary>
public interface IReviewLikeRepository
{
    Task<ReviewLike?> GetByUserAndReviewAsync(Guid userId, Guid reviewId);
    Task<ReviewLike> AddLikeAsync(ReviewLike reviewLike);
    Task<bool> RemoveLikeAsync(Guid userId, Guid reviewId);
    Task<int> GetLikeCountAsync(Guid reviewId);
    Task<bool> IsLikedByUserAsync(Guid userId, Guid reviewId);
}
