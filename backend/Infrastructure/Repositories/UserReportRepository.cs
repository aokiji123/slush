using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain.Entities;
using Domain.Interfaces;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

public class UserReportRepository : IUserReportRepository
{
    private readonly AppDbContext _context;

    public UserReportRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<UserReport> CreateAsync(UserReport report)
    {
        report.CreatedAt = DateTime.UtcNow;
        report.Status = ReportStatus.Pending;
        
        await _context.UserReports.AddAsync(report);
        await _context.SaveChangesAsync();
        
        return report;
    }

    public async Task<UserReport?> GetByIdAsync(Guid id)
    {
        return await _context.UserReports
            .Include(r => r.Reporter)
            .Include(r => r.ReportedUser)
            .FirstOrDefaultAsync(r => r.Id == id);
    }

    public async Task<IReadOnlyList<UserReport>> GetByReporterIdAsync(Guid reporterId)
    {
        return await _context.UserReports
            .Include(r => r.ReportedUser)
            .Where(r => r.ReporterId == reporterId)
            .OrderByDescending(r => r.CreatedAt)
            .ToListAsync();
    }

    public async Task<IReadOnlyList<UserReport>> GetByReportedUserIdAsync(Guid reportedUserId)
    {
        return await _context.UserReports
            .Include(r => r.Reporter)
            .Where(r => r.ReportedUserId == reportedUserId)
            .OrderByDescending(r => r.CreatedAt)
            .ToListAsync();
    }

    public async Task<IReadOnlyList<UserReport>> GetPendingReportsAsync()
    {
        return await _context.UserReports
            .Include(r => r.Reporter)
            .Include(r => r.ReportedUser)
            .Where(r => r.Status == ReportStatus.Pending)
            .OrderBy(r => r.CreatedAt)
            .ToListAsync();
    }
}

