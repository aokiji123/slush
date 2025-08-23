using System;
using System.ComponentModel.DataAnnotations;

namespace Domain.Entities;

public class Friendship
{
    public Guid Id { get; set; }
    
    [Required]
    public Guid FirstUserId { get; set; }
    
    [Required]
    public Guid SecondUserId { get; set; }
    
    [Required]
    public DateTime FriendsFromDateTime { get; set; }
    
    public User FirstUser { get; set; }
    public User SecondUser { get; set; }
}