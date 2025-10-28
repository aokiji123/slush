using System;
using System.Linq;
using System.Threading.Tasks;
using Application.DTOs;
using Application.Interfaces;
using Domain.Entities;
using Domain.Interfaces;
using Infrastructure.Data;

namespace Infrastructure.Services;

public class WalletService : IWalletService
{
    private readonly IWalletRepository _walletRepository;
    private readonly AppDbContext _dbContext;

    public WalletService(IWalletRepository walletRepository, AppDbContext dbContext)
    {
        _walletRepository = walletRepository;
        _dbContext = dbContext;
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

        // Create a payment record for the top-up
        var payment = new Payment
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            GameId = null,
            Sum = dto.Amount,
            Name = dto.Title ?? "Поповнення рахунку",
            Data = DateTime.UtcNow
        };

        _dbContext.Set<Payment>().Add(payment);
        await _dbContext.SaveChangesAsync();

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
