using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Domain.Entities;

public class Achievement
{
    public Guid Id { get; set; }
    
    [Required]
    public Guid GameId { get; set; }
    
    [Required]
    [MaxLength(255)]
    public string Title { get; set; }
    
    [MaxLength(1000)]
    public string Description { get; set; }
    
    [MaxLength(255)]
    public string IconUrl { get; set; }
    
    [Required]
    public DateTime CreatedAtDateTime { get; set; }
    
    public Game Game { get; set; }
    public ICollection<UserAchievement> UserAchievements { get; set; } = new List<UserAchievement>();
}