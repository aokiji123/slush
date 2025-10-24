using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Domain.Entities;

namespace Infrastructure.Configuration.EntityConfigurations;

public class ReviewConfiguration : IEntityTypeConfiguration<Review>
{
    public void Configure(EntityTypeBuilder<Review> builder)
    {
        builder.HasKey(r => r.Id);

        // Configure relationships
        builder.HasOne(r => r.User)
            .WithMany()
            .HasForeignKey(r => r.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(r => r.Game)
            .WithMany(g => g.Reviews)
            .HasForeignKey(r => r.GameId)
            .OnDelete(DeleteBehavior.Cascade);

        // Configure string properties
        builder.Property(r => r.Content)
            .HasMaxLength(2000);

        // Configure indexes
        builder.HasIndex(r => r.GameId);
        builder.HasIndex(r => r.UserId);
        builder.HasIndex(r => r.Rating);
        builder.HasIndex(r => r.CreatedAt);
        builder.HasIndex(r => new { r.GameId, r.UserId });
    }
}
