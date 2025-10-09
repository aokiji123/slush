using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Identity;

namespace Domain.Entities;

public class User : IdentityUser<Guid>
{
    // IdentityUser provides:
    // - Id (Guid)
    // - UserName
    // - Email
    // - EmailConfirmed
    // - PhoneNumber
    // - etc.

    // Additional properties matching UserDto
    public string Nickname { get; set; } = string.Empty;
    public string? Bio { get; set; }
    public string Lang { get; set; } = "UA";
    public string? Avatar { get; set; }
    public string? Banner { get; set; }
    public decimal Balance { get; set; }
    public DateTime CreatedAtDateTime { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public virtual ICollection<UserRole> UserRoles { get; set; } = new List<UserRole>();
    public virtual ICollection<RefreshToken> RefreshTokens { get; set; } = new List<RefreshToken>();
}