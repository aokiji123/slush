using System;
using Microsoft.AspNetCore.Identity;

namespace Domain.Entities;

public class UserRole : IdentityUserRole<Guid>
{
    public virtual User User { get; set; } = null!;
    public virtual IdentityRole<Guid> Role { get; set; } = null!;
}
