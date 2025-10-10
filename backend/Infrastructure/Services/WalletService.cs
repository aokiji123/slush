using System;
using System.Linq;
using System.Threading.Tasks;
using Application.Common.Query;
using Application.DTOs;
using Application.Interfaces;
using Domain.Entities;
using Domain.Interfaces;

namespace Infrastructure.Services;

public class WalletService : IWalletService
{
    private readonly IWalletRepository _walletRepository;

    public WalletService(IWalletRepository walletRepository)
    {
        _walletRepository = walletRepository;
    }

    public async Task<BalanceDto> GetBalanceAsync(Guid userId)
    {
        var user = await _walletRepository.GetOrCreateUserAsync(userId);
        return new BalanceDto { Amount = user.Balance };
    }

    public async Task<BalanceDto> AddAsync(Guid userId, WalletChangeDto dto)
    {
        if (dto.Amount <= 0) throw new ArgumentException("Amount must be positive");
        var user = await _walletRepository.GetOrCreateUserAsync(userId);
        user.Balance += dto.Amount;
        await _walletRepository.AddTransactionAsync(new WalletTransaction
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            Amount = dto.Amount,
            Title = string.IsNullOrWhiteSpace(dto.Title) ? "Deposit" : dto.Title,
            CreatedAt = DateTime.UtcNow
        });
        await _walletRepository.SaveAsync();
        return new BalanceDto { Amount = user.Balance };
    }

    public async Task<BalanceDto> SubtractAsync(Guid userId, WalletChangeDto dto)
    {
        if (dto.Amount <= 0) throw new ArgumentException("Amount must be positive");
        var user = await _walletRepository.GetOrCreateUserAsync(userId);
        if (user.Balance < dto.Amount) throw new InvalidOperationException("Insufficient funds");
        user.Balance -= dto.Amount;
        await _walletRepository.AddTransactionAsync(new WalletTransaction
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            Amount = -dto.Amount,
            Title = string.IsNullOrWhiteSpace(dto.Title) ? "Withdrawal" : dto.Title,
            CreatedAt = DateTime.UtcNow
        });
        await _walletRepository.SaveAsync();
        return new BalanceDto { Amount = user.Balance };
    }

    public async Task<PagedResult<TransactionDto>> GetHistoryAsync(Guid userId, WalletQueryParameters parameters)
    {
        parameters ??= new WalletQueryParameters();

        var (items, total) = await _walletRepository.GetTransactionsAsync(
            userId,
            parameters.Page,
            parameters.Limit,
            parameters.SortBy,
            parameters.SortDirection,
            parameters.Type,
            parameters.From,
            parameters.To,
            parameters.Search);
        var mapped = items.Select(t => new TransactionDto
        {
            Id = t.Id,
            Amount = t.Amount,
            Title = t.Title,
            CreatedAt = t.CreatedAt
        }).ToList();

        return new PagedResult<TransactionDto>(mapped, parameters.Page, parameters.Limit, total);
    }
}
