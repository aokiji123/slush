using Application.Common.Query;
using Application.DTOs;
using Domain.Entities;

namespace Application.Interfaces
{
    public interface IReviewService
    {
        Task<ReviewDto?> GetReviewByIdAsync(Guid id, Guid? currentUserId = null);
        Task<IEnumerable<ReviewDto>> GetReviewsAsync(ReviewQueryParameters parameters, Guid? currentUserId = null);
        Task<ReviewDto> CreateReviewAsync(CreateReviewDto createReviewDto, Guid userId);
        Task<ReviewDto?> UpdateReviewAsync(Guid id, CreateReviewDto updateReviewDto, Guid userId);
        Task<bool> DeleteReviewAsync(Guid id, Guid userId);
        Task<bool> LikeReviewAsync(Guid reviewId, Guid userId);
        Task<bool> UnlikeReviewAsync(Guid reviewId, Guid userId);
        Task<bool> IsReviewLikedByUserAsync(Guid reviewId, Guid userId);
    }
}