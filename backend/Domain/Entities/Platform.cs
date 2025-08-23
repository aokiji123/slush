using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Domain.Entities;

public class Platform
{
    public Guid Id { get; set; }
    
    [Required]
    [MaxLength(100)]
    public string Name { get; set; }
    
    [MaxLength(500)]
    public string Description { get; set; }
    
    [Required]
    public DateTime CreatedAtDateTime { get; set; }
    
    public ICollection<GamePlatform> GamePlatforms { get; set; } = new List<GamePlatform>();
}