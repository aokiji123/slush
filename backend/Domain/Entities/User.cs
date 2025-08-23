using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Domain.Entities;

public class User
{
    public Guid Id { get; set; }
    
    [Required]
    [MaxLength(100)]
    public string Username { get; set; }
    
    [Required]
    [MaxLength(255)]
    [EmailAddress]
    public string Email { get; set; }
    
    [Required]
    [MaxLength(255)]
    public string Password { get; set; }
    
    [MaxLength(1000)]
    public string Bio { get; set; } = string.Empty;
    
    [MaxLength(255)]
    public string Avatar { get; set; } = string.Empty;
    
    public DateTime? FriendsFromDateTime { get; set; }
    
    [Required]
    public DateTime CreatedAtDateTime { get; set; }
    
    public ICollection<Friendship> FirstUserFriendships { get; set; } = new List<Friendship>();
    public ICollection<Friendship> SecondUserFriendships { get; set; } = new List<Friendship>();
    public ICollection<ChatParticipant> ChatParticipants { get; set; } = new List<ChatParticipant>();
    public ICollection<Message> Messages { get; set; } = new List<Message>();

    public ICollection<Review> Reviews { get; set; } = new List<Review>();
    public ICollection<UserAchievement> UserAchievements { get; set; } = new List<UserAchievement>();
    public ICollection<GameSet> GameSets { get; set; } = new List<GameSet>();
    public ICollection<UserWishlist> Wishlists { get; set; } = new List<UserWishlist>();
    public ICollection<UserOwnedGame> OwnedGames { get; set; } = new List<UserOwnedGame>();
}
