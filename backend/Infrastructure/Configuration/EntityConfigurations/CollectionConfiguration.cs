using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Domain.Entities;

namespace Infrastructure.Configuration.EntityConfigurations;

public class CollectionConfiguration : IEntityTypeConfiguration<GameCollection>
{
    public void Configure(EntityTypeBuilder<GameCollection> builder)
    {
        builder.HasKey(c => c.Id);

        // Configure properties
        builder.Property(c => c.Name)
            .HasMaxLength(100)
            .IsRequired();

        builder.Property(c => c.Description)
            .HasMaxLength(500);

        // Configure relationships
        builder.HasOne(c => c.User)
            .WithMany()
            .HasForeignKey(c => c.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(c => c.Games)
            .WithOne(cg => cg.Collection)
            .HasForeignKey(cg => cg.CollectionId)
            .OnDelete(DeleteBehavior.Cascade);

        // Configure indexes
        builder.HasIndex(c => c.UserId);
        builder.HasIndex(c => c.CreatedAt);
    }
}

