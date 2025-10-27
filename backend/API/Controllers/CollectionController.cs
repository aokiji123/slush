using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using API.Models;
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
public class CollectionController : ControllerBase
{
    private readonly ICollectionService _collectionService;
    private readonly ILogger<CollectionController> _logger;

    public CollectionController(ICollectionService collectionService, ILogger<CollectionController> logger)
    {
        _collectionService = collectionService ?? throw new ArgumentNullException(nameof(collectionService));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    /// <summary>
    /// Get authenticated user's collections
    /// </summary>
    /// <returns>List of user's collections</returns>
    [HttpGet]
    [ProducesResponseType(typeof(ApiResponse<IEnumerable<CollectionDto>>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<IEnumerable<CollectionDto>>), StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<ApiResponse<IEnumerable<CollectionDto>>>> GetMyCollections()
    {
        try
        {
            var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var collections = await _collectionService.GetUserCollectionsAsync(userId);
            return Ok(new ApiResponse<IEnumerable<CollectionDto>>(collections));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to retrieve collections for authenticated user");
            return StatusCode(StatusCodes.Status500InternalServerError, new ApiResponse<IEnumerable<CollectionDto>>("Unable to retrieve collections."));
        }
    }

    /// <summary>
    /// Get collection by ID
    /// </summary>
    /// <param name="id">Collection ID</param>
    /// <returns>Collection details with games</returns>
    [HttpGet("{id:guid}")]
    [ProducesResponseType(typeof(ApiResponse<CollectionDetailsDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<CollectionDetailsDto>), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ApiResponse<CollectionDetailsDto>), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ApiResponse<CollectionDetailsDto>), StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<ApiResponse<CollectionDetailsDto>>> GetCollection([FromRoute, Required] Guid id)
    {
        if (id == Guid.Empty)
        {
            return BadRequest(new ApiResponse<CollectionDetailsDto>("Collection ID cannot be empty."));
        }

        try
        {
            var collection = await _collectionService.GetCollectionByIdAsync(id);
            return Ok(new ApiResponse<CollectionDetailsDto>(collection));
        }
        catch (InvalidOperationException ex)
        {
            return NotFound(new ApiResponse<CollectionDetailsDto>(ex.Message));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to retrieve collection {CollectionId}", id);
            return StatusCode(StatusCodes.Status500InternalServerError, new ApiResponse<CollectionDetailsDto>("Unable to retrieve collection."));
        }
    }

    /// <summary>
    /// Create a new collection
    /// </summary>
    /// <param name="dto">Collection data</param>
    /// <returns>Created collection</returns>
    [HttpPost]
    [ProducesResponseType(typeof(ApiResponse<CollectionDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<CollectionDto>), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ApiResponse<CollectionDto>), StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<ApiResponse<CollectionDto>>> CreateCollection([FromBody] CreateCollectionDto dto)
    {
        if (dto is null)
        {
            return BadRequest(new ApiResponse<CollectionDto>("Request body is required."));
        }

        if (string.IsNullOrWhiteSpace(dto.Name))
        {
            return BadRequest(new ApiResponse<CollectionDto>("Collection name is required."));
        }

        try
        {
            var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var collection = await _collectionService.CreateCollectionAsync(userId, dto);
            
            var response = new ApiResponse<CollectionDto>(collection)
            {
                Message = "Collection created successfully."
            };
            return Ok(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to create collection for authenticated user");
            return StatusCode(StatusCodes.Status500InternalServerError, new ApiResponse<CollectionDto>("Unable to create collection."));
        }
    }

    /// <summary>
    /// Update a collection
    /// </summary>
    /// <param name="id">Collection ID</param>
    /// <param name="dto">Updated collection data</param>
    /// <returns>Updated collection</returns>
    [HttpPut("{id:guid}")]
    [ProducesResponseType(typeof(ApiResponse<CollectionDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<CollectionDto>), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ApiResponse<CollectionDto>), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ApiResponse<CollectionDto>), StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<ApiResponse<CollectionDto>>> UpdateCollection([FromRoute, Required] Guid id, [FromBody] UpdateCollectionDto dto)
    {
        if (id == Guid.Empty)
        {
            return BadRequest(new ApiResponse<CollectionDto>("Collection ID cannot be empty."));
        }

        if (dto is null)
        {
            return BadRequest(new ApiResponse<CollectionDto>("Request body is required."));
        }

        if (string.IsNullOrWhiteSpace(dto.Name))
        {
            return BadRequest(new ApiResponse<CollectionDto>("Collection name is required."));
        }

        try
        {
            var collection = await _collectionService.UpdateCollectionAsync(id, dto);
            
            var response = new ApiResponse<CollectionDto>(collection)
            {
                Message = "Collection updated successfully."
            };
            return Ok(response);
        }
        catch (InvalidOperationException ex)
        {
            return NotFound(new ApiResponse<CollectionDto>(ex.Message));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to update collection {CollectionId}", id);
            return StatusCode(StatusCodes.Status500InternalServerError, new ApiResponse<CollectionDto>("Unable to update collection."));
        }
    }

    /// <summary>
    /// Delete a collection
    /// </summary>
    /// <param name="id">Collection ID</param>
    /// <returns>Success status</returns>
    [HttpDelete("{id:guid}")]
    [ProducesResponseType(typeof(ApiResponse<bool>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<bool>), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ApiResponse<bool>), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ApiResponse<bool>), StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<ApiResponse<bool>>> DeleteCollection([FromRoute, Required] Guid id)
    {
        if (id == Guid.Empty)
        {
            return BadRequest(new ApiResponse<bool>("Collection ID cannot be empty."));
        }

        try
        {
            var success = await _collectionService.DeleteCollectionAsync(id);
            
            if (!success)
            {
                return NotFound(new ApiResponse<bool>("Collection not found."));
            }

            var response = new ApiResponse<bool>(true)
            {
                Message = "Collection deleted successfully."
            };
            return Ok(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to delete collection {CollectionId}", id);
            return StatusCode(StatusCodes.Status500InternalServerError, new ApiResponse<bool>("Unable to delete collection."));
        }
    }

    /// <summary>
    /// Add a game to a collection
    /// </summary>
    /// <param name="collectionId">Collection ID</param>
    /// <param name="gameId">Game ID</param>
    /// <returns>Success status</returns>
    [HttpPost("{collectionId:guid}/games/{gameId:guid}")]
    [ProducesResponseType(typeof(ApiResponse<bool>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<bool>), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ApiResponse<bool>), StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<ApiResponse<bool>>> AddGameToCollection([FromRoute, Required] Guid collectionId, [FromRoute, Required] Guid gameId)
    {
        if (collectionId == Guid.Empty || gameId == Guid.Empty)
        {
            return BadRequest(new ApiResponse<bool>("Collection ID and Game ID cannot be empty."));
        }

        try
        {
            var success = await _collectionService.AddGameToCollectionAsync(collectionId, gameId);
            
            if (!success)
            {
                return BadRequest(new ApiResponse<bool>("Game is already in the collection."));
            }

            var response = new ApiResponse<bool>(true)
            {
                Message = "Game added to collection successfully."
            };
            return Ok(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to add game {GameId} to collection {CollectionId}", gameId, collectionId);
            return StatusCode(StatusCodes.Status500InternalServerError, new ApiResponse<bool>("Unable to add game to collection."));
        }
    }

    /// <summary>
    /// Remove a game from a collection
    /// </summary>
    /// <param name="collectionId">Collection ID</param>
    /// <param name="gameId">Game ID</param>
    /// <returns>Success status</returns>
    [HttpDelete("{collectionId:guid}/games/{gameId:guid}")]
    [ProducesResponseType(typeof(ApiResponse<bool>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<bool>), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ApiResponse<bool>), StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<ApiResponse<bool>>> RemoveGameFromCollection([FromRoute, Required] Guid collectionId, [FromRoute, Required] Guid gameId)
    {
        if (collectionId == Guid.Empty || gameId == Guid.Empty)
        {
            return BadRequest(new ApiResponse<bool>("Collection ID and Game ID cannot be empty."));
        }

        try
        {
            var success = await _collectionService.RemoveGameFromCollectionAsync(collectionId, gameId);
            
            if (!success)
            {
                return BadRequest(new ApiResponse<bool>("Game is not in the collection."));
            }

            var response = new ApiResponse<bool>(true)
            {
                Message = "Game removed from collection successfully."
            };
            return Ok(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to remove game {GameId} from collection {CollectionId}", gameId, collectionId);
            return StatusCode(StatusCodes.Status500InternalServerError, new ApiResponse<bool>("Unable to remove game from collection."));
        }
    }
}

