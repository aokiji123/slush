using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Application.DTOs;
using Microsoft.AspNetCore.Http;

namespace Application.Interfaces;

public interface IUserService
{
    Task<UserDto?> GetUserAsync(Guid id);
    Task<UserDto?> UpdateUserAsync(Guid id, UserUpdateDto dto);
    Task<bool> AddBalanceAsync(Guid id, decimal amountToAdd);
    Task<bool> DeleteUserAsync(UserDeleteDto dto);
    Task<bool> UpdateNotificationsAsync(NotificationsDto dto);
    Task<NotificationsDto?> GetNotificationsAsync(Guid userId);
    Task<FileUploadDto> UploadAvatarAsync(Guid userId, IFormFile file);
    Task<FileUploadDto> UploadBannerAsync(Guid userId, IFormFile file);
    
    // Online status methods
    Task UpdateOnlineStatusAsync(Guid userId, bool isOnline);
    Task UpdateLastSeenAsync(Guid userId);
    Task<IReadOnlyList<Guid>> GetOnlineFriendIdsAsync(Guid userId);
    
    // Search methods
    Task<IReadOnlyList<UserDto>> SearchUsersByNicknameAsync(string query, int limit = 20);
}
