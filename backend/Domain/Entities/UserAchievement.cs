using System;
using System.ComponentModel.DataAnnotations;

namespace Domain.Entities;

public class UserAchievement
{
    public Guid Id { get; set; }
    
    [Required]
    public Guid AchievementId { get; set; }
    
    [Required]
    public Guid UserId { get; set; }
    
    [Required]
    public DateTime UnlockedAtDateTime { get; set; }
}