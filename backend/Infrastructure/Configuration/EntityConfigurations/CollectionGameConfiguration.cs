using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Domain.Entities;

namespace Infrastructure.Configuration.EntityConfigurations;

public class CollectionGameConfiguration : IEntityTypeConfiguration<CollectionGame>
{
    public void Configure(EntityTypeBuilder<CollectionGame> builder)
    {
        builder.HasKey(cg => new { cg.CollectionId, cg.GameId });

        // Configure relationships
        builder.HasOne(cg => cg.Collection)
            .WithMany(c => c.Games)
            .HasForeignKey(cg => cg.CollectionId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(cg => cg.Game)
            .WithMany()
            .HasForeignKey(cg => cg.GameId)
            .OnDelete(DeleteBehavior.Cascade);

        // Configure indexes
        builder.HasIndex(cg => cg.GameId);
        builder.HasIndex(cg => cg.AddedAt);
    }
}

