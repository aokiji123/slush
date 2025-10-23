using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain.Entities;
using Domain.Interfaces;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

public class ProfileCommentRepository : IProfileCommentRepository
{
    private readonly AppDbContext _db;

    public ProfileCommentRepository(AppDbContext db)
    {
        _db = db;
    }

    public async Task<IEnumerable<ProfileComment>> GetByProfileUserIdAsync(Guid profileUserId)
    {
        return await _db.Set<ProfileComment>()
            .Include(pc => pc.Author)
            .Where(pc => pc.ProfileUserId == profileUserId)
            .OrderByDescending(pc => pc.CreatedAt)
            .ToListAsync();
    }

    public async Task<ProfileComment?> GetByIdAsync(Guid id)
    {
        return await _db.Set<ProfileComment>()
            .Include(pc => pc.Author)
            .Include(pc => pc.ProfileUser)
            .FirstOrDefaultAsync(pc => pc.Id == id);
    }

    public async Task<ProfileComment> AddAsync(ProfileComment profileComment)
    {
        _db.Set<ProfileComment>().Add(profileComment);
        await _db.SaveChangesAsync();
        return profileComment;
    }

    public async Task DeleteAsync(ProfileComment profileComment)
    {
        _db.Set<ProfileComment>().Remove(profileComment);
        await _db.SaveChangesAsync();
    }
}
