using System;
using System.ComponentModel.DataAnnotations;

namespace Domain.Entities;

public class GameFile
{
    public Guid Id { get; set; }
    
    public Guid? MessageId { get; set; }
    
    [Required]
    public Guid FileTypeId { get; set; }
    
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
    
    public Message Message { get; set; }
    public FileType FileType { get; set; }
}