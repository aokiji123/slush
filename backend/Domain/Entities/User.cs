using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Identity;

namespace Domain.Entities;

public class User : IdentityUser<Guid>
{
    public string Nickname { get; set; } = string.Empty;
    public string? Bio { get; set; }
    public string Lang { get; set; } = "UA";
    public string? Avatar { get; set; } = "https://static.vecteezy.com/system/resources/previews/060/605/418/non_2x/default-avatar-profile-icon-social-media-user-free-vector.jpg";
    public string? Banner { get; set; }
    public decimal Balance { get; set; }
    public DateTime CreatedAtDateTime { get; set; } = DateTime.UtcNow;
    
    public DateTime? LastSeenAt { get; set; }
    public bool IsOnline { get; set; } = false;

    public virtual ICollection<UserRole> UserRoles { get; set; } = new List<UserRole>();
    public virtual ICollection<RefreshToken> RefreshTokens { get; set; } = new List<RefreshToken>();
}