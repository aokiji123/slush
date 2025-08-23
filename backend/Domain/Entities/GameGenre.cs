using System;
using System.ComponentModel.DataAnnotations;

namespace Domain.Entities;

public class GameGenre
{
    public Guid Id { get; set; }
    
    [Required]
    public Guid GameId { get; set; }
    
    [Required]
    public Genre Genre { get; set; }
}