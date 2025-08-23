using System;
using System.ComponentModel.DataAnnotations;

namespace Domain.Entities;

public class Dlc
{
    public Guid Id { get; set; }
    
    [Required]
    [MaxLength(255)]
    public string Name { get; set; }
    
    [MaxLength(1000)]
    public string Description { get; set; }
    
    [Required]
    public double Price { get; set; }
    
    [Required]
    public DateTime ReleaseDate { get; set; }
    
    [Required]
    public DateTime CreatedAtDateTime { get; set; }
    
    [Required]
    public Guid GameId { get; set; }

    public Game Game { get; set; }
}