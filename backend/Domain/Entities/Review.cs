using System.ComponentModel.DataAnnotations;

namespace Domain.Entities;

public class Review
{
    public Guid Id { get; set; }
    
    [Required]
    public Guid GameId { get; set; }
    
    [Required]
    public Guid UserId { get; set; }
    
    [Required]
    [Range(0, 5)]
    public int Rating { get; set; }
    
    [MaxLength(1000)]
    public string Comment { get; set; }
    
    [Required]
    public DateTime CreatedAtDateTime { get; set; }
}