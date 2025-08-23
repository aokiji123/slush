using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using Application.DTOs;
using Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.Linq;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class GamesController : ControllerBase
{
    private readonly IGamesService _gamesService;
    private readonly ILogger<GamesController> _logger;

    public GamesController(IGamesService gamesService, ILogger<GamesController> logger)
    {
        _gamesService = gamesService;
        _logger = logger;
    }

    // GET: api/games/{id}
    [HttpGet("{id}")]
    public async Task<ActionResult<GameDto>> GetGame(Guid id)
    {
        if (id == Guid.Empty)
        {
            return BadRequest("Game ID cannot be empty");
        }

        try
        {
            _logger.LogInformation("Starting to retrieve game with ID: {GameId}", id);
            var game = await _gamesService.GetGameByIdAsync(id);
            _logger.LogInformation("Game retrieved successfully: {GameFound}", game != null);
            
            if (game == null)
            {
                return NotFound($"Game with ID {id} not found");
            }
            
            return Ok(game);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while retrieving game {GameId}. Exception type: {ExceptionType}, Message: {Message}", 
            id, ex.GetType().Name, ex.Message);
        return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }

    // GET: api/games/banners
    [HttpGet("banners")]
    public async Task<ActionResult<IEnumerable<BannerGameDto>>> GetBannerGames()
    {
        try
        {
            var bannerGames = await _gamesService.GetBannerGamesAsync();
            return Ok(bannerGames);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while retrieving banner games");
            return StatusCode(500, "Internal server error");
        }
    }

    // GET: api/games?type=special-offers&page=1&limit=20&sort=price_asc
    [HttpGet]
    public async Task<ActionResult<IEnumerable<GameDto>>> GetGames(
        [FromQuery] string type,
        [FromQuery] int page = 1,
        [FromQuery] int limit = 20,
        [FromQuery] string sort = "rating_desc"
    )
    {
        try
        {
            if (page < 1)
            {
                return BadRequest("Page number must be greater than 0");
            }

            if (limit < 1 || limit > 100)
            {
                return BadRequest("Limit must be between 1 and 100");
            }
            
            var validSortOptions = new[] { "price_asc", "price_desc", "release_date_desc", "rating_desc", "rating_asc" };
            if (!validSortOptions.Contains(sort))
            {
                return BadRequest($"Invalid sort option '{sort}'. Valid options: {string.Join(", ", validSortOptions)}");
            }
            
            if (type?.ToLower() == "recommended" && !User.Identity?.IsAuthenticated == true)
            {
                return Unauthorized("Для получения рекомендаций необходимо авторизоваться.");
            }

            object result;

            switch (type?.ToLower())
            {
                case "special-offers":
                    result = await _gamesService.GetSpecialOfferGamesAsync(page, limit, sort);
                    break;

                case "new-trending":
                    result = await _gamesService.GetNewAndTrendingGamesAsync(page, limit, sort);
                    break;

                case "bestsellers":
                    result = await _gamesService.GetBestsellerGamesAsync(page, limit, sort);
                    break;
                
                case "recommended":
                    var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                    if (string.IsNullOrEmpty(userId))
                    {
                        return BadRequest("User ID not found in token");
                    }
                    result = await _gamesService.GetRecommendedGamesAsync(userId, page, limit, sort);
                    break;

                case null:
                case "":
                    result = await _gamesService.GetBestsellerGamesAsync(page, limit, sort);
                    break;

                default:
                    return BadRequest($"Тип '{type}' не поддерживается. Доступные типы: special-offers, new-trending, bestsellers, recommended.");
            }

            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while retrieving games with type: {Type}, page: {Page}, limit: {Limit}, sort: {Sort}", 
                type, page, limit, sort);
            return StatusCode(500, "Internal server error");
        }
    }

    // GET: api/games/search?query=game&page=1&limit=20&sort=rating_desc
    [HttpGet("search")]
    public async Task<ActionResult<IEnumerable<GameDto>>> SearchGames(
        [FromQuery] string query,
        [FromQuery] int page = 1,
        [FromQuery] int limit = 20,
        [FromQuery] string sort = "rating_desc"
    )
    {
        if (string.IsNullOrWhiteSpace(query))
        {
            return BadRequest("Search query cannot be empty");
        }

        if (page < 1)
        {
            return BadRequest("Page number must be greater than 0");
        }

        if (limit < 1 || limit > 100)
        {
            return BadRequest("Limit must be between 1 and 100");
        }

        try
        {
            var games = await _gamesService.GetBestsellerGamesAsync(page, limit, sort);
            
            var filteredGames = games.Where(g => 
                g.Title.Contains(query, StringComparison.OrdinalIgnoreCase) ||
                g.Description.Contains(query, StringComparison.OrdinalIgnoreCase) ||
                g.Genres.Any(genre => genre.Contains(query, StringComparison.OrdinalIgnoreCase))
            );

            return Ok(filteredGames);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while searching games with query: {Query}", query);
            return StatusCode(500, "Internal server error");
        }
    }

    // GET: api/games/genres
    [HttpGet("genres")]
    public ActionResult<IEnumerable<string>> GetGenres()
    {
        try
        {
            var genres = new[] { "Action", "Adventure", "RPG", "Strategy", "Simulation", "Sports", "Racing", "Puzzle" };
            return Ok(genres);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while retrieving genres");
            return StatusCode(500, "Internal server error");
        }
    }

    // GET: api/games/platforms
    [HttpGet("platforms")]
    public ActionResult<IEnumerable<string>> GetPlatforms()
    {
        try
        {
            var platforms = new[] { "PC", "PS5", "Xbox Series X", "Nintendo Switch", "Mobile" };
            return Ok(platforms);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while retrieving platforms");
            return StatusCode(500, "Internal server error");
        }
    }
}