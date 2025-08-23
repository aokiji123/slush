using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Domain.Entities;

public class Comment
{
    public Guid Id { get; set; }
    
    [Required]
    public Guid GameId { get; set; }
    
    [Required]
    public Guid UserId { get; set; }
    
    [Required]
    [MaxLength(4000)]
    public string Text { get; set; }
    
    [Range(0, 5)]
    public int Rating { get; set; }
    
    public int FavoritesCount { get; set; }
    
    public int RepliesCount { get; set; }
    
    public Guid? ParentCommentId { get; set; }
    
    [Required]
    public DateTime CreatedAtDateTime { get; set; }
    
    public Game Game { get; set; }
    public User User { get; set; }
    public Comment ParentComment { get; set; }
    public ICollection<Comment> Replies { get; set; } = new List<Comment>();
}