using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Common.Query;
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

    public async Task AddTransactionAsync(WalletTransaction transaction)
    {
        _context.WalletTransactions.Add(transaction);
        await _context.SaveChangesAsync();
    }

    public Task SaveAsync()
    {
        return _context.SaveChangesAsync();
    }

    public async Task<(IReadOnlyList<WalletTransaction> Items, int TotalCount)> GetTransactionsAsync(
        Guid userId,
        int page,
        int limit,
        string? sortBy,
        string? sortDirection,
        string? type,
        DateTime? from,
        DateTime? to,
        string? search)
    {
        var parameters = new WalletQueryParameters
        {
            Page = page,
            Limit = limit,
            SortBy = string.IsNullOrWhiteSpace(sortBy) ? "CreatedAt:desc" : sortBy,
            SortDirection = sortDirection,
            Type = type,
            From = from,
            To = to,
            Search = search
        };

        var query = _context.WalletTransactions
            .AsNoTracking()
            .Where(t => t.UserId == userId);

        if (!string.IsNullOrWhiteSpace(type))
        {
            query = query.Where(t => t.Type == type);
        }

        if (from.HasValue)
        {
            query = query.Where(t => t.CreatedAt >= from.Value);
        }

        if (to.HasValue)
        {
            query = query.Where(t => t.CreatedAt <= to.Value);
        }

        query = query.ApplySearch(parameters, t => t.Title);

        var total = await query.CountAsync();

        var items = await query
            .ApplySorting(parameters)
            .ApplyPagination(parameters)
            .ToListAsync();

        return (items, total);
    }
}
