using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Threading.Tasks;
using API.Models;
using Application.DTOs;
using Application.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class WishlistController : ControllerBase
{
    private readonly IWishlistService _wishlistService;
    private readonly ILogger<WishlistController> _logger;

    public WishlistController(IWishlistService wishlistService, ILogger<WishlistController> logger)
    {
        _wishlistService = wishlistService ?? throw new ArgumentNullException(nameof(wishlistService));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    [HttpGet("{userId:guid}")]
    [ProducesResponseType(typeof(ApiResponse<IEnumerable<Guid>>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<IEnumerable<Guid>>), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ApiResponse<IEnumerable<Guid>>), StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<ApiResponse<IEnumerable<Guid>>>> GetWishlist([FromRoute, Required] Guid userId)
    {
        if (userId == Guid.Empty)
        {
            return BadRequest(new ApiResponse<IEnumerable<Guid>>("User ID cannot be empty."));
        }

        try
        {
            var gameIds = await _wishlistService.GetWishlistGameIdsAsync(userId);
            return Ok(new ApiResponse<IEnumerable<Guid>>(gameIds));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to retrieve wishlist for user {UserId}", userId);
            return StatusCode(StatusCodes.Status500InternalServerError, new ApiResponse<IEnumerable<Guid>>("Unable to retrieve wishlist."));
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
}
