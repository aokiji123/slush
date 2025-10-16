using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using API.Models;
using Application.DTOs;
using Application.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;

namespace API.Controllers;

/// <summary>
/// Controller for managing games and game-related operations
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
[Consumes("application/json")]
public class GameController : ControllerBase
{
    private readonly IGameService _gameService;
    private readonly ILogger<GameController> _logger;
    private readonly IMemoryCache _cache;
    
    private const int CacheDurationSeconds = 300; // 5 minutes
    private const string CacheKeyPrefix = "GameController_";
    private static readonly TimeSpan CacheExpiration = TimeSpan.FromMinutes(5);

    public GameController(
        IGameService gameService,
        ILogger<GameController> logger,
        IMemoryCache cache)
    {
        _gameService = gameService ?? throw new ArgumentNullException(nameof(gameService));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        _cache = cache ?? throw new ArgumentNullException(nameof(cache));
    }

    [HttpGet("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    [ResponseCache(Duration = CacheDurationSeconds)]
    public async Task<ActionResult<ApiResponse<GameDto>>> GetGame(
        [FromRoute, Required] Guid id)
    {
        if (id == Guid.Empty)
        {
            return BadRequest(new ApiResponse<GameDto>("Game ID cannot be empty"));
        }
        var cacheKey = $"{CacheKeyPrefix}Game_{id}";
        if (_cache.TryGetValue(cacheKey, out GameDto? cachedGame))
        {
            _logger.LogInformation("Retrieved game {GameId} from cache", id);
            return Ok(new ApiResponse<GameDto>(cachedGame!));
        }

        try
        {
            _logger.LogInformation("Retrieving game with ID: {GameId}", id);
            var game = await _gameService.GetGameByIdAsync(id);
            
            if (game is null)
            {
                _logger.LogWarning("Game with ID {GameId} not found", id);
                return NotFound(new ApiResponse<GameDto>($"Game with ID {id} not found"));
            }
            
            // Cache the game data
            _cache.Set(cacheKey, game, CacheExpiration);
            
            _logger.LogInformation("Successfully retrieved game with ID: {GameId}", id);
            return Ok(new ApiResponse<GameDto>(game));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while retrieving game {GameId}", id);
            return StatusCode(StatusCodes.Status500InternalServerError, 
                new ApiResponse<GameDto>("An error occurred while retrieving the game."));
        }
    }

    /// <summary>
    /// Search games by filter criteria (genre, price, platform)
    /// </summary>
    /// <param name="genre">Genre filter</param>
    /// <param name="platform">Platform filter</param>
    /// <param name="priceUpperBound">Maximum price filter</param>
    /// <returns>List of games matching the search criteria with id, image, discount, price, sale_price, name</returns>
    [HttpGet("search")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    [ResponseCache(Duration = CacheDurationSeconds)]
    public async Task<ActionResult<ApiResponse<object>>> Search(
        [FromQuery] string? genre = null,
        [FromQuery] string? platform = null,
        [FromQuery] decimal? priceUpperBound = null)
    {
        var cacheKey = $"{CacheKeyPrefix}Search_g{genre}_p{platform}_price{priceUpperBound}";
        if (_cache.TryGetValue(cacheKey, out object? cachedGames))
        {
            return Ok(new ApiResponse<object>(cachedGames!));
        }

        try
        {
            _logger.LogInformation("Searching games with criteria: Genre={Genre}, Platform={Platform}, PriceUpperBound={PriceUpperBound}", 
                genre, platform, priceUpperBound);
                
            var games = await _gameService.SearchAsync(genre, platform, priceUpperBound);
            
            // Map to the required response format
            var result = games.Select(g => new
            {
                id = g.Id,
                image = g.MainImage,
                discount = g.DiscountPercent,
                price = g.Price,
                sale_price = g.SalePrice,
                name = g.Name
            });
            
            // Cache the results
            _cache.Set(cacheKey, result, CacheExpiration);
            
            return Ok(new ApiResponse<object>(result));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while searching games");
            return StatusCode(StatusCodes.Status500InternalServerError,
                new ApiResponse<object>("An error occurred while searching games."));
        }
    }

    /// <summary>
    /// Get games with discount > 0
    /// </summary>
    /// <returns>List of games with discounts</returns>
    [HttpGet("discount")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    [ResponseCache(Duration = CacheDurationSeconds)]
    public async Task<ActionResult<ApiResponse<IEnumerable<GameDto>>>> GetDiscount()
    {
        var cacheKey = $"{CacheKeyPrefix}Discounted";
        if (_cache.TryGetValue(cacheKey, out IEnumerable<GameDto>? cachedGames))
        {
            return Ok(new ApiResponse<IEnumerable<GameDto>>(cachedGames!));
        }

        try
        {
            _logger.LogInformation("Retrieving discounted games");
            var result = await _gameService.GetDiscountedAsync();
            
            // Cache the results
            _cache.Set(cacheKey, result, CacheExpiration);
            
            return Ok(new ApiResponse<IEnumerable<GameDto>>(result));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while retrieving discounted games");
            return StatusCode(StatusCodes.Status500InternalServerError,
                new ApiResponse<IEnumerable<GameDto>>("An error occurred while retrieving discounted games."));
        }
    }

    /// <summary>
    /// Get recommended games with rating >= 4 and price < 1000
    /// </summary>
    /// <returns>List of recommended games</returns>
    [HttpGet("recommended")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    [ResponseCache(Duration = CacheDurationSeconds)]
    public async Task<ActionResult<ApiResponse<IEnumerable<GameDto>>>> GetRecommended()
    {
        var cacheKey = $"{CacheKeyPrefix}Recommended";
        if (_cache.TryGetValue(cacheKey, out IEnumerable<GameDto>? cachedGames))
        {
            return Ok(new ApiResponse<IEnumerable<GameDto>>(cachedGames!));
        }

        try
        {
            _logger.LogInformation("Retrieving recommended games");
            var result = await _gameService.GetRecommendedAsync();
            
            // Cache the results
            _cache.Set(cacheKey, result, CacheExpiration);
            
            return Ok(new ApiResponse<IEnumerable<GameDto>>(result));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while retrieving recommended games");
            return StatusCode(StatusCodes.Status500InternalServerError,
                new ApiResponse<IEnumerable<GameDto>>("An error occurred while retrieving recommended games."));
        }
    }

    /// <summary>
    /// Get games with price less than specified amount
    /// </summary>
    /// <param name="price">Maximum price</param>
    /// <returns>List of games cheaper than the specified price</returns>
    [HttpGet("price/{price:decimal}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    [ResponseCache(Duration = CacheDurationSeconds)]
    public async Task<ActionResult<ApiResponse<IEnumerable<GameDto>>>> GetByPrice(
        [FromRoute, Required, Range(0, double.MaxValue)] decimal price)
    {
        var cacheKey = $"{CacheKeyPrefix}Price_{price}";
        if (_cache.TryGetValue(cacheKey, out IEnumerable<GameDto>? cachedGames))
        {
            return Ok(new ApiResponse<IEnumerable<GameDto>>(cachedGames!));
        }

        try
        {
            _logger.LogInformation("Retrieving games cheaper than {Price}", price);
            var result = await _gameService.GetCheaperThanAsync(price);
            
            // Cache the results
            _cache.Set(cacheKey, result, CacheExpiration);
            
            return Ok(new ApiResponse<IEnumerable<GameDto>>(result));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while retrieving games cheaper than {Price}", price);
            return StatusCode(StatusCodes.Status500InternalServerError,
                new ApiResponse<IEnumerable<GameDto>>("An error occurred while retrieving games."));
        }
    }

    /// <summary>
    /// Get hit games filtered by rating
    /// </summary>
    /// <returns>List of hit games</returns>
    [HttpGet("hits")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    [ResponseCache(Duration = CacheDurationSeconds)]
    public async Task<ActionResult<ApiResponse<IEnumerable<GameDto>>>> GetHits()
    {
        var cacheKey = $"{CacheKeyPrefix}Hits";
        if (_cache.TryGetValue(cacheKey, out IEnumerable<GameDto>? cachedGames))
        {
            return Ok(new ApiResponse<IEnumerable<GameDto>>(cachedGames!));
        }

        try
        {
            _logger.LogInformation("Retrieving hit games");
            var result = await _gameService.GetHitsAsync();
            
            // Cache the results
            _cache.Set(cacheKey, result, CacheExpiration);
            
            return Ok(new ApiResponse<IEnumerable<GameDto>>(result));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while retrieving hit games");
            return StatusCode(StatusCodes.Status500InternalServerError,
                new ApiResponse<IEnumerable<GameDto>>("An error occurred while retrieving hit games."));
        }
    }

    /// <summary>
    /// Get new games filtered by date
    /// </summary>
    /// <returns>List of new games</returns>
    [HttpGet("new")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    [ResponseCache(Duration = CacheDurationSeconds)]
    public async Task<ActionResult<ApiResponse<IEnumerable<GameDto>>>> GetNew()
    {
        var cacheKey = $"{CacheKeyPrefix}New";
        if (_cache.TryGetValue(cacheKey, out IEnumerable<GameDto>? cachedGames))
        {
            return Ok(new ApiResponse<IEnumerable<GameDto>>(cachedGames!));
        }

        try
        {
            _logger.LogInformation("Retrieving new games");
            var result = await _gameService.GetNewAsync();
            
            // Cache the results
            _cache.Set(cacheKey, result, CacheExpiration);
            
            return Ok(new ApiResponse<IEnumerable<GameDto>>(result));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while retrieving new games");
            return StatusCode(StatusCodes.Status500InternalServerError,
                new ApiResponse<IEnumerable<GameDto>>("An error occurred while retrieving new games."));
        }
    }

    /// <summary>
    /// Get free games with price = 0 and filtered by rating
    /// </summary>
    /// <returns>List of free games</returns>
    [HttpGet("free")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    [ResponseCache(Duration = CacheDurationSeconds)]
    public async Task<ActionResult<ApiResponse<IEnumerable<GameDto>>>> GetFree()
    {
        var cacheKey = $"{CacheKeyPrefix}Free";
        if (_cache.TryGetValue(cacheKey, out IEnumerable<GameDto>? cachedGames))
        {
            return Ok(new ApiResponse<IEnumerable<GameDto>>(cachedGames!));
        }

        try
        {
            _logger.LogInformation("Retrieving free games");
            var result = await _gameService.GetFreeAsync();
            
            // Cache the results
            _cache.Set(cacheKey, result, CacheExpiration);
            
            return Ok(new ApiResponse<IEnumerable<GameDto>>(result));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while retrieving free games");
            return StatusCode(StatusCodes.Status500InternalServerError,
                new ApiResponse<IEnumerable<GameDto>>("An error occurred while retrieving free games."));
        }
    }

    /// <summary>
    /// Get all DLCs of a specific game
    /// </summary>
    /// <param name="gameId">The unique identifier of the game</param>
    /// <returns>List of DLCs for the specified game</returns>
    [HttpGet("dlcs/{gameId:guid}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    [ResponseCache(Duration = CacheDurationSeconds)]
    public async Task<ActionResult<ApiResponse<IEnumerable<GameDto>>>> GetDlcs(
        [FromRoute, Required] Guid gameId)
    {
        if (gameId == Guid.Empty)
        {
            return BadRequest(new ApiResponse<IEnumerable<GameDto>>("Game ID cannot be empty"));
        }

        var cacheKey = $"{CacheKeyPrefix}Dlcs_{gameId}";
        if (_cache.TryGetValue(cacheKey, out IEnumerable<GameDto>? cachedDlcs))
        {
            _logger.LogInformation("Retrieved DLCs for game {GameId} from cache", gameId);
            return Ok(new ApiResponse<IEnumerable<GameDto>>(cachedDlcs!));
        }

        try
        {
            _logger.LogInformation("Retrieving DLCs for game with ID: {GameId}", gameId);
            var result = await _gameService.GetDlcsByGameIdAsync(gameId);
            
            // Cache the results
            _cache.Set(cacheKey, result, CacheExpiration);
            
            _logger.LogInformation("Successfully retrieved {Count} DLCs for game with ID: {GameId}", result.Count(), gameId);
            return Ok(new ApiResponse<IEnumerable<GameDto>>(result));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while retrieving DLCs for game {GameId}", gameId);
            return StatusCode(StatusCodes.Status500InternalServerError,
                new ApiResponse<IEnumerable<GameDto>>("An error occurred while retrieving DLCs."));
        }
    }


    /// <summary>
    /// Get game characteristics by game id
    /// </summary>
    /// <param name="gameId">The unique identifier of the game</param>
    /// <returns>Returns the technical characteristics for the specified game</returns>
    [HttpGet("{gameId:guid}/characteristics")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    [ResponseCache(Duration = CacheDurationSeconds)]
    public async Task<ActionResult<ApiResponse<GameCharacteristicDto>>> GetCharacteristics([FromRoute] Guid gameId)
    {
        if (gameId == Guid.Empty)
        {
            return BadRequest(new ApiResponse<GameCharacteristicDto>("Game ID cannot be empty"));
        }

        var cacheKey = $"{CacheKeyPrefix}Characteristics_{gameId}";
        if (_cache.TryGetValue(cacheKey, out GameCharacteristicDto? cachedCharacteristics))
        {
            return Ok(new ApiResponse<GameCharacteristicDto>(cachedCharacteristics!));
        }

        try
        {
            var characteristics = await _gameService.GetGameCharacteristicsAsync(gameId);

            if (characteristics is null)
            {
                return NotFound(new ApiResponse<GameCharacteristicDto>($"Characteristics for game {gameId} not found"));
            }

            _cache.Set(cacheKey, characteristics, CacheExpiration);

            return Ok(new ApiResponse<GameCharacteristicDto>(characteristics));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while retrieving characteristics for game {GameId}", gameId);
            return StatusCode(StatusCodes.Status500InternalServerError,
                new ApiResponse<GameCharacteristicDto>("An error occurred while retrieving game characteristics."));
        }
    }

    /// <summary>
    /// Get all games from the database
    /// </summary>
    /// <returns>List of all games</returns>
    [HttpGet("all")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    [ResponseCache(Duration = CacheDurationSeconds)]
    public async Task<ActionResult<ApiResponse<IEnumerable<GameDto>>>> GetAllGames()
    {
        var cacheKey = $"{CacheKeyPrefix}All";
        if (_cache.TryGetValue(cacheKey, out IEnumerable<GameDto>? cachedGames))
        {
            return Ok(new ApiResponse<IEnumerable<GameDto>>(cachedGames!));
        }

        try
        {
            _logger.LogInformation("Retrieving all games");
            var result = await _gameService.SearchAsync(null, null, null); // Return all games, unfiltered

            _cache.Set(cacheKey, result, CacheExpiration);

            return Ok(new ApiResponse<IEnumerable<GameDto>>(result));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while retrieving all games");
            return StatusCode(StatusCodes.Status500InternalServerError,
                new ApiResponse<IEnumerable<GameDto>>("An error occurred while retrieving all games."));
        }
    }
}