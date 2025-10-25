using System;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Configuration.EntityConfigurations;

public class ChatMessageConfiguration : IEntityTypeConfiguration<ChatMessage>
{
    public void Configure(EntityTypeBuilder<ChatMessage> builder)
    {
        builder.HasKey(e => e.Id);

        // Configure properties
        builder.Property(e => e.Content)
            .HasMaxLength(2000);

        builder.Property(e => e.MediaUrl)
            .HasMaxLength(500);

        builder.Property(e => e.FileName)
            .HasMaxLength(255);

        builder.Property(e => e.ContentType)
            .HasMaxLength(100);

        builder.Property(e => e.MessageType)
            .HasConversion<int>();

        builder.Property(e => e.CreatedAt)
            .HasDefaultValueSql("NOW()");

        // Configure relationships
        builder.HasOne(e => e.Sender)
            .WithMany()
            .HasForeignKey(e => e.SenderId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(e => e.Receiver)
            .WithMany()
            .HasForeignKey(e => e.ReceiverId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasMany(e => e.Attachments)
            .WithOne(a => a.Message)
            .HasForeignKey(a => a.MessageId)
            .OnDelete(DeleteBehavior.Cascade);

        // Configure indexes for optimal query performance
        builder.HasIndex(e => e.SenderId);
        builder.HasIndex(e => e.ReceiverId);
        builder.HasIndex(e => e.CreatedAt);
        builder.HasIndex(e => e.MessageType);
        builder.HasIndex(e => e.IsDeleted);
        
        // Composite indexes for common queries
        builder.HasIndex(e => new { e.SenderId, e.ReceiverId, e.CreatedAt });
        builder.HasIndex(e => new { e.ReceiverId, e.SenderId, e.CreatedAt });
        builder.HasIndex(e => new { e.SenderId, e.IsDeleted, e.CreatedAt });
        builder.HasIndex(e => new { e.ReceiverId, e.IsDeleted, e.CreatedAt });
    }
}
