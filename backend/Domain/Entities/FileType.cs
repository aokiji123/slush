using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Domain.Entities;

public class FileType
{
    public Guid Id { get; set; }
    
    [Required]
    [MaxLength(50)]
    public string Name { get; set; }
    
    [MaxLength(200)]
    public string Description { get; set; }
    
    [Required]
    public DateTime CreatedAtDateTime { get; set; }
    
    public ICollection<GameFile> Files { get; set; } = new List<GameFile>();
}