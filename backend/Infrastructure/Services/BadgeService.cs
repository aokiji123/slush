using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.DTOs;
using Application.Interfaces;
using Domain.Entities;
using Domain.Interfaces;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Services;

public class BadgeService : IBadgeService
{
    private readonly IBadgeRepository _badgeRepository;
    private readonly AppDbContext _db;
    private readonly ILibraryService _libraryService;
    private readonly IWishlistService _wishlistService;
    private readonly IFriendshipRepository _friendshipRepository;

    public BadgeService(IBadgeRepository badgeRepository, AppDbContext db, ILibraryService libraryService, IWishlistService wishlistService, IFriendshipRepository friendshipRepository)
    {
        _badgeRepository = badgeRepository;
        _db = db;
        _libraryService = libraryService;
        _wishlistService = wishlistService;
        _friendshipRepository = friendshipRepository;
    }

    public async Task<IEnumerable<BadgeDto>> GetAllBadgesAsync()
    {
        var badges = await _badgeRepository.GetAllAsync();
        
        return badges.Select(b => new BadgeDto
        {
            Id = b.Id,
            Name = b.Name,
            Description = b.Description,
            Icon = b.Icon,
            RequiredValue = b.RequiredValue,
            RequirementType = b.RequirementType,
            CreatedAt = b.CreatedAt
        });
    }

    public async Task<IEnumerable<UserBadgeDto>> GetUserBadgesAsync(Guid userId)
    {
        var userBadges = await _badgeRepository.GetUserBadgesAsync(userId);
        
        return userBadges.Select(ub => new UserBadgeDto
        {
            Id = ub.Id,
            UserId = ub.UserId,
            BadgeId = ub.BadgeId,
            EarnedAt = ub.EarnedAt,
            Badge = new BadgeDto
            {
                Id = ub.Badge.Id,
                Name = ub.Badge.Name,
                Description = ub.Badge.Description,
                Icon = ub.Badge.Icon,
                RequiredValue = ub.Badge.RequiredValue,
                RequirementType = ub.Badge.RequirementType,
                CreatedAt = ub.Badge.CreatedAt
            }
        });
    }

    public async Task CheckAndAwardBadgesAsync(Guid userId)
    {
        // Calculate user statistics directly to avoid circular dependency
        var libraryGames = await _libraryService.GetLibraryGamesAsync(userId);
        var gamesCount = libraryGames.Count();
        var dlcCount = libraryGames.Count(g => g.IsDlc);
        
        var wishlistGames = await _wishlistService.GetWishlistGamesAsync(userId);
        var wishlistCount = wishlistGames.Count();
        
        var friendIds = await _friendshipRepository.GetForUserAsync(userId);
        var friendsCount = friendIds.Count;
        
        var reviewsCount = await _db.Set<Review>().CountAsync(r => r.UserId == userId);
        var postsCount = await _db.Set<Post>().CountAsync(p => p.AuthorId == userId);
        
        // Get all available badges
        var allBadges = await _badgeRepository.GetAllAsync();
        
        foreach (var badge in allBadges)
        {
            // Check if user already has this badge
            if (await _badgeRepository.UserHasBadgeAsync(userId, badge.Id))
                continue;
            
            // Check if user meets the requirements
            var currentValue = GetCurrentValue(gamesCount, dlcCount, wishlistCount, reviewsCount, friendsCount, postsCount, badge.RequirementType);
            if (currentValue >= badge.RequiredValue)
            {
                // Award the badge
                var userBadge = new UserBadge
                {
                    Id = Guid.NewGuid(),
                    UserId = userId,
                    BadgeId = badge.Id,
                    EarnedAt = DateTime.UtcNow
                };
                
                await _badgeRepository.AddUserBadgeAsync(userBadge);
            }
        }
    }

    public async Task<int> AwardBadgesByNicknameAsync(string nickname, int count = 5)
    {
        if (string.IsNullOrWhiteSpace(nickname)) return 0;

        var normalized = nickname.ToLower();
        var user = await _db.Set<User>()
            .FirstOrDefaultAsync(u => u.Nickname != null && u.Nickname.ToLower() == normalized);
        if (user == null) return 0;

        var allBadges = (await _badgeRepository.GetAllAsync()).ToList();
        var existing = await _badgeRepository.GetUserBadgesAsync(user.Id);
        var existingIds = new HashSet<Guid>(existing.Select(ub => ub.BadgeId));

        var toAward = allBadges.Where(b => !existingIds.Contains(b.Id))
            .Take(Math.Max(0, count))
            .ToList();

        var awarded = 0;
        foreach (var badge in toAward)
        {
            var userBadge = new UserBadge
            {
                Id = Guid.NewGuid(),
                UserId = user.Id,
                BadgeId = badge.Id,
                EarnedAt = DateTime.UtcNow
            };
            await _badgeRepository.AddUserBadgeAsync(userBadge);
            awarded++;
        }

        return awarded;
    }

    private static int GetCurrentValue(int gamesCount, int dlcCount, int wishlistCount, int reviewsCount, int friendsCount, int postsCount, string requirementType)
    {
        return requirementType.ToLower() switch
        {
            "games" => gamesCount,
            "dlc" => dlcCount,
            "wishlist" => wishlistCount,
            "reviews" => reviewsCount,
            "friends" => friendsCount,
            "posts" => postsCount,
            "level" => CalculateLevel(gamesCount, reviewsCount, friendsCount, postsCount),
            _ => 0
        };
    }

    private static int CalculateLevel(int gamesCount, int reviewsCount, int friendsCount, int postsCount)
    {
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
}
