using System;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Configuration.EntityConfigurations;

public class ChatMessageAttachmentConfiguration : IEntityTypeConfiguration<ChatMessageAttachment>
{
    public void Configure(EntityTypeBuilder<ChatMessageAttachment> builder)
    {
        builder.HasKey(e => e.Id);

        // Configure properties
        builder.Property(e => e.Url)
            .HasMaxLength(500)
            .IsRequired();

        builder.Property(e => e.FileName)
            .HasMaxLength(255)
            .IsRequired();

        builder.Property(e => e.ContentType)
            .HasMaxLength(100);

        builder.Property(e => e.AttachmentType)
            .HasConversion<int>();

        builder.Property(e => e.CreatedAt)
            .HasDefaultValueSql("NOW()");

        // Configure relationships
        builder.HasOne(e => e.Message)
            .WithMany(m => m.Attachments)
            .HasForeignKey(e => e.MessageId)
            .OnDelete(DeleteBehavior.Cascade);

        // Configure indexes
        builder.HasIndex(e => e.MessageId);
        builder.HasIndex(e => e.AttachmentType);
        builder.HasIndex(e => e.CreatedAt);
    }
}
