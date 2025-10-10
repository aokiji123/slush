using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain.Entities;
using Domain.Interfaces;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

public class WalletRepository : IWalletRepository
{
    private readonly AppDbContext _context;

    public WalletRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<User> GetOrCreateUserAsync(Guid userId)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId);
        if (user == null)
        {
            user = new User { Id = userId, Balance = 0m };
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
        }
        return user;
    }

    public Task SaveAsync()
    {
        return _context.SaveChangesAsync();
    }
}
