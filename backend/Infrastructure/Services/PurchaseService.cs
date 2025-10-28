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
    private readonly IBadgeService _badgeService;

    public PurchaseService(AppDbContext context, IWalletService walletService, IBadgeService badgeService)
    {
        _context = context;
        _walletService = walletService;
        _badgeService = badgeService;
    }

    public async Task<PurchaseResultDto> PurchaseAsync(Guid userId, PurchaseRequestDto dto)
    {
        var game = await _context.Games.FirstOrDefaultAsync(g => g.Id == dto.GameId);
        if (game == null)
            return new PurchaseResultDto { Success = false, Message = "Game not found" };

        var owned = await _context.Libraries.AnyAsync(l => l.UserId == userId && l.GameId == game.Id);
        if (owned)
            return new PurchaseResultDto { Success = false, Message = "Game already owned" };

        // Fix Bug #1: Use sale price when available
        var price = game.SalePrice > 0 ? (decimal)game.SalePrice : (decimal)game.Price;

        // Fix Bug #7: Check if it's a free game
        var isFreeGame = price == 0;

        // Fix Bug #8: Validate DLC base game ownership
        if (game.IsDlc && game.BaseGameId.HasValue)
        {
            var ownsBaseGame = await _context.Libraries
                .AnyAsync(l => l.UserId == userId && l.GameId == game.BaseGameId.Value);
            
            if (!ownsBaseGame)
            {
                return new PurchaseResultDto 
                { 
                    Success = false, 
                    Message = "You must own the base game before purchasing DLC" 
                };
            }
        }

        // Fix Bug #3: Wrap in database transaction for atomicity
        using var transaction = await _context.Database.BeginTransactionAsync();
        
        Library libraryEntry = null;
        
        try
        {
            // Fix Bug #7: Only deduct from wallet if not a free game
            if (!isFreeGame)
            {
                // Check if user has sufficient balance BEFORE modifying balance
                var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId);
                if (user == null)
                    return new PurchaseResultDto { Success = false, Message = "User not found" };
                
                if (user.Balance < price)
                    return new PurchaseResultDto { Success = false, Message = "Insufficient funds" };
                
                // Deduct balance directly from the tracked entity
                user.Balance -= price;
            }

            libraryEntry = new Library
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                GameId = game.Id,
                AddedAt = DateTime.UtcNow
            };
            _context.Libraries.Add(libraryEntry);
            
            // Remove from wishlist if the game is in user's wishlist
            var wishlistItem = await _context.Wishlists.FirstOrDefaultAsync(w => w.UserId == userId && w.GameId == game.Id);
            if (wishlistItem != null)
            {
                _context.Wishlists.Remove(wishlistItem);
            }

            // Record payment for purchase (only for paid games)
            if (!isFreeGame)
            {
                var payment = new Payment
                {
                    Id = Guid.NewGuid(),
                    UserId = userId,
                    GameId = game.Id,
                    Sum = -price, // negative amount for purchase
                    Name = game.Name ?? "Game purchase",
                    Data = DateTime.UtcNow
                };
                _context.Set<Payment>().Add(payment);
            }
            
            await _context.SaveChangesAsync();
            
            // Commit the transaction
            await transaction.CommitAsync();
            
            // Award badges after successful purchase (outside transaction to avoid blocking)
            _ = Task.Run(async () =>
            {
                try
                {
                    await _badgeService.CheckAndAwardBadgesAsync(userId);
                }
                catch
                {
                    // Silently fail badge awarding - don't affect the purchase
                }
            });
        }
        catch (Exception ex)
        {
            // Rollback transaction on any error
            await transaction.RollbackAsync();
            
            // Provide more detailed error message
            var errorMessage = ex.Message;
            if (ex.InnerException != null)
            {
                errorMessage += $" (Inner: {ex.InnerException.Message})";
            }
            
            return new PurchaseResultDto { Success = false, Message = errorMessage };
        }

        if (libraryEntry == null)
        {
            return new PurchaseResultDto { Success = false, Message = "Failed to create library entry" };
        }

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
