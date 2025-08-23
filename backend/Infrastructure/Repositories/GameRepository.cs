using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Interfaces;
using Domain.Entities;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

public class GameRepository : IGameRepository
{
    private readonly AppDbContext _context;

    public GameRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<Game?> GetByIdAsync(Guid id)
    {
        return await _context.Games
            .Include(g => g.Developer)
            .Include(g => g.Publisher)
            .Include(g => g.GameGenres)
                .ThenInclude(gg => gg.Genre)
            .Include(g => g.GamePlatforms)
                .ThenInclude(gp => gp.Platform)
            .Include(g => g.GameImages)
            .Include(g => g.GameSets)
            .Include(g => g.Dlcs)
            .Include(g => g.Comments)
                .ThenInclude(c => c.User)
            .Include(g => g.UserWishlists)
                .ThenInclude(uw => uw.User)
            .Include(g => g.UserOwnedGames)
                .ThenInclude(uog => uog.User)
            .FirstOrDefaultAsync(g => g.Id == id);
    }

    public async Task<IEnumerable<Game>> GetSpecialOfferGamesAsync(int page, int limit, string sort)
    {
        var query = _context.Games
            .Include(g => g.Developer)
            .Include(g => g.Publisher)
            .Include(g => g.GameGenres)
                .ThenInclude(gg => gg.Genre)
            .Include(g => g.GamePlatforms)
                .ThenInclude(gp => gp.Platform)
            .Include(g => g.GameImages)
            .Include(g => g.GameSets)
            .Where(g => g.GameSets.Any(gs => gs.SalePercent > 0))
            .AsQueryable();

        query = ApplySorting(query, sort);
        var games = await ApplyPagination(query, page, limit).ToListAsync();

        return games;
    }

    public async Task<IEnumerable<Game>> GetNewAndTrendingGamesAsync(int page, int limit, string sort)
    {
        var query = _context.Games
            .Include(g => g.Developer)
            .Include(g => g.Publisher)
            .Include(g => g.GameGenres)
                .ThenInclude(gg => gg.Genre)
            .Include(g => g.GamePlatforms)
                .ThenInclude(gp => gp.Platform)
            .Include(g => g.GameImages)
            .Include(g => g.GameSets)
            .Where(g => g.ReleaseDate >= DateTime.UtcNow.AddDays(-30) || g.Rating >= 4.0)
            .AsQueryable();

        query = ApplySorting(query, sort);
        var games = await ApplyPagination(query, page, limit).ToListAsync();

        return games;
    }

    public async Task<IEnumerable<Game>> GetBestsellerGamesAsync(int page, int limit, string sort)
    {
        var query = _context.Games
            .Include(g => g.Developer)
            .Include(g => g.Publisher)
            .Include(g => g.GameGenres)
                .ThenInclude(gg => gg.Genre)
            .Include(g => g.GamePlatforms)
                .ThenInclude(gp => gp.Platform)
            .Include(g => g.GameImages)
            .Include(g => g.GameSets)
            .OrderByDescending(g => g.Rating)
            .ThenByDescending(g => g.Reviews.Count)
            .AsQueryable();

        query = ApplySorting(query, sort);
        var games = await ApplyPagination(query, page, limit).ToListAsync();

        return games;
    }

    public async Task<IEnumerable<Game>> GetRecommendedGamesAsync(Guid userId, int page, int limit, string sort)
    {
        // Get user's favorite genres based on owned games
        var userGenres = await _context.UserOwnedGames
            .Where(uog => uog.UserId == userId)
            .SelectMany(uog => uog.Game.GameGenres.Select(gg => gg.Genre.Name))
            .Distinct()
            .ToListAsync();

        var query = _context.Games
            .Include(g => g.Developer)
            .Include(g => g.Publisher)
            .Include(g => g.GameGenres)
                .ThenInclude(gg => gg.Genre)
            .Include(g => g.GamePlatforms)
                .ThenInclude(gp => gp.Platform)
            .Include(g => g.GameImages)
            .Include(g => g.GameSets)
            .Where(g => g.GameGenres.Any(gg => userGenres.Contains(gg.Genre.Name)))
            .AsQueryable();

        query = ApplySorting(query, sort);
        var games = await ApplyPagination(query, page, limit).ToListAsync();

        return games;
    }

    public async Task<IEnumerable<BannerGame>> GetBannerGamesAsync()
    {
        return await _context.BannerGames
            .OrderBy(bg => bg.CreatedAtDateTime)
            .ToListAsync();
    }

    private IQueryable<Game> ApplySorting(IQueryable<Game> query, string sort)
    {
        return sort switch
        {
            "price_asc" => query.OrderBy(g => g.Price),
            "price_desc" => query.OrderByDescending(g => g.Price),
            "release_date_desc" => query.OrderByDescending(g => g.ReleaseDate),
            "rating_desc" => query.OrderByDescending(g => g.Rating),
            "rating_asc" => query.OrderBy(g => g.Rating),
            _ => query.OrderByDescending(g => g.Rating) // Default: popularity/rating
        };
    }

    private IQueryable<Game> ApplyPagination(IQueryable<Game> query, int page, int limit)
    {
        return query
            .Skip((page - 1) * limit)
            .Take(limit);
    }
}
