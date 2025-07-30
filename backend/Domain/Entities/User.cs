using System.ComponentModel.DataAnnotations;

namespace Domain.Entities;

public class User
{
    public Guid Id { get; set; }
    
    [Required]
    [MaxLength(50)]
    public string Username { get; set; }
    
    [Required]
    [MaxLength(255)]
    [EmailAddress]
    public string Email { get; set; }
    
    [Required]
    [MaxLength(255)]
    public string Password { get; set; }
    
    [MaxLength(1000)]
    public string Bio { get; set; }
    public DateTime? FriendsFromDateTime { get; set; }
}