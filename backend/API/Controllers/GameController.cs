using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using API.Models;
using Application.Common.Query;
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

    /// <summary>
    /// Extracts and normalizes the language from Accept-Language header
    /// </summary>
    /// <returns>Normalized language code (uk, en) with uk as default</returns>
    private string ExtractLanguageFromHeader()
    {
        var acceptLanguage = HttpContext.Request.Headers["Accept-Language"]
            .ToString().Split(',').FirstOrDefault()?.Split('-').FirstOrDefault() ?? "uk";
        
        return acceptLanguage.ToLower() switch
        {
            "en" => "en",
            "uk" or "ua" => "uk",
            _ => "uk" // Default fallback to Ukrainian
        };
    }

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

        // Extract language from Accept-Language header
        var language = ExtractLanguageFromHeader();
        var cacheKey = $"{CacheKeyPrefix}Game_{id}_{language}";
        
        if (_cache.TryGetValue(cacheKey, out GameDto? cachedGame))
        {
            _logger.LogInformation("Retrieved game {GameId} in language {Language} from cache", id, language);
            return Ok(new ApiResponse<GameDto>(cachedGame!));
        }

        try
        {
            _logger.LogInformation("Retrieving game with ID: {GameId} in language: {Language}", id, language);
            var game = await _gameService.GetGameByIdAsync(id, language);
            
            if (game is null)
            {
                _logger.LogWarning("Game with ID {GameId} not found", id);
                return NotFound(new ApiResponse<GameDto>($"Game with ID {id} not found"));
            }
            
            // Cache the game data with language-specific key
            _cache.Set(cacheKey, game, CacheExpiration);
            
            _logger.LogInformation("Successfully retrieved game with ID: {GameId} in language: {Language}", id, language);
            return Ok(new ApiResponse<GameDto>(game));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while retrieving game {GameId} in language {Language}", id, language);
            return StatusCode(StatusCodes.Status500InternalServerError, 
                new ApiResponse<GameDto>("An error occurred while retrieving the game."));
        }
    }

    [HttpGet("{identifier}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    [ResponseCache(Duration = CacheDurationSeconds)]
    public async Task<ActionResult<ApiResponse<GameDto>>> GetGameBySlug(
        [FromRoute, Required] string identifier)
    {
        if (string.IsNullOrWhiteSpace(identifier))
        {
            return BadRequest(new ApiResponse<GameDto>("Game identifier cannot be empty"));
        }

        // Extract language from Accept-Language header
        var language = ExtractLanguageFromHeader();
        var cacheKey = $"{CacheKeyPrefix}Game_Slug_{identifier}_{language}";
        
        if (_cache.TryGetValue(cacheKey, out GameDto? cachedGame))
        {
            _logger.LogInformation("Retrieved game {Identifier} in language {Language} from cache", identifier, language);
            return Ok(new ApiResponse<GameDto>(cachedGame!));
        }

        try
        {
            _logger.LogInformation("Retrieving game with identifier: {Identifier} in language: {Language}", identifier, language);
            var game = await _gameService.GetGameBySlugAsync(identifier, language);
            
            if (game is null)
            {
                _logger.LogWarning("Game with identifier {Identifier} not found", identifier);
                return NotFound(new ApiResponse<GameDto>($"Game with identifier {identifier} not found"));
            }
            
            // Cache the game data with language-specific key
            _cache.Set(cacheKey, game, CacheExpiration);
            
            _logger.LogInformation("Successfully retrieved game with identifier: {Identifier} in language: {Language}", identifier, language);
            return Ok(new ApiResponse<GameDto>(game));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while retrieving game {Identifier} in language {Language}", identifier, language);
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
        var language = ExtractLanguageFromHeader();
        var cacheKey = $"{CacheKeyPrefix}Search_g{genre}_p{platform}_price{priceUpperBound}_{language}";
        if (_cache.TryGetValue(cacheKey, out object? cachedGames))
        {
            return Ok(new ApiResponse<object>(cachedGames!));
        }

        try
        {
            _logger.LogInformation("Searching games with criteria: Genre={Genre}, Platform={Platform}, PriceUpperBound={PriceUpperBound}, Language={Language}", 
                genre, platform, priceUpperBound, language);
                
            var games = await _gameService.SearchAsync(genre, platform, priceUpperBound, language);
            
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
            
            // Cache the results with language-specific key
            _cache.Set(cacheKey, result, CacheExpiration);
            
            _logger.LogInformation("Found {Count} games matching search criteria in language {Language}", result.Count(), language);
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
        var language = ExtractLanguageFromHeader();
        var cacheKey = $"{CacheKeyPrefix}Discounted_{language}";
        if (_cache.TryGetValue(cacheKey, out IEnumerable<GameDto>? cachedGames))
        {
            return Ok(new ApiResponse<IEnumerable<GameDto>>(cachedGames!));
        }

        try
        {
            _logger.LogInformation("Retrieving discounted games in language {Language}", language);
            var result = await _gameService.GetDiscountedAsync(language);
            
            // Cache the results with language-specific key
            _cache.Set(cacheKey, result, CacheExpiration);
            
            _logger.LogInformation("Successfully retrieved {Count} discounted games in language {Language}", result.Count(), language);
            return Ok(new ApiResponse<IEnumerable<GameDto>>(result));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while retrieving discounted games in language {Language}", language);
            return StatusCode(StatusCodes.Status500InternalServerError,
                new ApiResponse<IEnumerable<GameDto>>("An error occurred while retrieving discounted games."));
        }
    }

    /// <summary>
    /// Get recommended games with rating &gt;= 4 and price &lt; 1000
    /// </summary>
    /// <returns>List of recommended games</returns>
    [HttpGet("recommended")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    [ResponseCache(Duration = CacheDurationSeconds)]
    public async Task<ActionResult<ApiResponse<IEnumerable<GameDto>>>> GetRecommended()
    {
        var language = ExtractLanguageFromHeader();
        var cacheKey = $"{CacheKeyPrefix}Recommended_{language}";
        if (_cache.TryGetValue(cacheKey, out IEnumerable<GameDto>? cachedGames))
        {
            return Ok(new ApiResponse<IEnumerable<GameDto>>(cachedGames!));
        }

        try
        {
            _logger.LogInformation("Retrieving recommended games in language {Language}", language);
            var result = await _gameService.GetRecommendedAsync(language);
            
            // Cache the results with language-specific key
            _cache.Set(cacheKey, result, CacheExpiration);
            
            _logger.LogInformation("Successfully retrieved {Count} recommended games in language {Language}", result.Count(), language);
            return Ok(new ApiResponse<IEnumerable<GameDto>>(result));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while retrieving recommended games in language {Language}", language);
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
        var language = ExtractLanguageFromHeader();
        var cacheKey = $"{CacheKeyPrefix}Price_{price}_{language}";
        if (_cache.TryGetValue(cacheKey, out IEnumerable<GameDto>? cachedGames))
        {
            return Ok(new ApiResponse<IEnumerable<GameDto>>(cachedGames!));
        }

        try
        {
            _logger.LogInformation("Retrieving games cheaper than {Price} in language {Language}", price, language);
            var result = await _gameService.GetCheaperThanAsync(price, language);
            
            // Cache the results with language-specific key
            _cache.Set(cacheKey, result, CacheExpiration);
            
            _logger.LogInformation("Successfully retrieved {Count} games cheaper than {Price} in language {Language}", result.Count(), price, language);
            return Ok(new ApiResponse<IEnumerable<GameDto>>(result));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while retrieving games cheaper than {Price} in language {Language}", price, language);
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
        var language = ExtractLanguageFromHeader();
        var cacheKey = $"{CacheKeyPrefix}Hits_{language}";
        if (_cache.TryGetValue(cacheKey, out IEnumerable<GameDto>? cachedGames))
        {
            return Ok(new ApiResponse<IEnumerable<GameDto>>(cachedGames!));
        }

        try
        {
            _logger.LogInformation("Retrieving hit games in language {Language}", language);
            var result = await _gameService.GetHitsAsync(language);
            
            // Cache the results with language-specific key
            _cache.Set(cacheKey, result, CacheExpiration);
            
            _logger.LogInformation("Successfully retrieved {Count} hit games in language {Language}", result.Count(), language);
            return Ok(new ApiResponse<IEnumerable<GameDto>>(result));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while retrieving hit games in language {Language}", language);
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
        var language = ExtractLanguageFromHeader();
        var cacheKey = $"{CacheKeyPrefix}New_{language}";
        if (_cache.TryGetValue(cacheKey, out IEnumerable<GameDto>? cachedGames))
        {
            return Ok(new ApiResponse<IEnumerable<GameDto>>(cachedGames!));
        }

        try
        {
            _logger.LogInformation("Retrieving new games in language {Language}", language);
            var result = await _gameService.GetNewAsync(language);
            
            // Cache the results with language-specific key
            _cache.Set(cacheKey, result, CacheExpiration);
            
            _logger.LogInformation("Successfully retrieved {Count} new games in language {Language}", result.Count(), language);
            return Ok(new ApiResponse<IEnumerable<GameDto>>(result));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while retrieving new games in language {Language}", language);
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
        var language = ExtractLanguageFromHeader();
        var cacheKey = $"{CacheKeyPrefix}Free_{language}";
        if (_cache.TryGetValue(cacheKey, out IEnumerable<GameDto>? cachedGames))
        {
            return Ok(new ApiResponse<IEnumerable<GameDto>>(cachedGames!));
        }

        try
        {
            _logger.LogInformation("Retrieving free games in language {Language}", language);
            var result = await _gameService.GetFreeAsync(language);
            
            // Cache the results with language-specific key
            _cache.Set(cacheKey, result, CacheExpiration);
            
            _logger.LogInformation("Successfully retrieved {Count} free games in language {Language}", result.Count(), language);
            return Ok(new ApiResponse<IEnumerable<GameDto>>(result));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while retrieving free games in language {Language}", language);
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

        var language = ExtractLanguageFromHeader();
        var cacheKey = $"{CacheKeyPrefix}Dlcs_{gameId}_{language}";
        if (_cache.TryGetValue(cacheKey, out IEnumerable<GameDto>? cachedDlcs))
        {
            _logger.LogInformation("Retrieved DLCs for game {GameId} in language {Language} from cache", gameId, language);
            return Ok(new ApiResponse<IEnumerable<GameDto>>(cachedDlcs!));
        }

        try
        {
            _logger.LogInformation("Retrieving DLCs for game with ID: {GameId} in language {Language}", gameId, language);
            var result = await _gameService.GetDlcsByGameIdAsync(gameId, language);
            
            // Cache the results with language-specific key
            _cache.Set(cacheKey, result, CacheExpiration);
            
            _logger.LogInformation("Successfully retrieved {Count} DLCs for game with ID: {GameId} in language {Language}", result.Count(), gameId, language);
            return Ok(new ApiResponse<IEnumerable<GameDto>>(result));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while retrieving DLCs for game {GameId} in language {Language}", gameId, language);
            return StatusCode(StatusCodes.Status500InternalServerError,
                new ApiResponse<IEnumerable<GameDto>>("An error occurred while retrieving DLCs."));
        }
    }

    /// <summary>
    /// Get all DLCs of a specific game by slug
    /// </summary>
    /// <param name="slug">The slug identifier of the game</param>
    /// <returns>List of DLCs for the specified game</returns>
    [HttpGet("dlcs/slug/{slug}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    [ResponseCache(Duration = CacheDurationSeconds)]
    public async Task<ActionResult<ApiResponse<IEnumerable<GameDto>>>> GetDlcsBySlug(
        [FromRoute, Required] string slug)
    {
        if (string.IsNullOrWhiteSpace(slug))
        {
            return BadRequest(new ApiResponse<IEnumerable<GameDto>>("Game slug cannot be empty"));
        }

        var language = ExtractLanguageFromHeader();
        var cacheKey = $"{CacheKeyPrefix}Dlcs_Slug_{slug}_{language}";
        if (_cache.TryGetValue(cacheKey, out IEnumerable<GameDto>? cachedDlcs))
        {
            _logger.LogInformation("Retrieved DLCs for game {Slug} in language {Language} from cache", slug, language);
            return Ok(new ApiResponse<IEnumerable<GameDto>>(cachedDlcs!));
        }

        try
        {
            _logger.LogInformation("Retrieving DLCs for game with slug: {Slug} in language {Language}", slug, language);
            var result = await _gameService.GetDlcsByGameSlugAsync(slug, language);
            
            // Cache the results with language-specific key
            _cache.Set(cacheKey, result, CacheExpiration);
            
            _logger.LogInformation("Successfully retrieved {Count} DLCs for game with slug: {Slug} in language {Language}", result.Count(), slug, language);
            return Ok(new ApiResponse<IEnumerable<GameDto>>(result));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while retrieving DLCs for game {Slug} in language {Language}", slug, language);
            return StatusCode(StatusCodes.Status500InternalServerError,
                new ApiResponse<IEnumerable<GameDto>>("An error occurred while retrieving DLCs."));
        }
    }

    /// <summary>
    /// Get base game for a DLC
    /// </summary>
    /// <param name="id">The unique identifier of the DLC</param>
    /// <returns>Base game information</returns>
    [HttpGet("{id:guid}/base-game")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    [ResponseCache(Duration = CacheDurationSeconds)]
    public async Task<ActionResult<ApiResponse<GameDto>>> GetBaseGame(
        [FromRoute, Required] Guid id)
    {
        if (id == Guid.Empty)
        {
            return BadRequest(new ApiResponse<GameDto>("Game ID cannot be empty"));
        }

        // Extract language from Accept-Language header
        var language = ExtractLanguageFromHeader();
        var cacheKey = $"{CacheKeyPrefix}BaseGame_{id}_{language}";
        
        if (_cache.TryGetValue(cacheKey, out GameDto? cachedBaseGame))
        {
            _logger.LogInformation("Retrieved base game for DLC {DlcId} in language {Language} from cache", id, language);
            return Ok(new ApiResponse<GameDto>(cachedBaseGame!));
        }

        try
        {
            _logger.LogInformation("Retrieving base game for DLC with ID: {DlcId} in language: {Language}", id, language);
            var baseGame = await _gameService.GetBaseGameAsync(id, language);
            
            if (baseGame == null)
            {
                _logger.LogWarning("No base game found for DLC with ID {DlcId}", id);
                return NotFound(new ApiResponse<GameDto>("Base game not found for this DLC"));
            }
            
            // Cache the base game data with language-specific key
            _cache.Set(cacheKey, baseGame, CacheExpiration);
            
            _logger.LogInformation("Successfully retrieved base game for DLC with ID: {DlcId} in language: {Language}", id, language);
            return Ok(new ApiResponse<GameDto>(baseGame));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while retrieving base game for DLC {DlcId} in language {Language}", id, language);
            return StatusCode(StatusCodes.Status500InternalServerError,
                new ApiResponse<GameDto>("An error occurred while retrieving the base game."));
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
    public async Task<ActionResult<ApiResponse<List<GameCharacteristicDto>>>> GetCharacteristics([FromRoute] Guid gameId)
    {
        if (gameId == Guid.Empty)
        {
            return BadRequest(new ApiResponse<List<GameCharacteristicDto>>("Game ID cannot be empty"));
        }

        var cacheKey = $"{CacheKeyPrefix}Characteristics_{gameId}";
        if (_cache.TryGetValue(cacheKey, out List<GameCharacteristicDto>? cachedCharacteristics))
        {
            return Ok(new ApiResponse<List<GameCharacteristicDto>>(cachedCharacteristics!));
        }

        try
        {
            var characteristics = await _gameService.GetGameCharacteristicsAsync(gameId);

            if (characteristics == null || !characteristics.Any())
            {
                return NotFound(new ApiResponse<List<GameCharacteristicDto>>($"Characteristics for game {gameId} not found"));
            }

            _cache.Set(cacheKey, characteristics, CacheExpiration);

            return Ok(new ApiResponse<List<GameCharacteristicDto>>(characteristics));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while retrieving characteristics for game {GameId}", gameId);
            return StatusCode(StatusCodes.Status500InternalServerError,
                new ApiResponse<List<GameCharacteristicDto>>("An error occurred while retrieving game characteristics."));
        }
    }
    
    /// <summary>
    /// Get all platform information for a game (PC specs + console features)
    /// </summary>
    /// <param name="identifier">Game slug or GUID</param>
    /// <returns>Returns PC characteristics and console features for the specified game</returns>
    [HttpGet("{identifier}/platforms")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    [ResponseCache(Duration = CacheDurationSeconds)]
    public async Task<ActionResult<ApiResponse<GamePlatformInfoDto>>> GetGamePlatforms([FromRoute] string identifier)
    {
        var cacheKey = $"{CacheKeyPrefix}Platforms_{identifier}";
        if (_cache.TryGetValue(cacheKey, out GamePlatformInfoDto? cachedPlatforms))
        {
            return Ok(new ApiResponse<GamePlatformInfoDto>(cachedPlatforms!));
        }

        try
        {
            var platformInfo = await _gameService.GetGamePlatformInfoAsync(identifier);

            if (platformInfo == null)
            {
                return NotFound(new ApiResponse<GamePlatformInfoDto>($"Game with identifier '{identifier}' not found"));
            }

            _cache.Set(cacheKey, platformInfo, CacheExpiration);

            return Ok(new ApiResponse<GamePlatformInfoDto>(platformInfo));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while retrieving platform info for game {Identifier}", identifier);
            return StatusCode(StatusCodes.Status500InternalServerError,
                new ApiResponse<GamePlatformInfoDto>("An error occurred while retrieving game platform information."));
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
        var language = ExtractLanguageFromHeader();
        var cacheKey = $"{CacheKeyPrefix}All_{language}";
        if (_cache.TryGetValue(cacheKey, out IEnumerable<GameDto>? cachedGames))
        {
            return Ok(new ApiResponse<IEnumerable<GameDto>>(cachedGames!));
        }

        try
        {
            _logger.LogInformation("Retrieving all games in language {Language}", language);
            var result = await _gameService.SearchAsync(null, null, null, language); // Return all games, unfiltered

            // Cache the results with language-specific key
            _cache.Set(cacheKey, result, CacheExpiration);

            _logger.LogInformation("Successfully retrieved {Count} games in language {Language}", result.Count(), language);
            return Ok(new ApiResponse<IEnumerable<GameDto>>(result));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while retrieving all games in language {Language}", language);
            return StatusCode(StatusCodes.Status500InternalServerError,
                new ApiResponse<IEnumerable<GameDto>>("An error occurred while retrieving all games."));
        }
    }

    /// <summary>
    /// Get games with advanced filtering, sorting, and pagination
    /// </summary>
    /// <param name="search">Search term for game name, description, developer, or publisher</param>
    /// <param name="genres">Comma-separated list of genres to filter by</param>
    /// <param name="platforms">Comma-separated list of platforms to filter by</param>
    /// <param name="minPrice">Minimum price filter</param>
    /// <param name="maxPrice">Maximum price filter</param>
    /// <param name="onSale">Filter by games on sale</param>
    /// <param name="isDlc">Filter by DLC games</param>
    /// <param name="page">Page number (1-based)</param>
    /// <param name="limit">Items per page</param>
    /// <param name="sortBy">Sort field and direction (e.g., "Price:desc", "Name:asc")</param>
    /// <returns>Paginated list of games matching the filter criteria</returns>
    [HttpGet("filter")]
    [ProducesResponseType(typeof(ApiResponse<PagedResult<GameDto>>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<PagedResult<GameDto>>), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ApiResponse<PagedResult<GameDto>>), StatusCodes.Status500InternalServerError)]
    [ResponseCache(Duration = CacheDurationSeconds)]
    public async Task<ActionResult<ApiResponse<PagedResult<GameDto>>>> GetGamesByFilter(
        [FromQuery] string? search = null,
        [FromQuery] string? genres = null,
        [FromQuery] string? platforms = null,
        [FromQuery] decimal? minPrice = null,
        [FromQuery] decimal? maxPrice = null,
        [FromQuery] bool? onSale = null,
        [FromQuery] bool? isDlc = null,
        [FromQuery] int page = 1,
        [FromQuery] int limit = 20,
        [FromQuery] string? sortBy = null)
    {
        var language = ExtractLanguageFromHeader();
        var cacheKey = $"{CacheKeyPrefix}Filter_s{search}_g{genres}_p{platforms}_min{minPrice}_max{maxPrice}_sale{onSale}_dlc{isDlc}_pg{page}_l{limit}_s{sortBy}_{language}";
        
        if (_cache.TryGetValue(cacheKey, out PagedResult<GameDto>? cachedResult))
        {
            return Ok(new ApiResponse<PagedResult<GameDto>>(cachedResult!));
        }

        try
        {
            _logger.LogInformation("Received filter request: Search='{Search}', Page={Page}, Limit={Limit}, Language={Language}", 
                search, page, limit, language);

            var request = new GamesFilterRequestDto
            {
                Page = page,
                Limit = limit,
                SortBy = sortBy,
                Search = search,
                MinPrice = minPrice,
                MaxPrice = maxPrice,
                OnSale = onSale,
                IsDlc = isDlc
            };

            // Parse comma-separated values
            if (!string.IsNullOrWhiteSpace(genres))
            {
                request.Genres = genres.Split(',', StringSplitOptions.RemoveEmptyEntries)
                    .Select(g => g.Trim())
                    .ToList();
            }

            if (!string.IsNullOrWhiteSpace(platforms))
            {
                request.Platforms = platforms.Split(',', StringSplitOptions.RemoveEmptyEntries)
                    .Select(p => p.Trim())
                    .ToList();
            }

            _logger.LogInformation("Filtering games with search '{Search}' in language {Language}", search, language);
            var result = await _gameService.GetGamesByFilterAsync(request, language);
            
            // Cache the results with language-specific key
            _cache.Set(cacheKey, result, CacheExpiration);
            
            _logger.LogInformation("Found {Count} games matching filter criteria in language {Language}", result.TotalCount, language);
            return Ok(new ApiResponse<PagedResult<GameDto>>(result));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while filtering games. Search='{Search}', Language={Language}", search, language);
            return StatusCode(StatusCodes.Status500InternalServerError,
                new ApiResponse<PagedResult<GameDto>>($"An error occurred while filtering games: {ex.Message}"));
        }
    }

    /// <summary>
    /// Handle community requests - redirects to community controller
    /// This endpoint exists to handle cases where the frontend calls /game/community
    /// </summary>
    /// <returns>BadRequest indicating the correct endpoint to use</returns>
    [HttpGet("community")]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public ActionResult<ApiResponse<object>> GetCommunity()
    {
        _logger.LogWarning("Received request to /game/community - this should be handled by /community controller");
        return BadRequest(new ApiResponse<object>("Community requests should be made to /api/community endpoints. Please use the correct community API endpoints."));
    }
}