using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Domain.Entities;

public class Game
{
    [Key]
    public Guid Id { get; set; }
    
    [Required]
    [MaxLength(255)]
    public string Title { get; set; }
    
    [MaxLength(1000)]
    public string Description { get; set; }
    
    public string MainImage { get; set; }
    
    [Required]
    public double Price { get; set; }
    
    public double Rating { get; set; }
    
    [Required]
    public DateTime ReleaseDate { get; set; }
    
    [Required]
    public DateTime CreatedAtDateTime { get; set; }
    
    [Required]
    public Guid DeveloperId { get; set; }
    public Developer Developer { get; set; }
    
    [Required]
    public Guid PublisherId { get; set; }
    public Publisher Publisher { get; set; }
    
    public ICollection<GameGenre> GameGenres { get; set; } = new List<GameGenre>();
    public ICollection<GamePlatform> GamePlatforms { get; set; } = new List<GamePlatform>();
    public ICollection<GameImage> GameImages { get; set; } = new List<GameImage>();
    public ICollection<GameSet> GameSets { get; set; } = new List<GameSet>();
    public ICollection<Dlc> Dlcs { get; set; } = new List<Dlc>();
    public ICollection<Comment> Comments { get; set; } = new List<Comment>();
    public ICollection<Review> Reviews { get; set; } = new List<Review>();
    public ICollection<Achievement> Achievements { get; set; } = new List<Achievement>();
    public ICollection<UserWishlist> UserWishlists { get; set; } = new List<UserWishlist>();
    public ICollection<UserOwnedGame> UserOwnedGames { get; set; } = new List<UserOwnedGame>();
}