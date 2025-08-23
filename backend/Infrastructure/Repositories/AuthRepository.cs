using Domain.Entities;
using Domain.Interfaces;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

public class AuthRepository : IAuthRepository
{
    private readonly AppDbContext _context;

    public AuthRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<User?> GetUserByEmailAsync(string email)
    {
        return await _context.Users
            .FirstOrDefaultAsync(u => u.Email == email);
    }

    public async Task<User?> GetUserByUsernameAsync(string username)
    {
        return await _context.Users
            .FirstOrDefaultAsync(u => u.Username == username);
    }

    public async Task<User?> GetUserByIdAsync(Guid id)
    {
        return await _context.Users
            .FirstOrDefaultAsync(u => u.Id == id);
    }

    public async Task<bool> UserExistsByEmailAsync(string email)
    {
        return await _context.Users
            .AnyAsync(u => u.Email == email);
    }

    public async Task<bool> UserExistsByUsernameAsync(string username)
    {
        return await _context.Users
            .AnyAsync(u => u.Username == username);
    }

    public async Task<User> CreateUserAsync(User user)
    {
        _context.Users.Add(user);
        await _context.SaveChangesAsync();
        return user;
    }

    public async Task<bool> UpdateUserAsync(User user)
    {
        _context.Users.Update(user);
        var result = await _context.SaveChangesAsync();
        return result > 0;
    }

    public async Task<bool> SavePasswordResetTokenAsync(Guid userId, string token, DateTime expiry)
    {
        // Delete any existing tokens for this user
        var existingTokens = await _context.PasswordResetTokens
            .Where(prt => prt.UserId == userId && !prt.IsUsed)
            .ToListAsync();
        
        _context.PasswordResetTokens.RemoveRange(existingTokens);

        // Create new token
        var resetToken = new PasswordResetToken
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            Token = token,
            ExpiryDate = expiry,
            CreatedAt = DateTime.UtcNow,
            IsUsed = false
        };

        _context.PasswordResetTokens.Add(resetToken);
        var result = await _context.SaveChangesAsync();
        return result > 0;
    }

    public async Task<Guid?> GetUserIdByResetTokenAsync(string token)
    {
        var resetToken = await _context.PasswordResetTokens
            .FirstOrDefaultAsync(prt => prt.Token == token && !prt.IsUsed && prt.ExpiryDate > DateTime.UtcNow);
        
        return resetToken?.UserId;
    }

    public async Task<bool> DeleteResetTokenAsync(string token)
    {
        var resetToken = await _context.PasswordResetTokens
            .FirstOrDefaultAsync(prt => prt.Token == token);
        
        if (resetToken == null)
            return false;

        resetToken.IsUsed = true;
        var result = await _context.SaveChangesAsync();
        return result > 0;
    }
}
