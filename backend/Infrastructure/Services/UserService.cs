using System;
using System.Linq;
using System.Threading.Tasks;
using Application.DTOs;
using Application.Interfaces;
using Domain.Entities;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Services;

public class UserService : IUserService
{
    private readonly AppDbContext _db;

    public UserService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<UserDto?> GetUserAsync(Guid id)
    {
        var user = await _db.Set<User>().FirstOrDefaultAsync(u => u.Id == id);
        if (user == null) return null;

        return new UserDto
        {
            Id = user.Id,
            Nickname = user.Nickname,
            Email = user.Email,
            Bio = user.Bio,
            Lang = user.Lang,
            Avatar = user.Avatar,
            Banner = user.Banner,
            Balance = (double)user.Balance
        };
    }

    public async Task<UserDto?> UpdateUserAsync(Guid id, UserUpdateDto dto)
    {
        var user = await _db.Set<User>().FirstOrDefaultAsync(u => u.Id == id);
        if (user == null) return null;

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

    public async Task<bool> UpdateNotificationsAsync(NotificationsDto dto)
    {
        // додати нотифікації потім
        var exists = await _db.Set<User>().AnyAsync(u => u.Id == dto.UserId);
        return exists;
    }

    private static T? GetProp<T>(object obj, string name)
    {
        var p = obj.GetType().GetProperty(name);
        if (p == null) return default;
        var v = p.GetValue(obj);
        if (v == null) return default;
        return (T)v;
    }

    private static void SetProp<T>(object obj, string name, T value)
    {
        var p = obj.GetType().GetProperty(name);
        if (p == null) return;
        p.SetValue(obj, value);
    }

    private static bool TryAddToNumeric(object obj, string name, decimal amount)
    {
        var p = obj.GetType().GetProperty(name);
        if (p == null || !p.CanRead || !p.CanWrite) return false;
        var current = p.GetValue(obj);
        if (current == null) return false;

        try
        {
            if (current is decimal d)
            {
                p.SetValue(obj, d + amount);
                return true;
            }
            if (current is double dbl)
            {
                p.SetValue(obj, dbl + (double)amount);
                return true;
            }
            if (current is float fl)
            {
                p.SetValue(obj, fl + (float)amount);
                return true;
            }
        }
        catch
        {
            return false;
        }

        return false;
    }
}


