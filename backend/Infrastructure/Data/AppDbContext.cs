using Microsoft.EntityFrameworkCore;
using Domain.Entities;
using Infrastructure.Configuration.EntityConfigurations;

namespace Infrastructure.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<User> Users { get; set; }
    public DbSet<Game> Games { get; set; }
    public DbSet<GameCharacteristic> GameCharacteristics { get; set; }
    public DbSet<GameConsoleFeature> GameConsoleFeatures { get; set; }
    public DbSet<UserRole> UserRoles { get; set; }
    public DbSet<Wishlist> Wishlists { get; set; }
    public DbSet<Library> Libraries { get; set; }
    public DbSet<Payment> Payments { get; set; }
    public DbSet<Review> Reviews { get; set; }
    public DbSet<ReviewLike> ReviewLikes { get; set; }
    public DbSet<FriendRequest> FriendRequests { get; set; }
    public DbSet<Friendship> Friendships { get; set; }
    public DbSet<UserBlock> UserBlocks { get; set; }
    public DbSet<Post> Posts { get; set; }
    public DbSet<Media> Media { get; set; }
    public DbSet<Comment> Comments { get; set; }
    public DbSet<PostLike> PostLikes { get; set; }
    public DbSet<CommentLike> CommentLikes { get; set; }
    public DbSet<Notifications> Notifications { get; set; }
    public DbSet<ProfileComment> ProfileComments { get; set; }
    public DbSet<Badge> Badges { get; set; }
    public DbSet<UserBadge> UserBadges { get; set; }
    public DbSet<ChatMessage> ChatMessages { get; set; }
    public DbSet<ChatMessageAttachment> ChatMessageAttachments { get; set; }
    public DbSet<UserReport> UserReports { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        
        // Apply entity configurations
        modelBuilder.ApplyConfiguration(new UserConfiguration());
        modelBuilder.ApplyConfiguration(new GameConfiguration());
        modelBuilder.ApplyConfiguration(new ReviewConfiguration());
        modelBuilder.ApplyConfiguration(new WishlistConfiguration());
        modelBuilder.ApplyConfiguration(new LibraryConfiguration());
        modelBuilder.ApplyConfiguration(new PaymentConfiguration());
        modelBuilder.ApplyConfiguration(new FriendRequestConfiguration());
        modelBuilder.ApplyConfiguration(new FriendshipConfiguration());
        modelBuilder.ApplyConfiguration(new ChatMessageConfiguration());
        modelBuilder.ApplyConfiguration(new ChatMessageAttachmentConfiguration());
        modelBuilder.ApplyConfiguration(new UserReportConfiguration());
        
        // UserRole configuration
        modelBuilder.Entity<UserRole>()
            .HasKey(ur => new { ur.UserId, ur.RoleId });

        // Configure Notifications relationship
        modelBuilder.Entity<Notifications>()
            .HasOne(n => n.User)
            .WithOne()
            .HasForeignKey<Notifications>(n => n.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        // ReviewLike configuration
        modelBuilder.Entity<ReviewLike>()
            .HasKey(rl => new { rl.UserId, rl.ReviewId });

        modelBuilder.Entity<ReviewLike>()
            .HasOne(rl => rl.User)
            .WithMany()
            .HasForeignKey(rl => rl.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<ReviewLike>()
            .HasOne(rl => rl.Review)
            .WithMany()
            .HasForeignKey(rl => rl.ReviewId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<ReviewLike>()
            .HasIndex(rl => rl.ReviewId);


        // UserBlock configuration
        modelBuilder.Entity<UserBlock>()
            .HasKey(ub => ub.Id);

        modelBuilder.Entity<UserBlock>()
            .HasIndex(ub => new { ub.BlockerId, ub.BlockedUserId })
            .IsUnique();

        modelBuilder.Entity<UserBlock>()
            .HasOne(ub => ub.Blocker)
            .WithMany()
            .HasForeignKey(ub => ub.BlockerId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<UserBlock>()
            .HasOne(ub => ub.BlockedUser)
            .WithMany()
            .HasForeignKey(ub => ub.BlockedUserId)
            .OnDelete(DeleteBehavior.Cascade);

        // Community: Posts
        modelBuilder.Entity<Post>()
            .HasKey(p => p.Id);
        modelBuilder.Entity<Post>()
            .HasIndex(p => p.GameId);
        modelBuilder.Entity<Post>()
            .Property(p => p.Title)
            .HasMaxLength(200);
        modelBuilder.Entity<Post>()
            .HasMany(p => p.Media)
            .WithOne(m => m.Post!)
            .HasForeignKey(m => m.PostId)
            .OnDelete(DeleteBehavior.Cascade);
        modelBuilder.Entity<Post>()
            .HasMany(p => p.Comments)
            .WithOne(c => c.Post!)
            .HasForeignKey(c => c.PostId)
            .OnDelete(DeleteBehavior.Cascade);
        modelBuilder.Entity<Post>()
            .HasMany(p => p.Likes)
            .WithOne(l => l.Post!)
            .HasForeignKey(l => l.PostId)
            .OnDelete(DeleteBehavior.Cascade);
        modelBuilder.Entity<Post>()
            .HasOne(p => p.Author)
            .WithMany()
            .HasForeignKey(p => p.AuthorId)
            .OnDelete(DeleteBehavior.Restrict);

        // Community: Media
        modelBuilder.Entity<Media>()
            .HasKey(m => m.Id);

        // Community: Comments
        modelBuilder.Entity<Comment>()
            .HasKey(c => c.Id);
        modelBuilder.Entity<Comment>()
            .HasOne(c => c.ParentComment)
            .WithMany(c => c.Replies)
            .HasForeignKey(c => c.ParentCommentId)
            .OnDelete(DeleteBehavior.Cascade);
        modelBuilder.Entity<Comment>()
            .HasOne(c => c.Author)
            .WithMany()
            .HasForeignKey(c => c.AuthorId)
            .OnDelete(DeleteBehavior.Restrict);

        // Community: Likes composite keys
        modelBuilder.Entity<PostLike>()
            .HasKey(l => new { l.UserId, l.PostId });
        modelBuilder.Entity<CommentLike>()
            .HasKey(l => new { l.UserId, l.CommentId });

        // ProfileComment configuration
        modelBuilder.Entity<ProfileComment>()
            .HasKey(pc => pc.Id);
        
        modelBuilder.Entity<ProfileComment>()
            .HasOne(pc => pc.ProfileUser)
            .WithMany()
            .HasForeignKey(pc => pc.ProfileUserId)
            .OnDelete(DeleteBehavior.Cascade);
            
        modelBuilder.Entity<ProfileComment>()
            .HasOne(pc => pc.Author)
            .WithMany()
            .HasForeignKey(pc => pc.AuthorId)
            .OnDelete(DeleteBehavior.Restrict);
            
        modelBuilder.Entity<ProfileComment>()
            .HasIndex(pc => pc.ProfileUserId);
            
        modelBuilder.Entity<ProfileComment>()
            .Property(pc => pc.Content)
            .HasMaxLength(1000);

        // Badge configuration
        modelBuilder.Entity<Badge>()
            .HasKey(b => b.Id);
            
        modelBuilder.Entity<Badge>()
            .Property(b => b.Name)
            .HasMaxLength(100)
            .IsRequired();
            
        modelBuilder.Entity<Badge>()
            .Property(b => b.Description)
            .HasMaxLength(500)
            .IsRequired();
            
        modelBuilder.Entity<Badge>()
            .Property(b => b.Icon)
            .HasMaxLength(200)
            .IsRequired();
            
        modelBuilder.Entity<Badge>()
            .Property(b => b.RequirementType)
            .HasMaxLength(50)
            .IsRequired();

        // UserBadge configuration
        modelBuilder.Entity<UserBadge>()
            .HasKey(ub => ub.Id);
            
        modelBuilder.Entity<UserBadge>()
            .HasOne(ub => ub.User)
            .WithMany()
            .HasForeignKey(ub => ub.UserId)
            .OnDelete(DeleteBehavior.Cascade);
            
        modelBuilder.Entity<UserBadge>()
            .HasOne(ub => ub.Badge)
            .WithMany()
            .HasForeignKey(ub => ub.BadgeId)
            .OnDelete(DeleteBehavior.Cascade);
            
        // Prevent duplicate user badges
        modelBuilder.Entity<UserBadge>()
            .HasIndex(ub => new { ub.UserId, ub.BadgeId })
            .IsUnique();
    }
}