using System;
using System.Linq;
using System.Threading.Tasks;
using Domain.Entities;
using Domain.Interfaces;
using Microsoft.EntityFrameworkCore;
using Infrastructure.Data;

namespace Infrastructure.Repositories
{
    public class ReviewLikeRepository : IReviewLikeRepository
    {
        private readonly AppDbContext _db;
        public ReviewLikeRepository(AppDbContext db)
        {
            _db = db;
        }

        public async Task<ReviewLike?> GetByUserAndReviewAsync(Guid userId, Guid reviewId)
        {
            return await _db.ReviewLikes
                .FirstOrDefaultAsync(rl => rl.UserId == userId && rl.ReviewId == reviewId);
        }

        public async Task<ReviewLike> AddLikeAsync(ReviewLike reviewLike)
        {
            _db.ReviewLikes.Add(reviewLike);
            await _db.SaveChangesAsync();
            return reviewLike;
        }

        public async Task<bool> RemoveLikeAsync(Guid userId, Guid reviewId)
        {
            var like = await GetByUserAndReviewAsync(userId, reviewId);
            if (like == null) return false;

            _db.ReviewLikes.Remove(like);
            await _db.SaveChangesAsync();
            return true;
        }

        public async Task<int> GetLikeCountAsync(Guid reviewId)
        {
            return await _db.ReviewLikes.CountAsync(rl => rl.ReviewId == reviewId);
        }

        public async Task<bool> IsLikedByUserAsync(Guid userId, Guid reviewId)
        {
            return await _db.ReviewLikes.AnyAsync(rl => rl.UserId == userId && rl.ReviewId == reviewId);
        }
    }
}
