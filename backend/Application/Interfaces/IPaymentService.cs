using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Application.DTOs;
using Application.Common.Query;

namespace Application.Interfaces;

public interface IPaymentService
{
    Task<PaymentDto> CreatePaymentAsync(CreatePaymentDto dto);
    Task<IReadOnlyList<PaymentDto>> GetUserPaymentsAsync(Guid userId);
    Task<PagedResult<PaymentDto>> GetUserPaymentsPagedAsync(Guid userId, PaymentQueryParameters query);
}
