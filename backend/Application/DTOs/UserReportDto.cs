using System;
using Domain.Entities;

namespace Application.DTOs;

public class CreateUserReportDto
{
    public Guid ReportedUserId { get; set; }
    public ReportReason Reason { get; set; }
    public string Description { get; set; } = string.Empty;
}

public class UserReportDto
{
    public Guid Id { get; set; }
    public Guid ReporterId { get; set; }
    public Guid ReportedUserId { get; set; }
    public ReportReason Reason { get; set; }
    public string Description { get; set; } = string.Empty;
    public ReportStatus Status { get; set; }
    public DateTime CreatedAt { get; set; }
}

