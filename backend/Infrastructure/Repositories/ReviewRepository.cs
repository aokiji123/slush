using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Infrastructure.Data;
using Application.Common.Query;

namespace Infrastructure.Repositories
{
    public class ReviewRepository
    {
        private readonly AppDbContext _db;
        public ReviewRepository(AppDbContext db)
        {
            _db = db;
        }

        public async Task<Review?> GetByIdAsync(Guid id)
        {
            return await _db.Reviews
                .Include(r => r.User)
                .Include(r => r.Game)
                .FirstOrDefaultAsync(r => r.Id == id);
        }

        public async Task<IEnumerable<Review>> GetReviewsAsync(ReviewQueryParameters parameters)
        {
            var query = _db.Reviews
                .Include(r => r.User)
                .Include(r => r.Game)
                .AsQueryable();

            if (parameters.GameId.HasValue)
                query = query.Where(r => r.GameId == parameters.GameId.Value);

            if (parameters.UserId.HasValue)
                query = query.Where(r => r.UserId == parameters.UserId.Value);

            if (parameters.MinRating.HasValue)
                query = query.Where(r => r.Rating >= parameters.MinRating.Value);

            if (parameters.MaxRating.HasValue)
                query = query.Where(r => r.Rating <= parameters.MaxRating.Value);

            // Apply sorting
            query = parameters.SortBy?.ToLower() switch
            {
                "rating" => parameters.SortOrder?.ToLower() == "asc" 
                    ? query.OrderBy(r => r.Rating) 
                    : query.OrderByDescending(r => r.Rating),
                "likes" => parameters.SortOrder?.ToLower() == "asc" 
                    ? query.OrderBy(r => r.Likes) 
                    : query.OrderByDescending(r => r.Likes),
                "createdat" or _ => parameters.SortOrder?.ToLower() == "asc" 
                    ? query.OrderBy(r => r.CreatedAt) 
                    : query.OrderByDescending(r => r.CreatedAt)
            };

            // Apply pagination
            return await query
                .Skip((parameters.Page - 1) * parameters.PageSize)
                .Take(parameters.PageSize)
                .ToListAsync();
        }

        public async Task<Review> AddReviewAsync(Review review)
        {
            try
            {
                _db.Reviews.Add(review);
                await _db.SaveChangesAsync();
                
                // Load the User navigation property for the returned review
                return await _db.Reviews
                    .Include(r => r.User)
                    .Include(r => r.Game)
                    .FirstOrDefaultAsync(r => r.Id == review.Id) ?? review;
            }
            catch (Exception ex)
            {
                throw new InvalidOperationException($"Database error while saving review: {ex.Message}", ex);
            }
        }

        public async Task<Review?> UpdateReviewAsync(Review review)
        {
            _db.Reviews.Update(review);
            await _db.SaveChangesAsync();
            return review;
        }

        public async Task<bool> DeleteReviewAsync(Guid id)
        {
            var review = await _db.Reviews.FindAsync(id);
            if (review == null) return false;

            _db.Reviews.Remove(review);
            await _db.SaveChangesAsync();
            return true;
        }

        public async Task<bool> ExistsAsync(Guid id)
        {
            return await _db.Reviews.AnyAsync(r => r.Id == id);
        }

        public async Task<bool> UserHasReviewedGameAsync(Guid userId, Guid gameId)
        {
            return await _db.Reviews.AnyAsync(r => r.UserId == userId && r.GameId == gameId);
        }
    }
}
