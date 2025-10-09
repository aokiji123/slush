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
    Task<IEnumerable<GameDto>> GetTopPopularGamesAsync(int top);
    Task<IEnumerable<BannerGameDto>> GetBannerGamesAsync();
    Task<IEnumerable<GameDto>> GetSpecialOfferGamesAsync(int page, int limit, string sort);
    Task<IEnumerable<GameDto>> GetNewAndTrendingGamesAsync(int page, int limit, string sort);
    Task<IEnumerable<GameDto>> GetBestsellerGamesAsync(int page, int limit, string sort);
    Task<IEnumerable<GameDto>> GetRecommendedGamesAsync(string userId, int page, int limit, string sort);
    Task<IEnumerable<GameDto>> GetGamesByFilterAsync(GamesFilterRequestDto request);
    Task<IEnumerable<GameDto>> GetRecommendedAsync();
    Task<IEnumerable<GameDto>> GetCheaperThanAsync(decimal priceUpperBound);
    Task<IEnumerable<GameDto>> GetHitsAsync();
    Task<IEnumerable<GameDto>> GetNewAsync();
    Task<IEnumerable<GameDto>> GetFreeAsync();
    Task<IEnumerable<GameDto>> GetDlcsByGameIdAsync(Guid gameId);
    Task<GameDto> AddDlcAsync(AddDlcDto dto);
    Task AddReviewAsync(CreateReviewDto dto);
    Task<List<ReviewDto>> GetReviewsByGameIdAsync(Guid gameId);
}
