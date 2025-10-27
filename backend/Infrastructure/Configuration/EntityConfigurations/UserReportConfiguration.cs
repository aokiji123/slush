using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Configuration.EntityConfigurations;

public class UserReportConfiguration : IEntityTypeConfiguration<UserReport>
{
    public void Configure(EntityTypeBuilder<UserReport> builder)
    {
        builder.HasKey(r => r.Id);

        builder.Property(r => r.Description)
            .IsRequired()
            .HasMaxLength(1000);

        builder.Property(r => r.Reason)
            .IsRequired();

        builder.Property(r => r.Status)
            .IsRequired()
            .HasDefaultValue(ReportStatus.Pending);

        builder.Property(r => r.CreatedAt)
            .IsRequired();

        // Indexes for efficient querying
        builder.HasIndex(r => r.ReporterId);
        builder.HasIndex(r => r.ReportedUserId);
        builder.HasIndex(r => r.Status);
        builder.HasIndex(r => r.CreatedAt);
        
        // Composite index for common query patterns
        builder.HasIndex(r => new { r.Status, r.CreatedAt });

        // Relationships
        builder.HasOne(r => r.Reporter)
            .WithMany()
            .HasForeignKey(r => r.ReporterId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(r => r.ReportedUser)
            .WithMany()
            .HasForeignKey(r => r.ReportedUserId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}

