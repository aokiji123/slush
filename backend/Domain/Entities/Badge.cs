using System;

namespace Domain.Entities;

public class Badge
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Icon { get; set; } = string.Empty;
    public int RequiredValue { get; set; }
    public string RequirementType { get; set; } = string.Empty; // "games", "friends", "reviews", "posts", etc.
    public DateTime CreatedAt { get; set; }
}
