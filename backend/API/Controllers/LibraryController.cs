using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using API.Models;
using Application.Common.Query;
using Application.DTOs;
using Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
[Authorize]
public class LibraryController : ControllerBase
{
    private readonly ILibraryService _libraryService;
    private readonly ILogger<LibraryController> _logger;

    public LibraryController(ILibraryService libraryService, ILogger<LibraryController> logger)
    {
        _libraryService = libraryService ?? throw new ArgumentNullException(nameof(libraryService));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    /// <summary>
    /// Get authenticated user's owned games with basic pagination (legacy endpoint)
    /// </summary>
    /// <param name="page">Page number (1-based)</param>
    /// <param name="limit">Items per page</param>
    /// <returns>Paginated list of owned games</returns>
    [HttpGet("owned")]
    [ProducesResponseType(typeof(PagedResult<OwnedGameDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> GetOwned([FromQuery] int page = 1, [FromQuery] int limit = 20)
    {
        try
        {
            var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var parameters = new LibraryQueryParameters { Page = page, Limit = limit };
            var items = await _libraryService.GetOwnedAsync(userId, parameters);
            return Ok(items);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to retrieve owned games for authenticated user");
            return StatusCode(StatusCodes.Status500InternalServerError, new ApiResponse<PagedResult<OwnedGameDto>>("Unable to retrieve owned games."));
        }
    }

    /// <summary>
    /// Get authenticated user's library games
    /// </summary>
    /// <returns>List of library games</returns>
    [HttpGet("me")]
    [ProducesResponseType(typeof(ApiResponse<IEnumerable<GameDto>>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<IEnumerable<GameDto>>), StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<ApiResponse<IEnumerable<GameDto>>>> GetMyLibrary()
    {
        try
        {
            var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var games = await _libraryService.GetLibraryGamesAsync(userId);
            return Ok(new ApiResponse<IEnumerable<GameDto>>(games));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to retrieve library for authenticated user");
            return StatusCode(StatusCodes.Status500InternalServerError, new ApiResponse<IEnumerable<GameDto>>("Unable to retrieve library."));
        }
    }

    /// <summary>
    /// Get authenticated user's library games with query parameters for filtering, sorting, and pagination
    /// </summary>
    /// <param name="page">Page number (1-based)</param>
    /// <param name="limit">Items per page</param>
    /// <param name="sortBy">Sort field and direction (e.g., "Price:desc", "Name:asc")</param>
    /// <param name="sortDirection">Sort direction (asc/desc) - used when sortBy has no inline direction</param>
    /// <param name="search">Search term for game name, developer, publisher, or description</param>
    /// <param name="genres">Filter by genres (comma-separated)</param>
    /// <param name="platforms">Filter by platforms (comma-separated)</param>
    /// <param name="minPrice">Minimum price filter</param>
    /// <param name="maxPrice">Maximum price filter</param>
    /// <param name="onSale">Filter by games on sale</param>
    /// <param name="isDlc">Filter by DLC games</param>
    /// <returns>Paginated list of library games</returns>
    [HttpGet("me/query")]
    [ProducesResponseType(typeof(ApiResponse<PagedResult<GameDto>>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<PagedResult<GameDto>>), StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<ApiResponse<PagedResult<GameDto>>>> GetMyLibraryWithQuery(
        [FromQuery] int page = 1,
        [FromQuery] int limit = 20,
        [FromQuery] string? sortBy = null,
        [FromQuery] string? sortDirection = null,
        [FromQuery] string? search = null,
        [FromQuery] string? genres = null,
        [FromQuery] string? platforms = null,
        [FromQuery] decimal? minPrice = null,
        [FromQuery] decimal? maxPrice = null,
        [FromQuery] bool? onSale = null,
        [FromQuery] bool? isDlc = null)
    {
        try
        {
            var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var parameters = new LibraryQueryParameters
            {
                Page = page,
                Limit = limit,
                SortBy = sortBy,
                SortDirection = sortDirection,
                Search = search,
                MinPrice = minPrice,
                MaxPrice = maxPrice,
                OnSale = onSale,
                IsDlc = isDlc
            };

            // Resolve language from Accept-Language header (e.g., "uk-UA" -> "uk")
            var langHeader = Request.Headers["Accept-Language"].ToString();
            if (!string.IsNullOrWhiteSpace(langHeader))
            {
                var code = langHeader.Split(',')[0].Trim();
                if (!string.IsNullOrWhiteSpace(code) && code.Length >= 2)
                {
                    parameters.Language = code[..2].ToLowerInvariant();
                }
            }

            // Parse comma-separated values
            if (!string.IsNullOrWhiteSpace(genres))
            {
                parameters.Genres = genres.Split(',', StringSplitOptions.RemoveEmptyEntries)
                    .Select(g => g.Trim())
                    .ToList();
            }

            if (!string.IsNullOrWhiteSpace(platforms))
            {
                parameters.Platforms = platforms.Split(',', StringSplitOptions.RemoveEmptyEntries)
                    .Select(p => p.Trim())
                    .ToList();
            }

            var result = await _libraryService.GetLibraryGamesAsync(userId, parameters);
            return Ok(new ApiResponse<PagedResult<GameDto>>(result));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to retrieve paginated library for authenticated user");
            return StatusCode(StatusCodes.Status500InternalServerError, new ApiResponse<PagedResult<GameDto>>("Unable to retrieve library."));
        }
    }

    /// <summary>
    /// Check if authenticated user owns a specific game
    /// </summary>
    /// <param name="gameId">Game ID to check</param>
    /// <returns>True if user owns the game, false otherwise</returns>
    [HttpGet("me/ownership/{gameId:guid}")]
    [ProducesResponseType(typeof(ApiResponse<bool>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<bool>), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ApiResponse<bool>), StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<ApiResponse<bool>>> CheckMyOwnership([FromRoute, Required] Guid gameId)
    {
        if (gameId == Guid.Empty)
        {
            return BadRequest(new ApiResponse<bool>("Game ID cannot be empty."));
        }

        try
        {
            var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var owns = await _libraryService.IsInLibraryAsync(userId, gameId);
            return Ok(new ApiResponse<bool>(owns));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to check ownership for authenticated user and game {GameId}", gameId);
            return StatusCode(StatusCodes.Status500InternalServerError, new ApiResponse<bool>("Unable to check ownership."));
        }
    }

    /// <summary>
    /// Add game to authenticated user's library
    /// </summary>
    /// <param name="request">Request containing game ID</param>
    /// <returns>Success status</returns>
    [HttpPost("me")]
    [ProducesResponseType(typeof(ApiResponse<bool>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<bool>), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ApiResponse<bool>), StatusCodes.Status409Conflict)]
    [ProducesResponseType(typeof(ApiResponse<bool>), StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<ApiResponse<bool>>> AddToMyLibrary([FromBody] LibraryMeRequestDto request)
    {
        if (request is null)
        {
            return BadRequest(new ApiResponse<bool>("Request body is required."));
        }

        if (request.GameId == Guid.Empty)
        {
            return BadRequest(new ApiResponse<bool>("Game ID is required."));
        }

        try
        {
            var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var dto = new AddToLibraryDto
            {
                UserId = userId,
                GameId = request.GameId
            };

            var result = await _libraryService.AddToLibraryAsync(dto);

            var response = new ApiResponse<bool>(true)
            {
                Message = "Game added to library."
            };
            return Ok(response);
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new ApiResponse<bool>(ex.Message));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to add game {GameId} to library for authenticated user", request.GameId);
            return StatusCode(StatusCodes.Status500InternalServerError, new ApiResponse<bool>("Unable to add to library."));
        }
    }

    /// <summary>
    /// Get user's library games by user ID
    /// </summary>
    /// <param name="userId">User ID</param>
    /// <returns>List of library games</returns>
    [HttpGet("{userId:guid}")]
    [ProducesResponseType(typeof(ApiResponse<IEnumerable<GameDto>>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<IEnumerable<GameDto>>), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ApiResponse<IEnumerable<GameDto>>), StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<ApiResponse<IEnumerable<GameDto>>>> GetLibrary([FromRoute, Required] Guid userId)
    {
        if (userId == Guid.Empty)
        {
            return BadRequest(new ApiResponse<IEnumerable<GameDto>>("User ID cannot be empty."));
        }

        try
        {
            var games = await _libraryService.GetLibraryGamesAsync(userId);
            return Ok(new ApiResponse<IEnumerable<GameDto>>(games));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to retrieve library for user {UserId}", userId);
            return StatusCode(StatusCodes.Status500InternalServerError, new ApiResponse<IEnumerable<GameDto>>("Unable to retrieve library."));
        }
    }

    /// <summary>
    /// Get library games with query parameters for filtering, sorting, and pagination
    /// </summary>
    /// <param name="userId">User ID</param>
    /// <param name="page">Page number (1-based)</param>
    /// <param name="limit">Items per page</param>
    /// <param name="sortBy">Sort field and direction (e.g., "Price:desc", "Name:asc")</param>
    /// <param name="sortDirection">Sort direction (asc/desc) - used when sortBy has no inline direction</param>
    /// <param name="search">Search term for game name, developer, publisher, or description</param>
    /// <param name="genres">Filter by genres (comma-separated)</param>
    /// <param name="platforms">Filter by platforms (comma-separated)</param>
    /// <param name="minPrice">Minimum price filter</param>
    /// <param name="maxPrice">Maximum price filter</param>
    /// <param name="onSale">Filter by games on sale</param>
    /// <param name="isDlc">Filter by DLC games</param>
    /// <returns>Paginated list of library games</returns>
    [HttpGet("{userId:guid}/query")]
    [ProducesResponseType(typeof(ApiResponse<PagedResult<GameDto>>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<PagedResult<GameDto>>), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ApiResponse<PagedResult<GameDto>>), StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<ApiResponse<PagedResult<GameDto>>>> GetLibraryWithQuery(
        [FromRoute, Required] Guid userId,
        [FromQuery] int page = 1,
        [FromQuery] int limit = 20,
        [FromQuery] string? sortBy = null,
        [FromQuery] string? sortDirection = null,
        [FromQuery] string? search = null,
        [FromQuery] string? genres = null,
        [FromQuery] string? platforms = null,
        [FromQuery] decimal? minPrice = null,
        [FromQuery] decimal? maxPrice = null,
        [FromQuery] bool? onSale = null,
        [FromQuery] bool? isDlc = null)
    {
        if (userId == Guid.Empty)
        {
            return BadRequest(new ApiResponse<PagedResult<GameDto>>("User ID cannot be empty."));
        }

        try
        {
            var parameters = new LibraryQueryParameters
            {
                Page = page,
                Limit = limit,
                SortBy = sortBy,
                SortDirection = sortDirection,
                Search = search,
                MinPrice = minPrice,
                MaxPrice = maxPrice,
                OnSale = onSale,
                IsDlc = isDlc
            };

            // Parse comma-separated values
            if (!string.IsNullOrWhiteSpace(genres))
            {
                parameters.Genres = genres.Split(',', StringSplitOptions.RemoveEmptyEntries)
                    .Select(g => g.Trim())
                    .ToList();
            }

            if (!string.IsNullOrWhiteSpace(platforms))
            {
                parameters.Platforms = platforms.Split(',', StringSplitOptions.RemoveEmptyEntries)
                    .Select(p => p.Trim())
                    .ToList();
            }

            var result = await _libraryService.GetLibraryGamesAsync(userId, parameters);
            return Ok(new ApiResponse<PagedResult<GameDto>>(result));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to retrieve paginated library for user {UserId}", userId);
            return StatusCode(StatusCodes.Status500InternalServerError, new ApiResponse<PagedResult<GameDto>>("Unable to retrieve library."));
        }
    }

    /// <summary>
    /// Get shared games between two users
    /// </summary>
    /// <param name="userId1">First user ID</param>
    /// <param name="userId2">Second user ID</param>
    /// <returns>List of games owned by both users</returns>
    [HttpGet("shared/{userId1:guid}/{userId2:guid}")]
    [ProducesResponseType(typeof(ApiResponse<IEnumerable<GameDto>>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<IEnumerable<GameDto>>), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ApiResponse<IEnumerable<GameDto>>), StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<ApiResponse<IEnumerable<GameDto>>>> GetSharedGames([FromRoute, Required] Guid userId1, [FromRoute, Required] Guid userId2)
    {
        if (userId1 == Guid.Empty)
        {
            return BadRequest(new ApiResponse<IEnumerable<GameDto>>("First user ID cannot be empty."));
        }

        if (userId2 == Guid.Empty)
        {
            return BadRequest(new ApiResponse<IEnumerable<GameDto>>("Second user ID cannot be empty."));
        }

        if (userId1 == userId2)
        {
            return BadRequest(new ApiResponse<IEnumerable<GameDto>>("User IDs must be different."));
        }

        try
        {
            var sharedGames = await _libraryService.GetSharedGamesAsync(userId1, userId2);
            return Ok(new ApiResponse<IEnumerable<GameDto>>(sharedGames));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to retrieve shared games between users {UserId1} and {UserId2}", userId1, userId2);
            return StatusCode(StatusCodes.Status500InternalServerError, new ApiResponse<IEnumerable<GameDto>>("Unable to retrieve shared games."));
        }
    }

    /// <summary>
    /// Add game to library (admin/system endpoint)
    /// </summary>
    /// <param name="dto">Request containing user ID and game ID</param>
    /// <returns>Created library entry</returns>
    [HttpPost]
    [ProducesResponseType(typeof(ApiResponse<LibraryDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<LibraryDto>), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ApiResponse<LibraryDto>), StatusCodes.Status409Conflict)]
    [ProducesResponseType(typeof(ApiResponse<LibraryDto>), StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<ApiResponse<LibraryDto>>> AddToLibrary([FromBody] AddToLibraryDto dto)
    {
        if (dto is null)
        {
            return BadRequest(new ApiResponse<LibraryDto>("Request body is required."));
        }

        if (dto.UserId == Guid.Empty || dto.GameId == Guid.Empty)
        {
            return BadRequest(new ApiResponse<LibraryDto>("User ID and Game ID are required."));
        }

        try
        {
            var result = await _libraryService.AddToLibraryAsync(dto);
            var response = new ApiResponse<LibraryDto>(result)
            {
                Message = "Game added to library."
            };
            return Ok(response);
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new ApiResponse<LibraryDto>(ex.Message));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to add game {GameId} to library for user {UserId}", dto.GameId, dto.UserId);
            return StatusCode(StatusCodes.Status500InternalServerError, new ApiResponse<LibraryDto>("Unable to add to library."));
        }
    }
}
