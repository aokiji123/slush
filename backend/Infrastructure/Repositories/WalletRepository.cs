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

    public async Task<UserBalance> GetOrCreateBalanceAsync(Guid userId)
    {
        var balance = await _context.UserBalances.FirstOrDefaultAsync(b => b.UserId == userId);
        if (balance == null)
        {
            balance = new UserBalance { Id = Guid.NewGuid(), UserId = userId, Amount = 0m };
            _context.UserBalances.Add(balance);
            await _context.SaveChangesAsync();
        }
        return balance;
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
