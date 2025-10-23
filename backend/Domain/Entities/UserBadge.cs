using System;

namespace Domain.Entities;

public class UserBadge
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public Guid BadgeId { get; set; }
    public DateTime EarnedAt { get; set; }
    
    // Navigation properties
    public User User { get; set; } = null!;
    public Badge Badge { get; set; } = null!;
}
