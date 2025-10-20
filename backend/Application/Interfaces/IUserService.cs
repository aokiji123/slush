using System;
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
    Task<FileUploadDto> UploadAvatarAsync(Guid userId, IFormFile file);
}
