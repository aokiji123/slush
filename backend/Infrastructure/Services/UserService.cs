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

namespace Infrastructure.Services;

public class UserService : IUserService
{
    private readonly AppDbContext _db;
    private readonly IStorageService _storageService;
    private readonly IFriendshipRepository _friendshipRepository;

    public UserService(AppDbContext db, IStorageService storageService, IFriendshipRepository friendshipRepository)
    {
        _db = db;
        _storageService = storageService;
        _friendshipRepository = friendshipRepository;
    }

    public async Task<UserDto?> GetUserAsync(Guid id)
    {
        var user = await _db.Set<User>().FirstOrDefaultAsync(u => u.Id == id);
        if (user == null) return null;

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
            IsOnline = user.IsOnline
        };
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

        user.Nickname = dto.Nickname;
        user.Email = dto.Email;
        user.Bio = dto.Bio;
        user.Avatar = dto.Avatar;
        user.Banner = dto.Banner;
        user.Lang = dto.Lang;

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

        if (!string.Equals(user.Nickname, dto.Nickname, StringComparison.Ordinal))
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

        return new FileUploadDto
        {
            Url = result.Url,
            FileName = result.FileName,
            FileSize = result.FileSize,
            ContentType = result.ContentType,
            FilePath = result.FilePath
        };
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

        return new FileUploadDto
        {
            Url = result.Url,
            FileName = result.FileName,
            FileSize = result.FileSize,
            ContentType = result.ContentType,
            FilePath = result.FilePath
        };
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
}


