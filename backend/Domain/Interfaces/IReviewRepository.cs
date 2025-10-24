using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Domain.Entities;

namespace Domain.Interfaces;

/// <summary>
/// Repository interface for managing reviews
/// </summary>
public interface IReviewRepository
{
    Task<Review?> GetByIdAsync(Guid id);
    Task<IEnumerable<Review>> GetReviewsAsync(Guid? gameId = null, Guid? userId = null, int? rating = null, int skip = 0, int take = 10);
    Task<Review> AddReviewAsync(Review review);
    Task<Review?> UpdateReviewAsync(Review review);
    Task<bool> DeleteReviewAsync(Guid id);
    Task<bool> ExistsAsync(Guid id);
    Task<bool> UserHasReviewedGameAsync(Guid userId, Guid gameId);
}
