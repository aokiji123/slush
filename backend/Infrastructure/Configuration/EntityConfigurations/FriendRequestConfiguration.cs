using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Domain.Entities;

namespace Infrastructure.Configuration.EntityConfigurations;

public class FriendRequestConfiguration : IEntityTypeConfiguration<FriendRequest>
{
    public void Configure(EntityTypeBuilder<FriendRequest> builder)
    {
        // Configure composite primary key
        builder.HasKey(fr => new { fr.SenderId, fr.ReceiverId });

        // Configure relationships
        builder.HasOne(fr => fr.Sender)
            .WithMany()
            .HasForeignKey(fr => fr.SenderId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(fr => fr.Receiver)
            .WithMany()
            .HasForeignKey(fr => fr.ReceiverId)
            .OnDelete(DeleteBehavior.Cascade);

        // Configure string properties
        builder.Property(fr => fr.Status)
            .HasMaxLength(20);

        // Configure indexes
        builder.HasIndex(fr => fr.SenderId);
        builder.HasIndex(fr => fr.ReceiverId);
        builder.HasIndex(fr => fr.Status);
    }
}
