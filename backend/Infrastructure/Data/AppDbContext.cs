using Microsoft.EntityFrameworkCore;
using Domain.Entities;

namespace Infrastructure.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Game> Games => Set<Game>();
    public DbSet<User> Users => Set<User>();
    public DbSet<Notifications> Notifications => Set<Notifications>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Game>(b =>
        {
            b.HasIndex(g => g.Slug).IsUnique();
            b.Property(g => g.Images).HasColumnType("text[]");
            b.Property(g => g.Genre).HasColumnType("text[]");
            b.Property(g => g.Platforms).HasColumnType("text[]");
        });

        modelBuilder.Entity<User>(b =>
        {
            b.HasIndex(u => u.Email).IsUnique();
        });

        modelBuilder.Entity<Notifications>(b =>
        {
            b.HasKey(n => n.UserId);
            b.HasOne(n => n.User)
                .WithOne()
                .HasForeignKey<Notifications>(n => n.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        });
    }
}
