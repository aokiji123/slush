using System.ComponentModel.DataAnnotations;

namespace Domain.Entities;

public class User
{
    public Guid Id { get; set; }
<<<<<<< HEAD
    
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
=======
    public string Username { get; set; }
    public string Email { get; set; }
    public DateTime CreatedAt { get; set; }
}
>>>>>>> f6eb570dd3fb604ad1e6c77e95f2f8f0e4d635bd
