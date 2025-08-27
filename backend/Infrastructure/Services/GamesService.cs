using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.DTOs;
using Application.Interfaces;
using Domain.Entities;

namespace Application.Services;

public class GamesService : IGamesService
{
    private readonly IGameRepository _gameRepository;

    public GamesService(IGameRepository gameRepository)
    {
        _gameRepository = gameRepository;
    }

    public async Task<GameDto?> GetGameByIdAsync(Guid id)
    {
        var game = await _gameRepository.GetByIdAsync(id);
        if (game == null)
            return null;

        return MapGameToDto(game);
    }

    public async Task<IEnumerable<BannerGameDto>> GetBannerGamesAsync()
    {
        var bannerGames = await _gameRepository.GetBannerGamesAsync();
        return bannerGames.Select(MapBannerGameToDto);
    }

    public async Task<IEnumerable<GameDto>> GetSpecialOfferGamesAsync(int page, int limit, string sort)
    {
        var games = await _gameRepository.GetSpecialOfferGamesAsync(page, limit, sort);
        return games.Select(MapGameToDto);
    }

    public async Task<IEnumerable<GameDto>> GetNewAndTrendingGamesAsync(int page, int limit, string sort)
    {
        var games = await _gameRepository.GetNewAndTrendingGamesAsync(page, limit, sort);
        return games.Select(MapGameToDto);
    }

    public async Task<IEnumerable<GameDto>> GetBestsellerGamesAsync(int page, int limit, string sort)
    {
        var games = await _gameRepository.GetBestsellerGamesAsync(page, limit, sort);
        return games.Select(MapGameToDto);
    }

    public async Task<IEnumerable<GameDto>> GetRecommendedGamesAsync(string userId, int page, int limit, string sort)
    {
        if (!Guid.TryParse(userId, out var userGuid))
            return new List<GameDto>();

        var games = await _gameRepository.GetRecommendedGamesAsync(userGuid, page, limit, sort);
        return games.Select(MapGameToDto);
    }



    private GameDto MapGameToDto(Game game)
    {
        return new GameDto
        {
            Id = game.Id,
            Title = game.Title,
            Description = game.Description ?? string.Empty,
            MainImage = game.MainImage ?? string.Empty,
            GameImages = game.GameImages.Select(gi => gi.ImageUrl).ToList(),
            Genres = game.GameGenres.Select(gg => gg.Genre.Name).ToList(),
            Price = game.Price,
            Rating = game.Rating,
            ReleaseDate = game.ReleaseDate,
            Developer = new DeveloperDto
            {
                Id = game.Developer.Id,
                Name = game.Developer.Name,
                Description = game.Developer.Description ?? string.Empty,
                Website = game.Developer.Website ?? string.Empty
            },
            Publisher = new PublisherDto
            {
                Id = game.Publisher.Id,
                Name = game.Publisher.Name,
                Description = game.Publisher.Description ?? string.Empty,
                Website = game.Publisher.Website ?? string.Empty
            },
            Platforms = game.GamePlatforms.Select(gp => gp.Platform.Name).ToList(),
            GameSets = game.GameSets.Select(gs => new GameSetDto
            {
                Id = gs.Id,
                Name = gs.Name,
                Description = gs.Description ?? string.Empty,
                Content = gs.Content,
                Price = gs.Price,
                OldPrice = gs.OldPrice,
                SalePercent = gs.SalePercent,
                SaleEndDate = gs.SaleEndDate
            }).ToList(),
            Dlcs = game.Dlcs.Select(d => new DlcDto
            {
                Id = d.Id,
                Name = d.Name,
                Price = d.Price
            }).ToList(),
            Comments = game.Comments.Select(c => new CommentDto
            {
                Id = c.Id,
                Name = c.User.Username,
                Text = c.Text,
                Avatar = c.User.Avatar ?? string.Empty,
                Rating = c.Rating,
                FavoritesCount = c.FavoritesCount,
                RepliesCount = c.RepliesCount,
                PostedAt = c.CreatedAtDateTime
            }).ToList(),
            FriendsWishlist = new FriendsWishlistDto
            {
                Count = game.UserWishlists.Count,
                Friends = game.UserWishlists.Take(5).Select(uw => new FriendDto
                {
                    Id = uw.User.Id,
                    Name = uw.User.Username,
                    Avatar = uw.User.Avatar ?? string.Empty
                }).ToList()
            },
            FriendsOwned = new FriendsOwnedDto
            {
                Count = game.UserOwnedGames.Count,
                Friends = game.UserOwnedGames.Take(5).Select(uog => new FriendDto
                {
                    Id = uog.User.Id,
                    Name = uog.User.Username,
                    Avatar = uog.User.Avatar ?? string.Empty
                }).ToList()
            }
        };
    }

    private BannerGameDto MapBannerGameToDto(BannerGame bannerGame)
    {
        return new BannerGameDto
        {
            Id = bannerGame.Id,
            Name = bannerGame.Name,
            Description = bannerGame.Description,
            Image = bannerGame.Image,
            Price = bannerGame.Price,
            GameImages = bannerGame.GameImages,
            OldPrice = bannerGame.OldPrice,
            SalePercent = bannerGame.SalePercent,
            SaleEndDate = bannerGame.SaleEndDate
        };
    }
}
