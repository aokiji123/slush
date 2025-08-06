using System.ComponentModel.DataAnnotations;

namespace Domain.Entities;

public class Comment
{
    public Guid Id { get; set; }
    
    [Required]
    public Guid ForumId { get; set; }
    
    [Required]
    public Guid PostId { get; set; }
    
    [Required]
    public Guid UserId { get; set; }
    
    [Required]
    [MaxLength(4000)]
    public string Text { get; set; }
    
    public Guid? ParentCommentId { get; set; }
    
    [Required]
    public DateTime CreatedAtDateTime { get; set; }
}