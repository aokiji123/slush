using System;
using System.ComponentModel.DataAnnotations;

namespace Domain.Entities;

public class File
{
    public Guid Id { get; set; }
    
    [Required]
    public Guid MessageId { get; set; }
    
    [Required]
    public FileType Type { get; set; }
    
    [Required]
    [MaxLength(50)]
    public string MimeType { get; set; }
    
    [Required]
    [MaxLength(255)]
    public string Url { get; set; }
    
    [Required]
    public long Size { get; set; }
    
    [Required]
    public DateTime CreatedAtDateTime { get; set; }
}