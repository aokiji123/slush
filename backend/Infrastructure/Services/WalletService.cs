using System;
using System.Linq;
using System.Threading.Tasks;
using Application.DTOs;
using Application.Interfaces;
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
        await _walletRepository.SaveAsync();
        return new BalanceDto { Amount = user.Balance };
    }

    public async Task<BalanceDto> SubtractAsync(Guid userId, WalletChangeDto dto)
    {
        if (dto.Amount <= 0) throw new ArgumentException("Amount must be positive");
        var user = await _walletRepository.GetOrCreateUserAsync(userId);
        if (user.Balance < dto.Amount) throw new InvalidOperationException("Insufficient funds");
        user.Balance -= dto.Amount;
        await _walletRepository.SaveAsync();
        return new BalanceDto { Amount = user.Balance };
    }
}
