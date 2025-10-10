using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain.Entities;
using Domain.Interfaces;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

public class FriendRequestRepository : IFriendRequestRepository
{
    private readonly AppDbContext _context;

    public FriendRequestRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<FriendRequest> CreateAsync(FriendRequest request)
    {
        request.CreatedAt = DateTime.UtcNow;
        await _context.FriendRequests.AddAsync(request);
        await _context.SaveChangesAsync();
        return request;
    }

    public async Task UpdateAsync(FriendRequest request)
    {
        _context.FriendRequests.Update(request);
        await _context.SaveChangesAsync();
    }

    public async Task<bool> ExistsPendingAsync(Guid userAId, Guid userBId)
    {
        return await _context.FriendRequests.AnyAsync(fr =>
            ((fr.SenderId == userAId && fr.ReceiverId == userBId) ||
             (fr.SenderId == userBId && fr.ReceiverId == userAId)) &&
            fr.Status == FriendRequestStatus.Pending);
    }

    public async Task<IReadOnlyList<FriendRequest>> GetPendingBySenderAsync(Guid senderId)
    {
        return await _context.FriendRequests
            .Where(fr => fr.SenderId == senderId && fr.Status == FriendRequestStatus.Pending)
            .OrderByDescending(fr => fr.CreatedAt)
            .ToListAsync();
    }

    public async Task<FriendRequest?> GetByPairAsync(Guid senderId, Guid receiverId)
    {
        return await _context.FriendRequests
            .FirstOrDefaultAsync(fr => fr.SenderId == senderId && fr.ReceiverId == receiverId);
    }
}
