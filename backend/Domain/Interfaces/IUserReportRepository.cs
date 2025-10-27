using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Domain.Entities;

namespace Domain.Interfaces;

public interface IUserReportRepository
{
    Task<UserReport> CreateAsync(UserReport report);
    Task<UserReport?> GetByIdAsync(Guid id);
    Task<IReadOnlyList<UserReport>> GetByReporterIdAsync(Guid reporterId);
    Task<IReadOnlyList<UserReport>> GetByReportedUserIdAsync(Guid reportedUserId);
    Task<IReadOnlyList<UserReport>> GetPendingReportsAsync();
}

