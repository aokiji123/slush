using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<User> Users { get; set; } = null!;
    public DbSet<Game> Games { get; set; } = null!;
    public DbSet<Developer> Developers { get; set; } = null!;
    public DbSet<Publisher> Publishers { get; set; } = null!;
    public DbSet<Genre> Genres { get; set; } = null!;
    public DbSet<Platform> Platforms { get; set; } = null!;
    public DbSet<GameGenre> GameGenres { get; set; } = null!;
    public DbSet<GamePlatform> GamePlatforms { get; set; } = null!;
    public DbSet<GameImage> GameImages { get; set; } = null!;
    public DbSet<GameSet> GameSets { get; set; } = null!;
    public DbSet<Dlc> Dlcs { get; set; } = null!;
    public DbSet<BannerGame> BannerGames { get; set; } = null!;
    public DbSet<Achievement> Achievements { get; set; } = null!;
    public DbSet<UserAchievement> UserAchievements { get; set; } = null!;
    public DbSet<Review> Reviews { get; set; } = null!;
    public DbSet<Comment> Comments { get; set; } = null!;
    public DbSet<Forum> Forums { get; set; } = null!;
    public DbSet<ForumFile> ForumFiles { get; set; } = null!;
    public DbSet<Chat> Chats { get; set; } = null!;
    public DbSet<ChatType> ChatTypes { get; set; } = null!;
    public DbSet<ChatParticipant> ChatParticipants { get; set; } = null!;
    public DbSet<Message> Messages { get; set; } = null!;
    public DbSet<GameFile> Files { get; set; } = null!;
    public DbSet<FileType> FileTypes { get; set; } = null!;
    public DbSet<Friendship> Friendships { get; set; } = null!;
    public DbSet<UserWishlist> UserWishlists { get; set; } = null!;
    public DbSet<UserOwnedGame> UserOwnedGames { get; set; } = null!;
    public DbSet<PasswordResetToken> PasswordResetTokens { get; set; } = null!;
    
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        
        // User configuration
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Username).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Email).IsRequired().HasMaxLength(255);
            entity.HasIndex(e => e.Email).IsUnique();
        });

        // ChatParticipant configuration
        modelBuilder.Entity<ChatParticipant>()
            .HasKey(cp => cp.Id);
        modelBuilder.Entity<ChatParticipant>()
            .HasOne(cp => cp.Chat)
            .WithMany(c => c.ChatParticipants)
            .HasForeignKey(cp => cp.ChatId);
        modelBuilder.Entity<ChatParticipant>()
            .HasOne(cp => cp.User)
            .WithMany(u => u.ChatParticipants)
            .HasForeignKey(cp => cp.UserId);

        // Friendship configuration
        modelBuilder.Entity<Friendship>()
            .HasKey(f => f.Id);
        modelBuilder.Entity<Friendship>()
            .HasOne(f => f.FirstUser)
            .WithMany(u => u.FirstUserFriendships)
            .HasForeignKey(f => f.FirstUserId)
            .OnDelete(DeleteBehavior.Restrict);
        modelBuilder.Entity<Friendship>()
            .HasOne(f => f.SecondUser)
            .WithMany(u => u.SecondUserFriendships)
            .HasForeignKey(f => f.SecondUserId)
            .OnDelete(DeleteBehavior.Restrict);

        // Message configuration
        modelBuilder.Entity<Message>()
            .HasOne(m => m.Chat)
            .WithMany(c => c.Messages)
            .HasForeignKey(m => m.ChatId);
        modelBuilder.Entity<Message>()
            .HasOne(m => m.User)
            .WithMany(u => u.Messages)
            .HasForeignKey(m => m.UserId);

        // GameFile configuration
        modelBuilder.Entity<GameFile>()
            .HasOne(f => f.Message)
            .WithMany(m => m.Files)
            .HasForeignKey(f => f.MessageId);

        // Game configuration
        modelBuilder.Entity<Game>()
            .HasOne(g => g.Publisher)
            .WithMany(p => p.Games)
            .HasForeignKey(g => g.PublisherId);

        modelBuilder.Entity<Game>()
            .HasOne(g => g.Developer)
            .WithMany(d => d.Games)
            .HasForeignKey(g => g.DeveloperId);

        // Review configuration
        modelBuilder.Entity<Review>()
            .HasOne(r => r.Game)
            .WithMany(g => g.Reviews)
            .HasForeignKey(r => r.GameId);
        modelBuilder.Entity<Review>()
            .HasOne(r => r.User)
            .WithMany(u => u.Reviews)
            .HasForeignKey(r => r.UserId);

        // GameGenre configuration
        modelBuilder.Entity<GameGenre>()
            .HasKey(gg => gg.Id);
        modelBuilder.Entity<GameGenre>()
            .HasOne(gg => gg.Game)
            .WithMany(g => g.GameGenres)
            .HasForeignKey(gg => gg.GameId);

        // UserAchievement configuration
        modelBuilder.Entity<UserAchievement>()
            .HasOne(ua => ua.User)
            .WithMany(u => u.UserAchievements)
            .HasForeignKey(ua => ua.UserId);
        modelBuilder.Entity<UserAchievement>()
            .HasOne(ua => ua.Achievement)
            .WithMany(a => a.UserAchievements)
            .HasForeignKey(ua => ua.AchievementId);

        // Achievement configuration
        modelBuilder.Entity<Achievement>()
            .HasOne(a => a.Game)
            .WithMany(g => g.Achievements)
            .HasForeignKey(a => a.GameId);

        // Comment configuration
        modelBuilder.Entity<Comment>()
            .HasOne(c => c.Game)
            .WithMany(g => g.Comments)
            .HasForeignKey(c => c.GameId);
        modelBuilder.Entity<Comment>()
            .HasOne(c => c.User)
            .WithMany()
            .HasForeignKey(c => c.UserId);
        modelBuilder.Entity<Comment>()
            .HasOne(c => c.ParentComment)
            .WithMany(c => c.Replies)
            .HasForeignKey(c => c.ParentCommentId);

        // ForumFile configuration
        modelBuilder.Entity<ForumFile>()
            .HasOne(ff => ff.Forum)
            .WithMany(f => f.ForumFiles)
            .HasForeignKey(ff => ff.ForumId);

        // GameGenre relationships
        modelBuilder.Entity<GameGenre>()
            .HasOne(gg => gg.Genre)
            .WithMany(g => g.GameGenres)
            .HasForeignKey(gg => gg.GenreId);

        // GamePlatform configuration
        modelBuilder.Entity<GamePlatform>()
            .HasOne(gp => gp.Platform)
            .WithMany(p => p.GamePlatforms)
            .HasForeignKey(gp => gp.PlatformId);
        modelBuilder.Entity<GamePlatform>()
            .HasOne(gp => gp.Game)
            .WithMany(g => g.GamePlatforms)
            .HasForeignKey(gp => gp.GameId);

        // GameImage configuration
        modelBuilder.Entity<GameImage>()
            .HasOne(gi => gi.Game)
            .WithMany(g => g.GameImages)
            .HasForeignKey(gi => gi.GameId);

        // Dlc configuration
        modelBuilder.Entity<Dlc>()
            .HasOne(d => d.Game)
            .WithMany(g => g.Dlcs)
            .HasForeignKey(d => d.GameId);

        // GameSet configuration
        modelBuilder.Entity<GameSet>()
            .HasOne(gs => gs.User)
            .WithMany(u => u.GameSets)
            .HasForeignKey(gs => gs.UserId);
        modelBuilder.Entity<GameSet>()
            .HasOne(gs => gs.Game)
            .WithMany(g => g.GameSets)
            .HasForeignKey(gs => gs.GameId);

        // FileType configuration
        modelBuilder.Entity<GameFile>()
            .HasOne(f => f.FileType)
            .WithMany(ft => ft.Files)
            .HasForeignKey(f => f.FileTypeId);

        // Chat configuration
        modelBuilder.Entity<Chat>()
            .HasOne(c => c.ChatType)
            .WithMany(ct => ct.Chats)
            .HasForeignKey(c => c.ChatTypeId);

        // BannerGame configuration
        modelBuilder.Entity<BannerGame>()
            .HasKey(bg => bg.Id);

        // UserWishlist configuration
        modelBuilder.Entity<UserWishlist>()
            .HasOne(uw => uw.User)
            .WithMany(u => u.Wishlists)
            .HasForeignKey(uw => uw.UserId);

        modelBuilder.Entity<UserWishlist>()
            .HasOne(uw => uw.Game)
            .WithMany(g => g.UserWishlists)
            .HasForeignKey(uw => uw.GameId);

        // UserOwnedGame configuration
        modelBuilder.Entity<UserOwnedGame>()
            .HasOne(uog => uog.User)
            .WithMany(u => u.OwnedGames)
            .HasForeignKey(uog => uog.UserId);

        modelBuilder.Entity<UserOwnedGame>()
            .HasOne(uog => uog.Game)
            .WithMany(g => g.UserOwnedGames)
            .HasForeignKey(uog => uog.GameId);

        // PasswordResetToken configuration
        modelBuilder.Entity<PasswordResetToken>()
            .HasKey(prt => prt.Id);
        modelBuilder.Entity<PasswordResetToken>()
            .HasOne(prt => prt.User)
            .WithMany()
            .HasForeignKey(prt => prt.UserId)
            .OnDelete(DeleteBehavior.Cascade);
        modelBuilder.Entity<PasswordResetToken>()
            .HasIndex(prt => prt.Token)
            .IsUnique();
        modelBuilder.Entity<PasswordResetToken>()
            .Property(prt => prt.Token)
            .IsRequired()
            .HasMaxLength(255);
    }
}
