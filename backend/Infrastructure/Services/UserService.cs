using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.DTOs;
using Application.Interfaces;
using Domain.Entities;
using Domain.Interfaces;
using Infrastructure.Data;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using AutoMapper;

namespace Infrastructure.Services;

public class UserService : IUserService
{
    private readonly AppDbContext _db;
    private readonly IStorageService _storageService;
    private readonly IFriendshipRepository _friendshipRepository;
    private readonly ILibraryService _libraryService;
    private readonly IWishlistService _wishlistService;
    private readonly IReviewService _reviewService;
    private readonly ICommunityService _communityService;
    private readonly IMapper _mapper;
    private readonly UserManager<User> _userManager;

    public UserService(AppDbContext db, IStorageService storageService, IFriendshipRepository friendshipRepository, 
        ILibraryService libraryService, IWishlistService wishlistService, IReviewService reviewService, ICommunityService communityService, IMapper mapper, UserManager<User> userManager)
    {
        _db = db;
        _storageService = storageService;
        _friendshipRepository = friendshipRepository;
        _libraryService = libraryService;
        _wishlistService = wishlistService;
        _reviewService = reviewService;
        _communityService = communityService;
        _mapper = mapper;
        _userManager = userManager;
    }

    public async Task<UserDto?> GetUserAsync(Guid id)
    {
        var user = await _db.Set<User>().FirstOrDefaultAsync(u => u.Id == id);
        if (user == null) return null;

        // Calculate level for this user
        var statistics = await GetUserStatisticsAsync(id);
        
        var userDto = _mapper.Map<UserDto>(user);
        userDto.Level = statistics.Level;
        return userDto;
    }

    public async Task<UserDto?> UpdateUserAsync(Guid id, UserUpdateDto dto)
    {
        var user = await _db.Set<User>().FirstOrDefaultAsync(u => u.Id == id);
        if (user == null) return null;

        // If updating avatar and it's different from current, delete old avatar
        if (!string.IsNullOrEmpty(dto.Avatar) && dto.Avatar != user.Avatar && !string.IsNullOrEmpty(user.Avatar))
        {
            // Extract file path from URL for deletion
            var oldFilePath = ExtractFilePathFromUrl(user.Avatar);
            if (!string.IsNullOrEmpty(oldFilePath))
            {
                await _storageService.DeleteFileAsync(oldFilePath);
            }
        }

        _mapper.Map(dto, user);

        await _db.SaveChangesAsync();
        return await GetUserAsync(id);
    }

    public async Task<bool> AddBalanceAsync(Guid id, decimal amountToAdd)
    {
        var user = await _db.Set<User>().FirstOrDefaultAsync(u => u.Id == id);
        if (user == null) return false;

        user.Balance += amountToAdd;
        await _db.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteUserAsync(UserDeleteDto dto)
    {
        var user = await _db.Set<User>().FirstOrDefaultAsync(u => u.Id == dto.UserId);
        if (user == null) return false;

        // Verify nickname matches
        if (!string.Equals(user.Nickname, dto.Nickname, StringComparison.Ordinal))
        {
            return false;
        }

        // Verify password is correct
        var isPasswordValid = await _userManager.CheckPasswordAsync(user, dto.Password);
        if (!isPasswordValid)
        {
            return false;
        }

        _db.Remove(user);
        await _db.SaveChangesAsync();
        return true;
    }

    public async Task<FileUploadDto> UploadAvatarAsync(Guid userId, IFormFile file)
    {
        // Validate file
        var validation = _storageService.ValidateAvatarFile(file);
        if (!validation.IsValid)
        {
            throw new ArgumentException(validation.ErrorMessage);
        }

        // Get current user to check for existing avatar
        var user = await _db.Set<User>().FirstOrDefaultAsync(u => u.Id == userId);
        if (user == null)
        {
            throw new ArgumentException("User not found");
        }

        // Delete old avatar if it exists
        if (!string.IsNullOrEmpty(user.Avatar))
        {
            var oldFilePath = ExtractFilePathFromUrl(user.Avatar);
            if (!string.IsNullOrEmpty(oldFilePath))
            {
                await _storageService.DeleteFileAsync(oldFilePath);
            }
        }

        // Upload new avatar
        var folder = $"avatars/{userId}";
        var result = await _storageService.UploadFileAsync(file, folder);

        // Update user with new avatar URL
        user.Avatar = result.Url;
        await _db.SaveChangesAsync();

        return _mapper.Map<FileUploadDto>(result);
    }

    public async Task<FileUploadDto> UploadBannerAsync(Guid userId, IFormFile file)
    {
        // Validate file
        var validation = _storageService.ValidateBannerFile(file);
        if (!validation.IsValid)
        {
            throw new ArgumentException(validation.ErrorMessage);
        }

        // Get current user to check for existing banner
        var user = await _db.Set<User>().FirstOrDefaultAsync(u => u.Id == userId);
        if (user == null)
        {
            throw new ArgumentException("User not found");
        }

        // Delete old banner if it exists
        if (!string.IsNullOrEmpty(user.Banner))
        {
            var oldFilePath = ExtractFilePathFromUrl(user.Banner);
            if (!string.IsNullOrEmpty(oldFilePath))
            {
                await _storageService.DeleteFileAsync(oldFilePath);
            }
        }

        // Upload new banner
        var folder = $"banners/{userId}";
        var result = await _storageService.UploadFileAsync(file, folder);

        // Update user with new banner URL
        user.Banner = result.Url;
        await _db.SaveChangesAsync();

        return _mapper.Map<FileUploadDto>(result);
    }

    private static string? ExtractFilePathFromUrl(string url)
    {
        if (string.IsNullOrEmpty(url)) return null;
        
        try
        {
            var uri = new Uri(url);
            var pathSegments = uri.AbsolutePath.Split('/', StringSplitOptions.RemoveEmptyEntries);
            
            // Supabase storage URLs typically have format: /storage/v1/object/public/bucket/path
            // We need to extract the path after the bucket name
            var bucketIndex = Array.IndexOf(pathSegments, "slush-storage");
            if (bucketIndex >= 0 && bucketIndex + 1 < pathSegments.Length)
            {
                return string.Join("/", pathSegments.Skip(bucketIndex + 1));
            }
        }
        catch
        {
            // If URL parsing fails, return null
        }
        
        return null;
    }

    public async Task<bool> UpdateNotificationsAsync(NotificationsDto dto)
    {
        var notification = await _db.Set<Notifications>()
            .FirstOrDefaultAsync(n => n.UserId == dto.UserId);
        
        if (notification == null)
        {
            notification = new Notifications { UserId = dto.UserId };
            _db.Set<Notifications>().Add(notification);
        }
        
        notification.BigSale = dto.BigSale;
        notification.WishlistDiscount = dto.WishlistDiscount;
        notification.NewProfileComment = dto.NewProfileComment;
        notification.NewFriendRequest = dto.NewFriendRequest;
        notification.FriendRequestAccepted = dto.FriendRequestAccepted;
        notification.FriendRequestDeclined = dto.FriendRequestDeclined;
        
        await _db.SaveChangesAsync();
        return true;
    }

    public async Task<NotificationsDto?> GetNotificationsAsync(Guid userId)
    {
        var notification = await _db.Set<Notifications>()
            .FirstOrDefaultAsync(n => n.UserId == userId);
        
        if (notification == null)
        {
            // Return default settings (all true)
            return new NotificationsDto
            {
                UserId = userId,
                BigSale = true,
                WishlistDiscount = true,
                NewProfileComment = true,
                NewFriendRequest = true,
                FriendRequestAccepted = true,
                FriendRequestDeclined = true
            };
        }
        
        return new NotificationsDto
        {
            UserId = notification.UserId,
            BigSale = notification.BigSale,
            WishlistDiscount = notification.WishlistDiscount,
            NewProfileComment = notification.NewProfileComment,
            NewFriendRequest = notification.NewFriendRequest,
            FriendRequestAccepted = notification.FriendRequestAccepted,
            FriendRequestDeclined = notification.FriendRequestDeclined
        };
    }

    public async Task UpdateOnlineStatusAsync(Guid userId, bool isOnline)
    {
        var user = await _db.Set<User>().FirstOrDefaultAsync(u => u.Id == userId);
        if (user != null)
        {
            user.IsOnline = isOnline;
            if (isOnline)
            {
                user.LastSeenAt = DateTime.UtcNow;
            }
            await _db.SaveChangesAsync();
        }
    }

    public async Task UpdateLastSeenAsync(Guid userId)
    {
        var user = await _db.Set<User>().FirstOrDefaultAsync(u => u.Id == userId);
        if (user != null)
        {
            user.LastSeenAt = DateTime.UtcNow;
            // Consider user online if last seen within 5 minutes
            user.IsOnline = user.LastSeenAt > DateTime.UtcNow.AddMinutes(-5);
            await _db.SaveChangesAsync();
        }
    }

    public async Task<IReadOnlyList<Guid>> GetOnlineFriendIdsAsync(Guid userId)
    {
        var friendships = await _friendshipRepository.GetForUserAsync(userId);
        var friendIds = friendships.Select(f => f.User1Id == userId ? f.User2Id : f.User1Id).ToList();
        
        var onlineFriends = await _db.Set<User>()
            .Where(u => friendIds.Contains(u.Id) && u.IsOnline)
            .Select(u => u.Id)
            .ToListAsync();

        return onlineFriends;
    }

    public async Task<IReadOnlyList<UserDto>> SearchUsersByNicknameAsync(string query, int limit = 20)
    {
        if (string.IsNullOrWhiteSpace(query))
        {
            return new List<UserDto>();
        }

        var users = await _db.Set<User>()
            .Where(u => (u.Nickname != null && u.Nickname.ToLower().Contains(query.ToLower())) ||
                       (u.UserName != null && u.UserName.ToLower().Contains(query.ToLower())))
            .Take(limit)
            .Select(u => new UserDto
            {
                Id = u.Id,
                Nickname = !string.IsNullOrEmpty(u.Nickname) ? u.Nickname : (u.UserName ?? string.Empty),
                Email = u.Email ?? string.Empty,
                Bio = u.Bio,
                Lang = u.Lang,
                Avatar = u.Avatar,
                Banner = u.Banner,
                Balance = (double)u.Balance,
                LastSeenAt = u.LastSeenAt,
                IsOnline = u.IsOnline
            })
            .ToListAsync();

        return users;
    }

    public async Task<UserDto?> GetUserByNicknameAsync(string nickname)
    {
        if (string.IsNullOrWhiteSpace(nickname))
        {
            return null;
        }

        var user = await _db.Set<User>()
            .FirstOrDefaultAsync(u => u.Nickname != null && u.Nickname.ToLower() == nickname.ToLower());

        if (user == null) return null;

        // Calculate level for this user
        var statistics = await GetUserStatisticsAsync(user.Id);

        return new UserDto
        {
            Id = user.Id,
            Nickname = user.Nickname ?? string.Empty,
            Email = user.Email ?? string.Empty,
            Bio = user.Bio,
            Lang = user.Lang,
            Avatar = user.Avatar,
            Banner = user.Banner,
            Balance = (double)user.Balance,
            LastSeenAt = user.LastSeenAt,
            IsOnline = user.IsOnline,
            Level = statistics.Level
        };
    }

    public async Task<ProfileStatisticsDto> GetUserStatisticsAsync(Guid userId)
    {
        // Get games count (including DLC)
        var libraryGames = await _libraryService.GetLibraryGamesAsync(userId);
        var gamesCount = libraryGames.Count();
        var dlcCount = libraryGames.Count(g => g.IsDlc);

        // Get wishlist count
        var wishlistGames = await _wishlistService.GetWishlistGamesAsync(userId);
        var wishlistCount = wishlistGames.Count();

        // Get friends count
        var friendIds = await _friendshipRepository.GetForUserAsync(userId);
        var friendsCount = friendIds.Count;

        // Get reviews count
        var reviewsCount = await _db.Set<Review>()
            .CountAsync(r => r.UserId == userId);

        // Get posts count (community posts)
        var postsCount = await _db.Set<Post>()
            .CountAsync(p => p.AuthorId == userId);

        // Get badges count (will be calculated separately to avoid circular dependency)
        var badgesCount = 0;

        // Calculate level based on activity
        var level = CalculateUserLevel(gamesCount, reviewsCount, friendsCount, postsCount);
        
        // Calculate experience points
        var experience = gamesCount + (reviewsCount * 2) + (friendsCount * 3) + (postsCount * 2);
        
        // Calculate next level experience requirement
        var nextLevelExperience = CalculateNextLevelExperience(level);

        return new ProfileStatisticsDto
        {
            GamesCount = gamesCount,
            DlcCount = dlcCount,
            WishlistCount = wishlistCount,
            ReviewsCount = reviewsCount,
            FriendsCount = friendsCount,
            BadgesCount = badgesCount,
            PostsCount = postsCount,
            Level = level,
            Experience = experience,
            NextLevelExperience = nextLevelExperience
        };
    }

    private static int CalculateUserLevel(int gamesCount, int reviewsCount, int friendsCount, int postsCount)
    {
        // Simple level calculation based on activity
        // Level 1: 0-9 points
        // Level 2: 10-24 points
        // Level 3: 25-49 points
        // Level 4: 50-99 points
        // Level 5: 100+ points
        
        var points = gamesCount + (reviewsCount * 2) + (friendsCount * 3) + (postsCount * 2);
        
        return points switch
        {
            < 10 => 1,
            < 25 => 2,
            < 50 => 3,
            < 100 => 4,
            _ => Math.Min(5 + (points - 100) / 50, 50) // Cap at level 50
        };
    }

    private static int CalculateNextLevelExperience(int currentLevel)
    {
        return currentLevel switch
        {
            1 => 10,
            2 => 25,
            3 => 50,
            4 => 100,
            _ => 100 + (currentLevel - 4) * 50 // For levels 5+, increase by 50 each level
        };
    }

    public async Task<IReadOnlyList<ReviewDto>> GetUserReviewsAsync(Guid userId)
    {
        var reviews = await _db.Set<Review>()
            .Include(r => r.Game)
            .Include(r => r.User)
            .Where(r => r.UserId == userId)
            .OrderByDescending(r => r.CreatedAt)
            .Select(r => new ReviewDto
            {
                Id = r.Id,
                GameId = r.GameId,
                UserId = r.UserId,
                Content = r.Content,
                Rating = r.Rating,
                Username = r.User.Nickname ?? string.Empty,
                UserAvatar = r.User.Avatar ?? string.Empty,
                Likes = r.Likes,
                IsLikedByCurrentUser = false, // Will be set by the calling code if needed
                CreatedAt = r.CreatedAt
            })
            .ToListAsync();

        return reviews;
    }

    public async Task<IReadOnlyList<PostDto>> GetUserPostsAsync(Guid userId)
    {
        var posts = await _db.Set<Post>()
            .Include(p => p.Author)
            .Include(p => p.Media)
            .Include(p => p.Likes)
            .Include(p => p.Comments)
            .Where(p => p.AuthorId == userId)
            .OrderByDescending(p => p.CreatedAt)
            .Select(p => new PostDto
            {
                Id = p.Id,
                Title = p.Title,
                Content = p.Content,
                Type = p.Type,
                AuthorId = p.AuthorId,
                AuthorUsername = p.Author != null ? p.Author.Nickname : string.Empty,
                AuthorAvatar = p.Author != null ? p.Author.Avatar : string.Empty,
                CreatedAt = p.CreatedAt,
                UpdatedAt = p.UpdatedAt,
                GameId = p.GameId,
                LikesCount = p.Likes.Count,
                CommentsCount = p.Comments.Count,
                Media = p.Media.Select(m => new MediaDto
                {
                    Id = m.Id,
                    File = m.File,
                    IsCover = m.IsCover,
                    Type = m.Type
                }).ToList()
            })
            .ToListAsync();

        return posts;
    }
}


