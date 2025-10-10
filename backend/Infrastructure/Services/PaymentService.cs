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

namespace Infrastructure.Services;

public class PaymentService : IPaymentService
{
    private readonly IPaymentRepository _paymentRepository;
    private readonly IGameService _gameService;

    public PaymentService(IPaymentRepository paymentRepository, IGameService gameService)
    {
        _paymentRepository = paymentRepository;
        _gameService = gameService;
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
}