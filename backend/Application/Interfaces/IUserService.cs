using System;
using System.Threading.Tasks;
using Application.DTOs;

namespace Application.Interfaces;

public interface IUserService
{
    Task<UserDto?> GetUserAsync(Guid id);
    Task<UserDto?> UpdateUserAsync(Guid id, UserUpdateDto dto);
    Task<bool> AddBalanceAsync(Guid id, decimal amountToAdd);
    Task<bool> DeleteUserAsync(UserDeleteDto dto);
    Task<bool> UpdateNotificationsAsync(NotificationsDto dto);
}
