using System;
using System.Threading.Tasks;
using Application.DTOs;

namespace Application.Interfaces;

public interface IWalletService
{
    Task<BalanceDto> GetBalanceAsync(Guid userId);
    Task<BalanceDto> AddAsync(Guid userId, WalletChangeDto dto);
    Task<BalanceDto> SubtractAsync(Guid userId, WalletChangeDto dto);
}
