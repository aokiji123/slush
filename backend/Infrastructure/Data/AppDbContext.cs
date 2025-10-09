using Microsoft.EntityFrameworkCore;
using Domain.Entities;

namespace Infrastructure.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<User> Users { get; set; }
    public DbSet<Game> Games { get; set; }
    public DbSet<Discount> Discounts { get; set; }
    public DbSet<UserOwnedGame> UserOwnedGames { get; set; }
    public DbSet<UserBalance> UserBalances { get; set; }
    public DbSet<WalletTransaction> WalletTransactions { get; set; }
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

        // Настройка связей между сущностями
        modelBuilder.Entity<Game>()
            .HasOne(g => g.Discount)
            .WithMany()
            .HasForeignKey(g => g.DiscountId)
            .OnDelete(DeleteBehavior.SetNull);

        modelBuilder.Entity<Game>()
            .HasIndex(g => new { g.IsDlc, g.BaseGameId });

        // Убираем составной ключ, так как теперь у UserOwnedGame есть Id
        modelBuilder.Entity<UserOwnedGame>()
            .HasOne(uog => uog.User)
            .WithMany()
            .HasForeignKey(uog => uog.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<UserOwnedGame>()
            .HasOne(uog => uog.Game)
            .WithMany()
            .HasForeignKey(uog => uog.GameId)
            .OnDelete(DeleteBehavior.Cascade);

        // Добавляем индекс для уникальности пары UserId-GameId
        modelBuilder.Entity<UserOwnedGame>()
            .HasIndex(uog => new { uog.UserId, uog.GameId })
            .IsUnique();

        modelBuilder.Entity<UserBalance>()
            .HasOne(ub => ub.User)
            .WithOne()
            .HasForeignKey<UserBalance>(ub => ub.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<WalletTransaction>()
            .HasOne(wt => wt.User)
            .WithMany()
            .HasForeignKey(wt => wt.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        // Настройка точности для decimal полей
        modelBuilder.Entity<Game>()
            .Property(g => g.Price)
            .HasPrecision(10, 2);

        modelBuilder.Entity<UserOwnedGame>()
            .Property(uog => uog.PurchasePrice)
            .HasPrecision(10, 2);

        modelBuilder.Entity<UserBalance>()
            .Property(ub => ub.Amount)
            .HasPrecision(12, 2);

        modelBuilder.Entity<WalletTransaction>()
            .Property(wt => wt.Amount)
            .HasPrecision(12, 2);

        // Configure Wishlist composite primary key
        modelBuilder.Entity<Wishlist>()
            .HasKey(w => new { w.UserId, w.GameId });

        modelBuilder.Entity<Wishlist>()
            .HasOne<User>()
            .WithMany()
            .HasForeignKey(w => w.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Wishlist>()
            .HasOne<Game>()
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