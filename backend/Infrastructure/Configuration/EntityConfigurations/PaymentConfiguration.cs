using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Domain.Entities;

namespace Infrastructure.Configuration.EntityConfigurations;

public class PaymentConfiguration : IEntityTypeConfiguration<Payment>
{
    public void Configure(EntityTypeBuilder<Payment> builder)
    {
        builder.HasKey(p => p.Id);

        // Configure relationships
        builder.HasOne(p => p.User)
            .WithMany()
            .HasForeignKey(p => p.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(p => p.Game)
            .WithMany()
            .HasForeignKey(p => p.GameId)
            .OnDelete(DeleteBehavior.SetNull);

        // Configure decimal precision for Sum
        builder.Property(p => p.Sum)
            .HasPrecision(12, 2);

        // Note: Title property doesn't exist in Payment entity

        // Configure indexes
        builder.HasIndex(p => p.UserId);
        builder.HasIndex(p => p.GameId);
        builder.HasIndex(p => p.Data);
    }
}
