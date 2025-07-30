using System.ComponentModel.DataAnnotations;

namespace Domain.Entities;

public class Game
{
    public Guid Id { get; set; }
    
    [Required]
    [MaxLength(255)]
    public string Title { get; set; }
    
    [MaxLength(1000)]
    public string Description { get; set; }
    
    [Required]
    public double Price { get; set; }
    
    [Required]
    public Guid PublisherId { get; set; }
    
    [Required]
    public DateTime ReleaseDate { get; set; }
    
    [Required]
    public DateTime CreatedAtDateTime { get; set; }
}