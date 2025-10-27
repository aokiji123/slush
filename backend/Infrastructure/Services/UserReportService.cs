using System;
using System.Threading.Tasks;
using Application.Common.Exceptions;
using Application.DTOs;
using Application.Interfaces;
using AutoMapper;
using Domain.Entities;
using Domain.Interfaces;
using Microsoft.Extensions.Logging;

namespace Infrastructure.Services;

public class UserReportService : IUserReportService
{
    private readonly IUserReportRepository _userReportRepository;
    private readonly IMapper _mapper;
    private readonly ILogger<UserReportService> _logger;

    public UserReportService(
        IUserReportRepository userReportRepository,
        IMapper mapper,
        ILogger<UserReportService> logger)
    {
        _userReportRepository = userReportRepository;
        _mapper = mapper;
        _logger = logger;
    }

    public async Task<UserReportDto> CreateReportAsync(Guid reporterId, CreateUserReportDto dto)
    {
        _logger.LogInformation("Creating user report from {ReporterId} for {ReportedUserId}", reporterId, dto.ReportedUserId);

        // Validate that user is not reporting themselves
        if (reporterId == dto.ReportedUserId)
        {
            throw new ValidationException("You cannot report yourself");
        }

        var report = _mapper.Map<UserReport>(dto);
        report.ReporterId = reporterId;
        report.Status = ReportStatus.Pending;
        report.CreatedAt = DateTime.UtcNow;

        var createdReport = await _userReportRepository.CreateAsync(report);
        
        _logger.LogInformation("User report created successfully with ID {ReportId}", createdReport.Id);

        return _mapper.Map<UserReportDto>(createdReport);
    }

    public async Task<UserReportDto?> GetReportByIdAsync(Guid id)
    {
        _logger.LogInformation("Retrieving user report {ReportId}", id);

        var report = await _userReportRepository.GetByIdAsync(id);
        if (report == null)
        {
            _logger.LogWarning("User report {ReportId} not found", id);
            return null;
        }

        return _mapper.Map<UserReportDto>(report);
    }
}

