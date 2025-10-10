using System;
using System.Linq;
using System.Threading.Tasks;
using Application.DTOs;
using Application.Interfaces;
using Domain.Entities;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Services;

public class PurchaseService : IPurchaseService
{
    private readonly AppDbContext _context;
    private readonly IWalletService _walletService;

    public PurchaseService(AppDbContext context, IWalletService walletService)
    {
        _context = context;
        _walletService = walletService;
    }

    public async Task<PurchaseResultDto> PurchaseAsync(Guid userId, PurchaseRequestDto dto)
    {
        var game = await _context.Games.FirstOrDefaultAsync(g => g.Id == dto.GameId);
        if (game == null)
            return new PurchaseResultDto { Success = false, Message = "Game not found" };

        var owned = await _context.Libraries.AnyAsync(l => l.UserId == userId && l.GameId == game.Id);
        if (owned)
            return new PurchaseResultDto { Success = false, Message = "Game already owned" };

        var price = (decimal)game.Price;

        try
        {
            await _walletService.SubtractAsync(userId, new WalletChangeDto
            {
                Amount = price,
                Title = string.IsNullOrWhiteSpace(dto.Title) ? $"Purchase: {game.Title}" : dto.Title
            });
        }
        catch (Exception ex)
        {
            return new PurchaseResultDto { Success = false, Message = ex.Message };
        }

        var libraryEntry = new Library
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            GameId = game.Id,
            AddedAt = DateTime.UtcNow
        };
        _context.Libraries.Add(libraryEntry);
        await _context.SaveChangesAsync();

        var balance = await _walletService.GetBalanceAsync(userId);
        return new PurchaseResultDto
        {
            Success = true,
            Message = "Purchase successful",
            OwnedGameId = libraryEntry.Id,
            Balance = balance
        };
    }
}
