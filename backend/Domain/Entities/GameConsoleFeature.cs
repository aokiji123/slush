using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Domain.Entities;

public class GameConsoleFeature
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();
    
    public Guid GameId { get; set; }
    
    [MaxLength(50)]
    public string Platform { get; set; } = string.Empty;
    
    public string? PerformanceModes { get; set; } // JSON string
    
    [MaxLength(100)]
    public string? Resolution { get; set; }
    
    [MaxLength(50)]
    public string? FrameRate { get; set; }
    
    public bool HDRSupport { get; set; }
    
    public bool RayTracingSupport { get; set; }
    
    public string? ControllerFeatures { get; set; }
    
    [MaxLength(50)]
    public string? StorageRequired { get; set; }
    
    public bool OnlinePlayRequired { get; set; }
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    
    public Game? Game { get; set; }
}

