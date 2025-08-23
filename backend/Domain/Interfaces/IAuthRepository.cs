using System;
using System.Threading.Tasks;
using Domain.Entities;

namespace Domain.Interfaces;

public interface IAuthRepository
{
    Task<User?> GetUserByEmailAsync(string email);
    Task<User?> GetUserByUsernameAsync(string username);
    Task<User?> GetUserByIdAsync(Guid id);
    Task<bool> UserExistsByEmailAsync(string email);
    Task<bool> UserExistsByUsernameAsync(string username);
    Task<User> CreateUserAsync(User user);
    Task<bool> UpdateUserAsync(User user);
    Task<bool> SavePasswordResetTokenAsync(Guid userId, string token, DateTime expiry);
    Task<Guid?> GetUserIdByResetTokenAsync(string token);
    Task<bool> DeleteResetTokenAsync(string token);
}
