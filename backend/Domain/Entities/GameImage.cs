using System;
using System.ComponentModel.DataAnnotations;

namespace Domain.Entities;

public class GameImage
{
    public Guid Id { get; set; }
    
    [Required]
    public Guid GameId { get; set; }
    
    [Required]
    [MaxLength(255)]
    public string ImageUrl { get; set; }
    
    [MaxLength(100)]
    public string AltText { get; set; }
    
    [Required]
    public bool IsMainImage { get; set; }
    
    [Required]
    public DateTime CreatedAtDateTime { get; set; }

    public Game Game { get; set; }
} 