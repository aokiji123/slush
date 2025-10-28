using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.DTOs;
using Application.Interfaces;
using Domain.Entities;
using Domain.Interfaces;
using Microsoft.EntityFrameworkCore;
using Application.Common.Query;
using Infrastructure.Data;

namespace Infrastructure.Services;

public class PaymentService : IPaymentService
{
    private readonly IPaymentRepository _paymentRepository;
    private readonly IGameService _gameService;
    private readonly AppDbContext _db;

    public PaymentService(IPaymentRepository paymentRepository, IGameService gameService, AppDbContext db)
    {
        _paymentRepository = paymentRepository;
        _gameService = gameService;
        _db = db;
    }

    public async Task<PaymentDto> CreatePaymentAsync(CreatePaymentDto dto)
    {
        var payment = new Payment
        {
            Id = Guid.NewGuid(),
            UserId = dto.UserId,
            GameId = dto.GameId,
            Sum = dto.Sum,
            Name = dto.Name,
            Data = DateTime.UtcNow
        };

        // If no name provided and GameId exists, get game name
        if (string.IsNullOrWhiteSpace(payment.Name) && payment.GameId.HasValue)
        {
            var game = await _gameService.GetGameByIdAsync(payment.GameId.Value);
            payment.Name = game?.Name ?? "Unknown Game";
        }

        // If no name provided and no GameId, use default name
        if (string.IsNullOrWhiteSpace(payment.Name))
        {
            payment.Name = "Поповнення рахунку";
        }

        var createdPayment = await _paymentRepository.CreateAsync(payment);

        return new PaymentDto
        {
            Id = createdPayment.Id,
            UserId = createdPayment.UserId,
            GameId = createdPayment.GameId,
            Sum = createdPayment.Sum,
            Name = createdPayment.Name,
            Data = createdPayment.Data
        };
    }

    public async Task<IReadOnlyList<PaymentDto>> GetUserPaymentsAsync(Guid userId)
    {
        var payments = await _paymentRepository.GetByUserIdAsync(userId);

        return payments.Select(p => new PaymentDto
        {
            Id = p.Id,
            UserId = p.UserId,
            GameId = p.GameId,
            Sum = p.Sum,
            Name = p.Name,
            Data = p.Data
        }).ToList();
    }

    public async Task<PagedResult<PaymentDto>> GetUserPaymentsPagedAsync(Guid userId, PaymentQueryParameters query)
    {
        var userPaymentsQuery = _paymentRepository.Payments // Expose IQueryable<Payment> from repository
            .Where(p => p.UserId == userId);
        
        // Apply sorting and pagination from Common/Query
        userPaymentsQuery = userPaymentsQuery.ApplySorting(query);

        var totalCount = await userPaymentsQuery.CountAsync();
        var (skip, take) = query.Normalize();
        var pagedPayments = await userPaymentsQuery.Skip(skip).Take(take)
            .ToListAsync();

        var dtos = pagedPayments.Select(p => new PaymentDto
        {
            Id = p.Id,
            UserId = p.UserId,
            GameId = p.GameId,
            Sum = p.Sum,
            Name = p.Name,
            Data = p.Data
        }).ToList();
        return new PagedResult<PaymentDto>(dtos, query.Page, query.Limit, totalCount);
    }

    public async Task<PagedResult<PaymentHistoryItemDto>> GetPaymentHistoryAsync(Guid userId, PaymentHistoryQueryParams query)
    {
        // Base query for user's payments
        var q = _paymentRepository.Payments.Where(p => p.UserId == userId);

        // Map type filter: infer from data we have (Name/GameId)
        if (query.Type.HasValue)
        {
            q = query.Type.Value switch
            {
                PaymentTypeDto.Purchase => q.Where(p => p.GameId != null),
                PaymentTypeDto.TopUp => q.Where(p => p.GameId == null && p.Sum > 0),
                PaymentTypeDto.Refund => q.Where(p => p.Sum < 0),
                _ => q
            };
        }

        if (query.From.HasValue)
        {
            q = q.Where(p => p.Data >= query.From.Value);
        }
        if (query.To.HasValue)
        {
            q = q.Where(p => p.Data <= query.To.Value);
        }

        // Sorting by date desc by default
        var total = await q.CountAsync();
        var (skip, take) = query.Normalize();
        var items = await q
            .OrderByDescending(p => p.Data)
            .Skip(skip)
            .Take(take)
            .Select(p => new PaymentHistoryItemDto
            {
                Id = p.Id,
                Date = p.Data,
                Type = p.GameId != null ? PaymentTypeDto.Purchase : (p.Sum < 0 ? PaymentTypeDto.Refund : PaymentTypeDto.TopUp),
                Description = p.GameId != null ? (p.Name ?? "Game purchase") : (p.Sum < 0 ? "Refund" : p.Name),
                Amount = p.Sum,
                Currency = "UAH",
                Status = "Completed",
                GameId = p.GameId,
                GameName = p.Game != null ? (p.Game.Name ?? p.Name) : null,
                GameImage = p.Game != null ? p.Game.MainImage : null
            })
            .ToListAsync();

        return new PagedResult<PaymentHistoryItemDto>(items, query.Page, query.Limit, total);
    }
}