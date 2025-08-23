using System;
using System.ComponentModel.DataAnnotations;

namespace Domain.Entities;

public class UserWishlist
{
    public Guid Id { get; set; }
    
    [Required]
    public Guid UserId { get; set; }
    
    [Required]
    public Guid GameId { get; set; }
    
    [Required]
    public DateTime AddedAtDateTime { get; set; }
    
    // Navigation properties
    public User User { get; set; }
    public Game Game { get; set; }
} 