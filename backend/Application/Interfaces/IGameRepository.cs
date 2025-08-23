using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Domain.Entities;

namespace Application.Interfaces;

public interface IGameRepository
{
    Task<Game?> GetByIdAsync(Guid id);
    Task<IEnumerable<Game>> GetSpecialOfferGamesAsync(int page, int limit, string sort);
    Task<IEnumerable<Game>> GetNewAndTrendingGamesAsync(int page, int limit, string sort);
    Task<IEnumerable<Game>> GetBestsellerGamesAsync(int page, int limit, string sort);
    Task<IEnumerable<Game>> GetRecommendedGamesAsync(Guid userId, int page, int limit, string sort);
    Task<IEnumerable<BannerGame>> GetBannerGamesAsync();
}
