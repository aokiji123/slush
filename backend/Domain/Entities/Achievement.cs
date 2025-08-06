using System.ComponentModel.DataAnnotations;

namespace Domain.Entities;

public class Achievement
{
    public Guid Id { get; set; }
    
    [Required]
    public Guid GameId { get; set; }
    
    [Required]
    [MaxLength(255)]
    public string Title { get; set; }
    
    [MaxLength(1000)]
    public string Description { get; set; }
}