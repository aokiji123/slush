using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Common.Query;
using Application.DTOs;
using Application.Interfaces;
using Domain.Entities;
using Domain.Interfaces;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Services;

public class LibraryService : ILibraryService
{
    private readonly AppDbContext _context;
    private readonly ILibraryRepository _libraryRepository;

    public LibraryService(AppDbContext context, ILibraryRepository libraryRepository)
    {
        _context = context;
        _libraryRepository = libraryRepository;
    }

    public async Task<PagedResult<OwnedGameDto>> GetOwnedAsync(Guid userId, LibraryQueryParameters parameters)
    {
        parameters ??= new LibraryQueryParameters();

        IQueryable<Library> baseQuery = _context.Libraries
            .AsNoTracking()
            .Where(l => l.UserId == userId);

        if (parameters.IsDlc.HasValue)
        {
            baseQuery = baseQuery.Where(l => l.Game.IsDlc == parameters.IsDlc.Value);
        }

        baseQuery = baseQuery.ApplySearch(parameters,
            l => l.Game.NameTranslations,
            l => l.Game.DeveloperTranslations,
            l => l.Game.PublisherTranslations,
            l => l.Game.DescriptionTranslations);

        var total = await baseQuery.CountAsync();

        var items = await baseQuery
            .Include(l => l.Game)
            .ApplySorting(parameters)
            .ApplyPagination(parameters)
            .Select(l => new OwnedGameDto
            {
                GameId = l.GameId,
                Name = l.Game.Name ?? string.Empty,
                MainImage = l.Game.MainImage ?? string.Empty,
                PurchasedAt = l.AddedAt,
                PurchasePrice = (double)l.Game.Price
            })
            .ToListAsync();

        return new PagedResult<OwnedGameDto>(items, parameters.Page, parameters.Limit, total);
    }

    public async Task<bool> IsOwnedAsync(Guid userId, Guid gameId)
    {
        return await _context.Libraries.AnyAsync(l => l.UserId == userId && l.GameId == gameId);
    }

    public async Task<IEnumerable<LibraryGameDto>> GetUserLibraryAsync(Guid userId)
    {
        var libraries = await _libraryRepository.GetByUserIdAsync(userId);
        return libraries.Select(l => new LibraryGameDto
        {
            Id = l.Game.Id,
            Name = l.Game.Name,
            Slug = l.Game.Slug,
            MainImage = l.Game.MainImage,
            Price = (double)l.Game.Price,
            SalePrice = (double)l.Game.SalePrice,
            DiscountPercent = l.Game.DiscountPercent,
            Rating = l.Game.Rating,
            ReleaseDate = l.Game.ReleaseDate,
            Genres = l.Game.Genre,
            Platforms = l.Game.Platforms,
            AddedAt = l.AddedAt
        });
    }

    public async Task<IEnumerable<GameDto>> GetLibraryGamesAsync(Guid userId)
    {
        var games = await _context.Libraries
            .AsNoTracking()
            .Where(l => l.UserId == userId)
            .Include(l => l.Game)
            .Select(l => l.Game)
            .ToListAsync();

        return games
            .Select(g => GameDto.FromEntity(g, "uk"))
            .Where(dto => dto != null)
            .Cast<GameDto>();
    }

    public async Task<PagedResult<GameDto>> GetLibraryGamesAsync(Guid userId, LibraryQueryParameters parameters)
    {
        parameters ??= new LibraryQueryParameters();

        IQueryable<Library> baseQuery = _context.Libraries
            .AsNoTracking()
            .Where(l => l.UserId == userId)
            .Include(l => l.Game);

        // Track if we need genre or platform filtering (but don't apply yet - requires in-memory evaluation)
        var needsGenreFilter = parameters.Genres?.Count > 0;
        var needsPlatformFilter = parameters.Platforms?.Count > 0;
        var genresFilter = parameters.Genres;
        var platformsFilter = parameters.Platforms;

        // Apply server-side filters (price, sale, DLC)
        if (parameters.MinPrice.HasValue)
        {
            baseQuery = baseQuery.Where(l => l.Game.Price >= parameters.MinPrice.Value);
        }

        if (parameters.MaxPrice.HasValue)
        {
            baseQuery = baseQuery.Where(l => l.Game.Price <= parameters.MaxPrice.Value);
        }

        if (parameters.OnSale.HasValue)
        {
            if (parameters.OnSale.Value)
            {
                baseQuery = baseQuery.Where(l => l.Game.DiscountPercent > 0 || (l.Game.SalePrice > 0 && l.Game.SalePrice < l.Game.Price));
            }
            else
            {
                baseQuery = baseQuery.Where(l => l.Game.DiscountPercent == 0 && (l.Game.SalePrice == 0 || l.Game.SalePrice >= l.Game.Price));
            }
        }

        if (parameters.IsDlc.HasValue)
        {
            baseQuery = baseQuery.Where(l => l.Game.IsDlc == parameters.IsDlc.Value);
        }

        // Apply search
        baseQuery = baseQuery.ApplySearch(parameters,
            l => l.Game.NameTranslations,
            l => l.Game.DeveloperTranslations,
            l => l.Game.PublisherTranslations,
            l => l.Game.DescriptionTranslations);

        // Project to games and apply sorting/pagination at Game level so Game fields are sortable
        IQueryable<Game> gameQuery;

        // Special-case: relevance by when added to library
        var sortBy = parameters.SortBy?.Trim() ?? string.Empty;
        if (sortBy.Contains("AddedAt", StringComparison.OrdinalIgnoreCase))
        {
            // Order libraries by AddedAt, then project to games
            gameQuery = baseQuery
                .OrderByDescending(l => l.AddedAt)
                .Select(l => l.Game);
        }
        else
        {
            gameQuery = baseQuery.Select(l => l.Game);
            // Apply domain-aware Game sorting (Rating, ReleaseDate, Price, DiscountPercent, etc.)
            gameQuery = gameQuery.ApplySorting(parameters);
        }

        // If genre or platform filtering is needed, fetch all games and filter in-memory (like WishlistService does)
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

    public async Task<LibraryDto> AddToLibraryAsync(AddToLibraryDto dto)
    {
        // Check if already exists
        var exists = await _libraryRepository.ExistsAsync(dto.UserId, dto.GameId);
        if (exists)
        {
            throw new InvalidOperationException("Game is already in user's library");
        }

        var library = new Library
        {
            Id = Guid.NewGuid(),
            UserId = dto.UserId,
            GameId = dto.GameId,
            AddedAt = DateTime.UtcNow
        };

        var addedLibrary = await _libraryRepository.AddAsync(library);
        
        return new LibraryDto
        {
            Id = addedLibrary.Id,
            UserId = addedLibrary.UserId,
            GameId = addedLibrary.GameId,
            AddedAt = addedLibrary.AddedAt
        };
    }

    public async Task<bool> IsInLibraryAsync(Guid userId, Guid gameId)
    {
        return await _libraryRepository.ExistsAsync(userId, gameId);
    }

    public async Task<IEnumerable<GameDto>> GetSharedGamesAsync(Guid userId1, Guid userId2)
    {
        // Get game IDs from both users' libraries
        var user1GameIds = await _context.Libraries
            .AsNoTracking()
            .Where(l => l.UserId == userId1)
            .Select(l => l.GameId)
            .ToListAsync();

        var user2GameIds = await _context.Libraries
            .AsNoTracking()
            .Where(l => l.UserId == userId2)
            .Select(l => l.GameId)
            .ToListAsync();

        // Find intersection of game IDs
        var sharedGameIds = user1GameIds.Intersect(user2GameIds).ToList();

        if (!sharedGameIds.Any())
        {
            return new List<GameDto>();
        }

        // Get full game details for shared games
        var sharedGames = await _context.Games
            .AsNoTracking()
            .Where(g => sharedGameIds.Contains(g.Id))
            .ToListAsync();

        // Convert to DTOs with default language (Ukrainian)
        return sharedGames
            .Select(g => GameDto.FromEntity(g, "uk"))
            .Where(dto => dto != null)
            .Cast<GameDto>()
            .ToList();
    }
}