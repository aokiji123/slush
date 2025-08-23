using System;
using System.ComponentModel.DataAnnotations;

namespace Domain.Entities;

public class GamePlatform
{
    public Guid Id { get; set; }
    
    [Required]
    public Guid GameId { get; set; }
    
    [Required]
    public Guid PlatformId { get; set; }
    
    public Game Game { get; set; }
    public Platform Platform { get; set; }
}