using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Application.DTOs;

namespace Application.Interfaces;

public interface IGameService
{
    Task<GameDto?> GetGameByIdAsync(Guid id);
    Task<IEnumerable<GameDto>> SearchAsync(string? genre, string? platform, decimal? priceUpperBound);
    Task<IEnumerable<GameDto>> GetDiscountedAsync();
    Task<IEnumerable<GameDto>> GetRecommendedAsync();
    Task<IEnumerable<GameDto>> GetCheaperThanAsync(decimal priceUpperBound);
    Task<IEnumerable<GameDto>> GetHitsAsync();
    Task<IEnumerable<GameDto>> GetNewAsync();
    Task<IEnumerable<GameDto>> GetFreeAsync();
}
