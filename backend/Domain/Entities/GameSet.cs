using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Domain.Entities;

public class GameSet
{
    public Guid Id { get; set; }
    
    [Required]
    [MaxLength(255)]
    public string Name { get; set; }
    
    [MaxLength(1000)]
    public string Description { get; set; }
    
    public List<string> Content { get; set; } = new List<string>();
    
    [Required]
    public double Price { get; set; }
    
    public double? OldPrice { get; set; }
    
    [Range(0, 100)]
    public byte? SalePercent { get; set; }
    
    public DateTime? SaleEndDate { get; set; }
    
    [Required]
    public Guid GameId { get; set; }
    
    [Required]
    public Guid UserId { get; set; }
    
    [Required]
    public DateTime CreatedAtDateTime { get; set; }
    
    public Game Game { get; set; }
    public User User { get; set; }
}