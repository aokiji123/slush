using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain.Entities;
using Domain.Interfaces;
using Microsoft.EntityFrameworkCore;
using Infrastructure.Data;

namespace Infrastructure.Repositories
{
    public class ReviewRepository : IReviewRepository
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

        public async Task<IEnumerable<Review>> GetReviewsAsync(Guid? gameId = null, Guid? userId = null, int? rating = null, int skip = 0, int take = 10)
        {
            var query = _db.Reviews
                .Include(r => r.User)
                .Include(r => r.Game)
                .AsQueryable();

            if (gameId.HasValue)
                query = query.Where(r => r.GameId == gameId.Value);

            if (userId.HasValue)
                query = query.Where(r => r.UserId == userId.Value);

            if (rating.HasValue)
                query = query.Where(r => r.Rating == rating.Value);

            return await query
                .OrderByDescending(r => r.CreatedAt)
                .Skip(skip)
                .Take(take)
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
