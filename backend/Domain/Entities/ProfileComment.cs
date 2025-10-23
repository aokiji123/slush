using System;

namespace Domain.Entities;

public class ProfileComment
{
    public Guid Id { get; set; }
    public Guid ProfileUserId { get; set; }  // Whose profile
    public Guid AuthorId { get; set; }        // Who wrote it
    public string Content { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    
    // Navigation properties
    public User ProfileUser { get; set; } = null!;
    public User Author { get; set; } = null!;
}
