using System;
using System.Threading.Tasks;
using Application.DTOs;

namespace Application.Interfaces;

public interface IPurchaseService
{
    Task<PurchaseResultDto> PurchaseAsync(Guid userId, PurchaseRequestDto dto);
}
