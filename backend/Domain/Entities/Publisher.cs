using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Domain.Entities;

public class Publisher
{
    public Guid Id { get; set; }
    
    [Required]
    [MaxLength(255)]
    public string Name { get; set; }
    
    [MaxLength(1000)]
    public string Description { get; set; }
    
    [MaxLength(255)]
    public string Website { get; set; }
    
    [Required]
    public DateTime CreatedAtDateTime { get; set; }
    
    public ICollection<Game> Games { get; set; } = new List<Game>();
} 