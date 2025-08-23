using System;
using System.ComponentModel.DataAnnotations;

namespace Domain.Entities;

public class ForumFile
{
    public Guid Id { get; set; }
    
    [Required]
    public Guid ForumId { get; set; }
    
    [Required]
    [MaxLength(255)]
    public string Url { get; set; }
    
    [Required]
    [MaxLength(50)]
    public string MimeType { get; set; }
    
    [Required]
    public DateTime CreatedAtDateTime { get; set; }

    public Forum Forum { get; set; }
}