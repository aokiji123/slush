using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Infrastructure.Data;

namespace Infrastructure.Repositories
{
    public class ReviewRepository
    {
        private readonly AppDbContext _db;
        public ReviewRepository(AppDbContext db)
        {
            _db = db;
        }

        public async Task AddReviewAsync(Review review)
        {
            _db.Reviews.Add(review);
            await _db.SaveChangesAsync();
        }

        public async Task<List<Review>> GetReviewsByGameIdAsync(Guid gameId)
        {
            return await _db.Reviews.Where(r => r.GameId == gameId).OrderByDescending(r => r.CreatedAt).ToListAsync();
        }
    }
}
