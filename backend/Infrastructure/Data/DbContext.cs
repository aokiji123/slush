using Microsoft.EntityFrameworkCore;
using Domain.Entities;

namespace Infrastructure.Data;

public class DbContext : Microsoft.EntityFrameworkCore.DbContext
{
    public DbSet<Chat> Chats { get; set; }
    public DbSet<ChatParticipant> ChatParticipants { get; set; }
    public DbSet<User> Users { get; set; }
    public DbSet<Friendship> Friendships { get; set; }
    public DbSet<Message> Messages { get; set; }
    public DbSet<Domain.Entities.File> Files { get; set; }
    public DbSet<Game> Games { get; set; }
    public DbSet<Developer> Developers { get; set; }
    public DbSet<Review> Reviews { get; set; }
    public DbSet<GameGenre> GameGenres { get; set; }
    public DbSet<UserAchievement> UserAchievements { get; set; }
    public DbSet<Achievement> Achievements { get; set; }
    public DbSet<Forum> Forums { get; set; }
    public DbSet<Comment> Comments { get; set; }
    public DbSet<ForumFile> ForumFiles { get; set; }

    public DbContext(DbContextOptions options) : base(options) { }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<ChatParticipant>()
            .HasKey(cp => cp.Id);
        modelBuilder.Entity<ChatParticipant>()
            .HasOne<Chat>()
            .WithMany()
            .HasForeignKey(cp => cp.ChatId);
        modelBuilder.Entity<ChatParticipant>()
            .HasOne<User>()
            .WithMany()
            .HasForeignKey(cp => cp.UserId);

        modelBuilder.Entity<Friendship>()
            .HasKey(f => f.Id);
        modelBuilder.Entity<Friendship>()
            .HasOne<User>()
            .WithMany()
            .HasForeignKey(f => f.FirstUserId);
        modelBuilder.Entity<Friendship>()
            .HasOne<User>()
            .WithMany()
            .HasForeignKey(f => f.SecondUserId);

        modelBuilder.Entity<Message>()
            .HasOne<Chat>()
            .WithMany()
            .HasForeignKey(m => m.ChatId);
        modelBuilder.Entity<Message>()
            .HasOne<User>()
            .WithMany()
            .HasForeignKey(m => m.UserId);

        modelBuilder.Entity<Domain.Entities.File>()
            .HasOne<Message>()
            .WithMany()
            .HasForeignKey(f => f.MessageId);

        modelBuilder.Entity<Game>()
            .HasOne<User>()
            .WithMany()
            .HasForeignKey(g => g.PublisherId);

        modelBuilder.Entity<Developer>()
            .HasOne<Game>()
            .WithMany()
            .HasForeignKey(d => d.GameId);

        modelBuilder.Entity<Review>()
            .HasOne<Game>()
            .WithMany()
            .HasForeignKey(r => r.GameId);
        modelBuilder.Entity<Review>()
            .HasOne<User>()
            .WithMany()
            .HasForeignKey(r => r.UserId);

        modelBuilder.Entity<GameGenre>()
            .HasKey(gg => gg.Id);
        modelBuilder.Entity<GameGenre>()
            .HasOne<Game>()
            .WithMany()
            .HasForeignKey(gg => gg.GameId);

        modelBuilder.Entity<UserAchievement>()
            .HasOne<User>()
            .WithMany()
            .HasForeignKey(ua => ua.UserId);
        modelBuilder.Entity<UserAchievement>()
            .HasOne<Achievement>()
            .WithMany()
            .HasForeignKey(ua => ua.AchievementId);

        modelBuilder.Entity<Achievement>()
            .HasOne<Game>()
            .WithMany()
            .HasForeignKey(a => a.GameId);

        modelBuilder.Entity<Comment>()
            .HasOne<Forum>()
            .WithMany()
            .HasForeignKey(c => c.ForumId);
        modelBuilder.Entity<Comment>()
            .HasOne<User>()
            .WithMany()
            .HasForeignKey(c => c.UserId);
        modelBuilder.Entity<Comment>()
            .HasOne<Comment>()
            .WithMany()
            .HasForeignKey(c => c.ParentCommentId);

        modelBuilder.Entity<ForumFile>()
            .HasOne<Forum>()
            .WithMany()
            .HasForeignKey(ff => ff.ForumId);
    }
}