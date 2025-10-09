using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Domain.Entities;

namespace Domain.Interfaces;

public interface IPaymentRepository
{
    Task<Payment> CreateAsync(Payment payment);
    Task<IReadOnlyList<Payment>> GetByUserIdAsync(Guid userId);
    Task SaveAsync();
}
