using System;
using System.ComponentModel.DataAnnotations;

namespace Domain.Entities;

public class UserReport
{
    [Key]
    public Guid Id { get; set; }

    [Required]
    public Guid ReporterId { get; set; }
    public User Reporter { get; set; } = null!;

    [Required]
    public Guid ReportedUserId { get; set; }
    public User ReportedUser { get; set; } = null!;

    [Required]
    public ReportReason Reason { get; set; }

    [Required]
    [MaxLength(1000)]
    public string Description { get; set; } = string.Empty;

    [Required]
    public ReportStatus Status { get; set; } = ReportStatus.Pending;

    [Required]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime? ResolvedAt { get; set; }

    public Guid? ResolvedById { get; set; }
}

public enum ReportReason
{
    Harassment = 0,
    Spam = 1,
    InappropriateContent = 2,
    Impersonation = 3,
    Other = 4
}

public enum ReportStatus
{
    Pending = 0,
    UnderReview = 1,
    Resolved = 2,
    Dismissed = 3
}

