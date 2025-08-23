using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Domain.Entities;

public class Forum
{
    public Guid Id { get; set; }
    
    [Required]
    [MaxLength(255)]
    public string Title { get; set; }
    
    [MaxLength(1000)]
    public string Description { get; set; }
    
    [Required]
    public DateTime CreatedAtDateTime { get; set; }
    
    public ICollection<ForumFile> ForumFiles { get; set; } = new List<ForumFile>();
}