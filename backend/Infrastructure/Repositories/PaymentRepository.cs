using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain.Entities;
using Domain.Interfaces;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

public class PaymentRepository : IPaymentRepository
{
    private readonly AppDbContext _context;

    public PaymentRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<Payment> CreateAsync(Payment payment)
    {
        _context.Payments.Add(payment);
        await _context.SaveChangesAsync();
        return payment;
    }

    public async Task<IReadOnlyList<Payment>> GetByUserIdAsync(Guid userId)
    {
        return await _context.Payments
            .Where(p => p.UserId == userId)
            .Include(p => p.Game)
            .OrderByDescending(p => p.Data)
            .ToListAsync();
    }

    public async Task SaveAsync()
    {
        await _context.SaveChangesAsync();
    }

    public IQueryable<Payment> Payments => _context.Payments.Include(p => p.Game);
}