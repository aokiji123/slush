using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Domain.Entities;

namespace Infrastructure.Configuration.EntityConfigurations;

public class FriendshipConfiguration : IEntityTypeConfiguration<Friendship>
{
    public void Configure(EntityTypeBuilder<Friendship> builder)
    {
        // Configure composite primary key
        builder.HasKey(f => new { f.User1Id, f.User2Id });

        // Configure relationships
        builder.HasOne(f => f.User1)
            .WithMany()
            .HasForeignKey(f => f.User1Id)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(f => f.User2)
            .WithMany()
            .HasForeignKey(f => f.User2Id)
            .OnDelete(DeleteBehavior.Cascade);

        // Configure indexes
        builder.HasIndex(f => f.User1Id);
        builder.HasIndex(f => f.User2Id);
    }
}
