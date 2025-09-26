using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Application.DTOs;

namespace Application.Interfaces;

public interface IGameService
{
    Task<GameDto?> GetGameByIdAsync(Guid id);
    Task<IEnumerable<BannerGameDto>> GetBannerGamesAsync();
    Task<IEnumerable<GameDto>> GetSpecialOfferGamesAsync(int page, int limit, string sort);
    Task<IEnumerable<GameDto>> GetNewAndTrendingGamesAsync(int page, int limit, string sort);
    Task<IEnumerable<GameDto>> GetBestsellerGamesAsync(int page, int limit, string sort);
    Task<IEnumerable<GameDto>> GetRecommendedGamesAsync(string userId, int page, int limit, string sort);
    Task<IEnumerable<GameDto>> GetTopPopularGamesAsync(int top);
    Task<IEnumerable<GameDto>> GetGamesByFilterAsync(GamesFilterRequestDto request);
}
