using System;

namespace Application.DTOs;

public class BadgeDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Icon { get; set; } = string.Empty;
    public int RequiredValue { get; set; }
    public string RequirementType { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}

public class UserBadgeDto
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public Guid BadgeId { get; set; }
    public DateTime EarnedAt { get; set; }
    public BadgeDto Badge { get; set; } = null!;
}
