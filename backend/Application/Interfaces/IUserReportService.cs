using System;
using System.Threading.Tasks;
using Application.DTOs;

namespace Application.Interfaces;

public interface IUserReportService
{
    Task<UserReportDto> CreateReportAsync(Guid reporterId, CreateUserReportDto dto);
    Task<UserReportDto?> GetReportByIdAsync(Guid id);
}

