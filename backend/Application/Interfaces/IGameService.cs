using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Application.DTOs;

namespace Application.Interfaces;

public interface IGameService
{
    Task<GameDto?> GetGameByIdAsync(Guid id, string language = "uk");
    Task<IEnumerable<GameDto>> SearchAsync(string? genre, string? platform, decimal? priceUpperBound, string language = "uk");
    Task<IEnumerable<GameDto>> GetDiscountedAsync(string language = "uk");
    Task<IEnumerable<GameDto>> GetTopPopularGamesAsync(int top, string language = "uk");
    Task<IEnumerable<BannerGameDto>> GetBannerGamesAsync(string language = "uk");
    Task<IEnumerable<GameDto>> GetSpecialOfferGamesAsync(int page, int limit, string sort, string language = "uk");
    Task<IEnumerable<GameDto>> GetNewAndTrendingGamesAsync(int page, int limit, string sort, string language = "uk");
    Task<IEnumerable<GameDto>> GetBestsellerGamesAsync(int page, int limit, string sort, string language = "uk");
    Task<IEnumerable<GameDto>> GetRecommendedGamesAsync(string userId, int page, int limit, string sort, string language = "uk");
    Task<IEnumerable<GameDto>> GetGamesByFilterAsync(GamesFilterRequestDto request, string language = "uk");
    Task<IEnumerable<GameDto>> GetRecommendedAsync(string language = "uk");
    Task<IEnumerable<GameDto>> GetCheaperThanAsync(decimal priceUpperBound, string language = "uk");
    Task<IEnumerable<GameDto>> GetHitsAsync(string language = "uk");
    Task<IEnumerable<GameDto>> GetNewAsync(string language = "uk");
    Task<IEnumerable<GameDto>> GetFreeAsync(string language = "uk");
    Task<IEnumerable<GameDto>> GetDlcsByGameIdAsync(Guid gameId, string language = "uk");
    Task<GameCharacteristicDto?> GetGameCharacteristicsAsync(Guid gameId);
}
