using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Domain.Entities;

namespace Infrastructure.Configuration.EntityConfigurations;

public class UserConfiguration : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        builder.HasKey(u => u.Id);

        // Configure string properties
        builder.Property(u => u.UserName)
            .HasMaxLength(256)
            .IsRequired();

        builder.Property(u => u.NormalizedUserName)
            .HasMaxLength(256);

        builder.Property(u => u.Email)
            .HasMaxLength(256)
            .IsRequired();

        builder.Property(u => u.NormalizedEmail)
            .HasMaxLength(256);

        builder.Property(u => u.PasswordHash)
            .HasMaxLength(500);

        builder.Property(u => u.SecurityStamp)
            .HasMaxLength(500);

        builder.Property(u => u.ConcurrencyStamp)
            .HasMaxLength(500);

        builder.Property(u => u.PhoneNumber)
            .HasMaxLength(50);

        builder.Property(u => u.Nickname)
            .HasMaxLength(50)
            .IsRequired();

        builder.Property(u => u.Bio)
            .HasMaxLength(500);

        builder.Property(u => u.Avatar)
            .HasMaxLength(500);

        builder.Property(u => u.Banner)
            .HasMaxLength(500);

        builder.Property(u => u.Lang)
            .HasMaxLength(5)
            .IsRequired();

        // Note: BioTranslations property doesn't exist in User entity

        // Configure indexes
        builder.HasIndex(u => u.NormalizedUserName)
            .IsUnique();

        builder.HasIndex(u => u.NormalizedEmail)
            .IsUnique();

        builder.HasIndex(u => u.Nickname);
        builder.HasIndex(u => u.UserName);
        builder.HasIndex(u => u.IsOnline);
        builder.HasIndex(u => u.LastSeenAt);
        builder.HasIndex(u => new { u.IsOnline, u.LastSeenAt });
    }
}
