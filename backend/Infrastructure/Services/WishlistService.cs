using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Common.Query;
using Application.DTOs;
using Application.Interfaces;
using Domain.Entities;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Services;

public class WishlistService : IWishlistService
{
    private readonly AppDbContext _db;
    private readonly IFriendshipService _friendshipService;

    public WishlistService(AppDbContext db, IFriendshipService friendshipService)
    {
        _db = db;
        _friendshipService = friendshipService;
    }

    public async Task<IEnumerable<Guid>> GetWishlistGameIdsAsync(Guid userId)
    {
        return await _db.Wishlists
            .AsNoTracking()
            .Where(w => w.UserId == userId)
            .Select(w => w.GameId)
            .ToListAsync();
    }

    public async Task<IEnumerable<GameDto>> GetWishlistGamesAsync(Guid userId)
    {
        var games = await _db.Wishlists
            .AsNoTracking()
            .Where(w => w.UserId == userId)
            .Include(w => w.Game)
            .Select(w => w.Game)
            .ToListAsync();

        return games
            .Where(g => g != null)
            .Select(g => GameDto.FromEntity(g!, "uk"))
            .Where(dto => dto != null)
            .Cast<GameDto>();
    }

    public async Task<PagedResult<GameDto>> GetWishlistGamesAsync(Guid userId, WishlistQueryParameters parameters)
    {
        parameters ??= new WishlistQueryParameters();

        IQueryable<Wishlist> baseQuery = _db.Wishlists
            .AsNoTracking()
            .Where(w => w.UserId == userId)
            .Include(w => w.Game);

        // Track if we need genre or platform filtering (but don't apply yet - requires in-memory evaluation)
        var needsGenreFilter = parameters.Genres?.Count > 0;
        var needsPlatformFilter = parameters.Platforms?.Count > 0;
        var genresFilter = parameters.Genres;
        var platformsFilter = parameters.Platforms;

        // Apply server-side filters (price, sale, DLC)
        if (parameters.MinPrice.HasValue)
        {
            baseQuery = baseQuery.Where(w => w.Game != null && w.Game.Price >= parameters.MinPrice.Value);
        }

        if (parameters.MaxPrice.HasValue)
        {
            baseQuery = baseQuery.Where(w => w.Game != null && w.Game.Price <= parameters.MaxPrice.Value);
        }

        if (parameters.OnSale.HasValue)
        {
            if (parameters.OnSale.Value)
            {
                baseQuery = baseQuery.Where(w => w.Game != null && (w.Game.DiscountPercent > 0 || (w.Game.SalePrice > 0 && w.Game.SalePrice < w.Game.Price)));
            }
            else
            {
                baseQuery = baseQuery.Where(w => w.Game != null && w.Game.DiscountPercent == 0 && (w.Game.SalePrice == 0 || w.Game.SalePrice >= w.Game.Price));
            }
        }

        if (parameters.IsDlc.HasValue)
        {
            baseQuery = baseQuery.Where(w => w.Game != null && w.Game.IsDlc == parameters.IsDlc.Value);
        }

        // Apply search
        baseQuery = baseQuery.ApplySearch(parameters,
            w => w.Game != null ? w.Game.NameTranslations : string.Empty,
            w => w.Game != null ? w.Game.DeveloperTranslations : string.Empty,
            w => w.Game != null ? w.Game.PublisherTranslations : string.Empty,
            w => w.Game != null ? w.Game.DescriptionTranslations : string.Empty);

        // Project to games and apply sorting/pagination at Game level so Game fields are sortable
        IQueryable<Game> gameQuery;

        // Special-case: relevance by when added to wishlist
        var sortBy = parameters.SortBy?.Trim() ?? string.Empty;
        if (sortBy.Contains("AddedAtUtc", StringComparison.OrdinalIgnoreCase))
        {
            // Order wishlists by AddedAtUtc, then project to games
            gameQuery = baseQuery
                .Where(w => w.Game != null)
                .OrderByDescending(w => w.AddedAtUtc)
                .Select(w => w.Game!);
        }
        else
        {
            gameQuery = baseQuery
                .Where(w => w.Game != null)
                .Select(w => w.Game!);
            // Apply domain-aware Game sorting (Rating, ReleaseDate, Price, DiscountPercent, etc.)
            gameQuery = gameQuery.ApplySorting(parameters);
        }

        // Note: Search is handled client-side in the frontend for wishlist (small dataset)
        // parameters.Search is ignored here; filtering/sorting/pagination only

        // If genre or platform filtering is needed, fetch all games and filter in-memory (like GameService does)
        if (needsGenreFilter || needsPlatformFilter)
        {
            // Fetch all sorted games (no pagination yet)
            var allGames = await gameQuery.ToListAsync();

            // Filter by genre in-memory if needed
            if (needsGenreFilter && genresFilter != null && genresFilter.Any())
            {
                allGames = allGames.Where(g => 
                    g.GetLocalizedGenres(parameters.Language ?? "uk").Any(genre => 
                        genresFilter.Any(filterGenre => 
                            genre.ToLowerInvariant().Contains(filterGenre.ToLowerInvariant())))).ToList();
            }

            // Filter by platform in-memory if needed
            if (needsPlatformFilter && platformsFilter != null && platformsFilter.Any())
            {
                allGames = allGames.Where(g => 
                    g.Platforms != null && g.Platforms.Any() && 
                    g.Platforms.Any(platform => 
                        platformsFilter.Any(filterPlatform => 
                            platform.ToLowerInvariant().Contains(filterPlatform.ToLowerInvariant())))).ToList();
            }

            // Get correct count and paginate in-memory
            var total = allGames.Count;
            var skip = (parameters.Page - 1) * parameters.Limit;
            var items = allGames
                .Skip(skip)
                .Take(parameters.Limit)
                .Select(g => GameDto.FromEntity(g, parameters.Language ?? "uk"))
                .Where(dto => dto != null)
                .Cast<GameDto>()
                .ToList();

            return new PagedResult<GameDto>(items, parameters.Page, parameters.Limit, total);
        }
        else
        {
            // No genre/platform filtering - can use database pagination
            var total = await gameQuery.CountAsync();
            var games = await gameQuery
                .ApplyPagination(parameters)
                .ToListAsync();
            
            // Use FromEntity to respect language parameter for localized fields
            var items = games
                .Select(g => GameDto.FromEntity(g, parameters.Language ?? "uk"))
                .Where(dto => dto != null)
                .Cast<GameDto>()
                .ToList();

            return new PagedResult<GameDto>(items, parameters.Page, parameters.Limit, total);
        }
    }

    public async Task<bool> AddToWishlistAsync(Guid userId, Guid gameId)
    {
        var existing = await _db.Wishlists.FindAsync(userId, gameId);
        if (existing is not null)
        {
            return false;
        }

        var wishlistItem = new Wishlist
        {
            UserId = userId,
            GameId = gameId,
            AddedAtUtc = DateTime.UtcNow
        };

        _db.Wishlists.Add(wishlistItem);
        await _db.SaveChangesAsync();

        return true;
    }

    public async Task<bool> RemoveFromWishlistAsync(Guid userId, Guid gameId)
    {
        var wishlistItem = await _db.Wishlists.FindAsync(userId, gameId);
        if (wishlistItem is null)
        {
            return false;
        }

        _db.Wishlists.Remove(wishlistItem);
        await _db.SaveChangesAsync();

        return true;
    }

    public async Task<IReadOnlyList<Guid>> GetFriendsWithGameInWishlistAsync(Guid userId, Guid gameId)
    {
        var friendIds = await _friendshipService.GetFriendIdsAsync(userId);
        if (!friendIds.Any())
        {
            return new List<Guid>();
        }

        // Query Wishlist table for friends who wishlisted the specified game
        var friendsWithGameInWishlist = await _db.Wishlists
            .AsNoTracking()
            .Where(w => friendIds.Contains(w.UserId) && w.GameId == gameId)
            .Select(w => w.UserId)
            .ToListAsync();

        return friendsWithGameInWishlist;
    }

    public async Task<IReadOnlyList<FriendWithGameDto>> GetFriendsWithGameInWishlistDetailsAsync(Guid userId, Guid gameId)
    {
        var friendIds = await _friendshipService.GetFriendIdsAsync(userId);
        if (!friendIds.Any())
        {
            return new List<FriendWithGameDto>();
        }

        // Query Wishlist table for friends who wishlisted the specified game and join with Users to get details
        var friendsWithGameInWishlist = await _db.Wishlists
            .AsNoTracking()
            .Where(w => friendIds.Contains(w.UserId) && w.GameId == gameId)
            .Join(_db.Users, w => w.UserId, u => u.Id, (w, u) => new FriendWithGameDto
            {
                Id = u.Id,
                Nickname = u.Nickname,
                Avatar = u.Avatar
            })
            .ToListAsync();

        return friendsWithGameInWishlist;
    }

}
