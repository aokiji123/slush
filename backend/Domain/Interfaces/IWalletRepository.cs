using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Domain.Entities;

namespace Domain.Interfaces;

public interface IWalletRepository
{
    Task<User> GetOrCreateUserAsync(Guid userId);
    Task AddTransactionAsync(WalletTransaction transaction);
    Task SaveAsync();
    Task<(IReadOnlyList<WalletTransaction> Items, int TotalCount)> GetTransactionsAsync(
        Guid userId,
        int page,
        int limit,
        string? sortBy,
        string? sortDirection,
        string? type,
        DateTime? from,
        DateTime? to,
        string? search);
}
