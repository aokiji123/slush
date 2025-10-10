using Microsoft.EntityFrameworkCore;
using Domain.Entities;

namespace Infrastructure.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<User> Users { get; set; }
    public DbSet<Game> Games { get; set; }
    public DbSet<GameCharacteristic> GameCharacteristics { get; set; }
    // Removed: public DbSet<Discount> Discounts { get; set; }
    // Removed: public DbSet<UserOwnedGame> UserOwnedGames { get; set; }
    public DbSet<UserRole> UserRoles { get; set; }
    public DbSet<Wishlist> Wishlists { get; set; }
    public DbSet<Library> Libraries { get; set; }
    public DbSet<Payment> Payments { get; set; }
    public DbSet<Review> Reviews { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.Entity<UserRole>()
            .HasKey(ur => new { ur.UserId, ur.RoleId });

        // Removed discount relation; SalePrice drives promotions

        modelBuilder.Entity<Game>()
            .HasOne(g => g.GameCharacteristic)
            .WithOne(gc => gc.Game)
            .HasForeignKey<GameCharacteristic>(gc => gc.GameId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Game>()
            .HasIndex(g => new { g.IsDlc, g.BaseGameId });

        // Removed UserOwnedGame configuration in favor of Library

        // Removed UserBalance; using User.Balance as source of truth

        // Настройка точности для decimal полей
        modelBuilder.Entity<Game>()
            .Property(g => g.Price)
            .HasPrecision(10, 2);

        // Removed UserOwnedGame precision config

        

        // Configure Wishlist composite primary key
        modelBuilder.Entity<Wishlist>()
            .HasKey(w => new { w.UserId, w.GameId });

        modelBuilder.Entity<Wishlist>()
            .HasOne(w => w.User)
            .WithMany()
            .HasForeignKey(w => w.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Wishlist>()
            .HasOne(w => w.Game)
            .WithMany()
            .HasForeignKey(w => w.GameId)
            .OnDelete(DeleteBehavior.Cascade);

        // Configure Library entity relationships
        modelBuilder.Entity<Library>()
            .HasOne(l => l.User)
            .WithMany()
            .HasForeignKey(l => l.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Library>()
            .HasOne(l => l.Game)
            .WithMany()
            .HasForeignKey(l => l.GameId)
            .OnDelete(DeleteBehavior.Cascade);

        // Add unique index to prevent duplicate entries
        modelBuilder.Entity<Library>()
            .HasIndex(l => new { l.UserId, l.GameId })
            .IsUnique();

        // Configure Payment entity relationships
        modelBuilder.Entity<Payment>()
            .HasOne(p => p.User)
            .WithMany()
            .HasForeignKey(p => p.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Payment>()
            .HasOne(p => p.Game)
            .WithMany()
            .HasForeignKey(p => p.GameId)
            .OnDelete(DeleteBehavior.SetNull);

        // Configure decimal precision for Payment
        modelBuilder.Entity<Payment>()
            .Property(p => p.Sum)
            .HasPrecision(12, 2);

        modelBuilder.Entity<Review>()
            .HasOne(r => r.Game)
            .WithMany(g => g.Reviews)
            .HasForeignKey(r => r.GameId)
            .OnDelete(DeleteBehavior.Cascade);
        modelBuilder.Entity<Review>()
            .HasIndex(r => r.GameId);
    }
}