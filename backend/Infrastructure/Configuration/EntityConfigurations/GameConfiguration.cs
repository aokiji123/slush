using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Domain.Entities;

namespace Infrastructure.Configuration.EntityConfigurations;

public class GameConfiguration : IEntityTypeConfiguration<Game>
{
    public void Configure(EntityTypeBuilder<Game> builder)
    {
        builder.HasKey(g => g.Id);

        // Configure one-to-one relationship with GameCharacteristic
        builder.HasOne(g => g.GameCharacteristic)
            .WithOne(gc => gc.Game)
            .HasForeignKey<GameCharacteristic>(gc => gc.GameId)
            .OnDelete(DeleteBehavior.Cascade);

        // Configure composite index for DLC filtering
        builder.HasIndex(g => new { g.IsDlc, g.BaseGameId });

        // Configure decimal precision for Price
        builder.Property(g => g.Price)
            .HasPrecision(10, 2);

        // Configure decimal precision for SalePrice
        builder.Property(g => g.SalePrice)
            .HasPrecision(10, 2);

        // Configure string properties
        builder.Property(g => g.Slug)
            .HasMaxLength(200)
            .IsRequired();

        builder.Property(g => g.MainImage)
            .HasMaxLength(500);

        // Configure JSONB properties for translations
        builder.Property(g => g.NameTranslations)
            .HasColumnType("jsonb")
            .IsRequired();

        builder.Property(g => g.DescriptionTranslations)
            .HasColumnType("jsonb")
            .IsRequired();

        builder.Property(g => g.DeveloperTranslations)
            .HasColumnType("jsonb")
            .IsRequired();

        builder.Property(g => g.PublisherTranslations)
            .HasColumnType("jsonb")
            .IsRequired();

        builder.Property(g => g.GenreTranslations)
            .HasColumnType("jsonb")
            .IsRequired();

        // Configure array properties
        builder.Property(g => g.Platforms)
            .HasColumnType("text[]");

        // Note: Tags property doesn't exist in Game entity

        // Configure indexes
        builder.HasIndex(g => g.Rating);
        builder.HasIndex(g => g.Price);
        builder.HasIndex(g => g.SalePrice);
        builder.HasIndex(g => g.ReleaseDate);
    }
}
