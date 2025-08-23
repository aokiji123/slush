using System;
using System.ComponentModel.DataAnnotations;

namespace Domain.Entities;

public class GameGenre
{
    public Guid Id { get; set; }
    
    [Required]
    public Guid GameId { get; set; }
    
    [Required]
    public Guid GenreId { get; set; }
    
    public Game Game { get; set; }
    public Genre Genre { get; set; }
}