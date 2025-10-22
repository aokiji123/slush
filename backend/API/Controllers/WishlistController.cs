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
public class WishlistController : ControllerBase
{
    private readonly IWishlistService _wishlistService;
    private readonly ILogger<WishlistController> _logger;

    public WishlistController(IWishlistService wishlistService, ILogger<WishlistController> logger)
    {
        _wishlistService = wishlistService ?? throw new ArgumentNullException(nameof(wishlistService));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    [HttpGet("me")]
    [ProducesResponseType(typeof(ApiResponse<IEnumerable<GameDto>>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<IEnumerable<GameDto>>), StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<ApiResponse<IEnumerable<GameDto>>>> GetMyWishlist()
    {
        try
        {
            var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var games = await _wishlistService.GetWishlistGamesAsync(userId);
            return Ok(new ApiResponse<IEnumerable<GameDto>>(games));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to retrieve wishlist for authenticated user");
            return StatusCode(StatusCodes.Status500InternalServerError, new ApiResponse<IEnumerable<GameDto>>("Unable to retrieve wishlist."));
        }
    }

    /// <summary>
    /// Get authenticated user's wishlist games with query parameters for filtering, sorting, and pagination
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
    /// <returns>Paginated list of wishlist games</returns>
    [HttpGet("me/query")]
    [ProducesResponseType(typeof(ApiResponse<PagedResult<GameDto>>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<PagedResult<GameDto>>), StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<ApiResponse<PagedResult<GameDto>>>> GetMyWishlistWithQuery(
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
            var parameters = new WishlistQueryParameters
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

            var result = await _wishlistService.GetWishlistGamesAsync(userId, parameters);
            return Ok(new ApiResponse<PagedResult<GameDto>>(result));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to retrieve paginated wishlist for authenticated user");
            return StatusCode(StatusCodes.Status500InternalServerError, new ApiResponse<PagedResult<GameDto>>("Unable to retrieve wishlist."));
        }
    }

    [HttpGet("{userId:guid}")]
    [ProducesResponseType(typeof(ApiResponse<IEnumerable<GameDto>>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<IEnumerable<GameDto>>), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ApiResponse<IEnumerable<GameDto>>), StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<ApiResponse<IEnumerable<GameDto>>>> GetWishlist([FromRoute, Required] Guid userId)
    {
        if (userId == Guid.Empty)
        {
            return BadRequest(new ApiResponse<IEnumerable<GameDto>>("User ID cannot be empty."));
        }

        try
        {
            var games = await _wishlistService.GetWishlistGamesAsync(userId);
            return Ok(new ApiResponse<IEnumerable<GameDto>>(games));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to retrieve wishlist for user {UserId}", userId);
            return StatusCode(StatusCodes.Status500InternalServerError, new ApiResponse<IEnumerable<GameDto>>("Unable to retrieve wishlist."));
        }
    }

    /// <summary>
    /// Get wishlist games with query parameters for filtering, sorting, and pagination
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
    /// <returns>Paginated list of wishlist games</returns>
    [HttpGet("{userId:guid}/query")]
    [ProducesResponseType(typeof(ApiResponse<PagedResult<GameDto>>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<PagedResult<GameDto>>), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ApiResponse<PagedResult<GameDto>>), StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<ApiResponse<PagedResult<GameDto>>>> GetWishlistWithQuery(
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
            var parameters = new WishlistQueryParameters
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

            var result = await _wishlistService.GetWishlistGamesAsync(userId, parameters);
            return Ok(new ApiResponse<PagedResult<GameDto>>(result));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to retrieve paginated wishlist for user {UserId}", userId);
            return StatusCode(StatusCodes.Status500InternalServerError, new ApiResponse<PagedResult<GameDto>>("Unable to retrieve wishlist."));
        }
    }

    [HttpPost("me")]
    [ProducesResponseType(typeof(ApiResponse<bool>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<bool>), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ApiResponse<bool>), StatusCodes.Status409Conflict)]
    [ProducesResponseType(typeof(ApiResponse<bool>), StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<ApiResponse<bool>>> AddToMyWishlist([FromBody] WishlistMeRequestDto request)
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
            var added = await _wishlistService.AddToWishlistAsync(userId, request.GameId);
            if (!added)
            {
                return Conflict(new ApiResponse<bool>("This game is already in the wishlist."));
            }

            var response = new ApiResponse<bool>(true)
            {
                Message = "Game added to wishlist."
            };
            return Ok(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to add game {GameId} to wishlist for authenticated user", request.GameId);
            return StatusCode(StatusCodes.Status500InternalServerError, new ApiResponse<bool>("Unable to add to wishlist."));
        }
    }

    [HttpPost]
    [ProducesResponseType(typeof(ApiResponse<bool>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<bool>), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ApiResponse<bool>), StatusCodes.Status409Conflict)]
    [ProducesResponseType(typeof(ApiResponse<bool>), StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<ApiResponse<bool>>> AddToWishlist([FromBody] WishlistRequestDto request)
    {
        if (request is null)
        {
            return BadRequest(new ApiResponse<bool>("Request body is required."));
        }

        if (request.UserId == Guid.Empty || request.GameId == Guid.Empty)
        {
            return BadRequest(new ApiResponse<bool>("User ID and Game ID are required."));
        }

        try
        {
            var added = await _wishlistService.AddToWishlistAsync(request.UserId, request.GameId);
            if (!added)
            {
                return Conflict(new ApiResponse<bool>("This game is already in the wishlist."));
            }

            var response = new ApiResponse<bool>(true)
            {
                Message = "Game added to wishlist."
            };
            return Ok(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to add game {GameId} to wishlist for user {UserId}", request.GameId, request.UserId);
            return StatusCode(StatusCodes.Status500InternalServerError, new ApiResponse<bool>("Unable to add to wishlist."));
        }
    }

    [HttpDelete("me/{gameId:guid}")]
    [ProducesResponseType(typeof(ApiResponse<bool>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<bool>), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ApiResponse<bool>), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ApiResponse<bool>), StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<ApiResponse<bool>>> RemoveFromMyWishlist(
        [FromRoute, Required] Guid gameId)
    {
        if (gameId == Guid.Empty)
        {
            return BadRequest(new ApiResponse<bool>("Game ID is required."));
        }

        try
        {
            var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var removed = await _wishlistService.RemoveFromWishlistAsync(userId, gameId);
            if (!removed)
            {
                return NotFound(new ApiResponse<bool>("Wishlist entry not found."));
            }

            var response = new ApiResponse<bool>(true)
            {
                Message = "Game removed from wishlist."
            };
            return Ok(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to remove game {GameId} from wishlist for authenticated user", gameId);
            return StatusCode(StatusCodes.Status500InternalServerError, new ApiResponse<bool>("Unable to remove from wishlist."));
        }
    }

    [HttpDelete("{userId:guid}/{gameId:guid}")]
    [ProducesResponseType(typeof(ApiResponse<bool>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<bool>), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ApiResponse<bool>), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ApiResponse<bool>), StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<ApiResponse<bool>>> RemoveFromWishlist(
        [FromRoute, Required] Guid userId,
        [FromRoute, Required] Guid gameId)
    {
        if (userId == Guid.Empty || gameId == Guid.Empty)
        {
            return BadRequest(new ApiResponse<bool>("User ID and Game ID are required."));
        }

        try
        {
            var removed = await _wishlistService.RemoveFromWishlistAsync(userId, gameId);
            if (!removed)
            {
                return NotFound(new ApiResponse<bool>("Wishlist entry not found."));
            }

            var response = new ApiResponse<bool>(true)
            {
                Message = "Game removed from wishlist."
            };
            return Ok(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to remove game {GameId} from wishlist for user {UserId}", gameId, userId);
            return StatusCode(StatusCodes.Status500InternalServerError, new ApiResponse<bool>("Unable to remove from wishlist."));
        }
    }

    /// <summary>
    /// Get friends who have a specific game in their wishlist
    /// </summary>
    /// <param name="gameId">Game ID to check wishlist for</param>
    /// <returns>List of friend details who have the specified game in their wishlist</returns>
    /// <response code="200">Friends with game in wishlist retrieved successfully</response>
    /// <response code="400">Invalid game ID</response>
    /// <response code="500">Internal server error</response>
    [HttpGet("friends-wishlisted/{gameId:guid}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<ApiResponse<IEnumerable<FriendWithGameDto>>>> GetFriendsWishlisted(Guid gameId)
    {
        if (gameId == Guid.Empty)
        {
            return BadRequest(new ApiResponse<IEnumerable<FriendWithGameDto>>("Game ID cannot be empty."));
        }

        try
        {
            var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var friendsWishlisted = await _wishlistService.GetFriendsWithGameInWishlistDetailsAsync(userId, gameId);
            return Ok(new ApiResponse<IEnumerable<FriendWithGameDto>>(friendsWishlisted));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to retrieve friends who wishlisted game {GameId}", gameId);
            return StatusCode(StatusCodes.Status500InternalServerError, 
                new ApiResponse<IEnumerable<FriendWithGameDto>>("Unable to retrieve friends who wishlisted the game."));
        }
    }
}
