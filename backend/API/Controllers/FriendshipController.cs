using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using API.Models;
using Application.DTOs;
using Application.Interfaces;
using Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

/// <summary>
/// Controller for managing friendship relationships and friend requests
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Authorize]
public class FriendshipController : ControllerBase
{
    private readonly IFriendshipService _friendshipService;

    public FriendshipController(IFriendshipService friendshipService)
    {
        _friendshipService = friendshipService;
    }

    /// <summary>
    /// Send a friend request to another user
    /// </summary>
    /// <param name="dto">Contains the ReceiverId of the user to send the friend request to</param>
    /// <returns>Created friend request details</returns>
    /// <response code="201">Friend request sent successfully</response>
    /// <response code="400">Invalid request data or validation failed</response>
    /// <response code="409">Friend request already exists or users are already friends</response>
    [HttpPost("send")]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    public async Task<ActionResult<ApiResponse<FriendRequestDto>>> Send([FromBody] SendFriendRequestDto dto)
    {
        if (dto is null || dto.ReceiverId == Guid.Empty)
        {
            return BadRequest(new ApiResponse<FriendRequestDto>("ReceiverId is required."));
        }

        var senderId = GetAuthenticatedUserId();

        try
        {
            var request = await _friendshipService.SendRequestAsync(senderId, dto.ReceiverId);
            var response = new FriendRequestDto
            {
                SenderId = request.SenderId,
                ReceiverId = request.ReceiverId,
                Status = request.Status,
                CreatedAt = request.CreatedAt
            };

            return StatusCode(StatusCodes.Status201Created, new ApiResponse<FriendRequestDto>(response));
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new ApiResponse<FriendRequestDto>(ex.Message));
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new ApiResponse<FriendRequestDto>(ex.Message));
        }
    }

    /// <summary>
    /// Accept a pending friend request
    /// </summary>
    /// <param name="dto">Contains the SenderId and ReceiverId of the friend request to accept</param>
    /// <returns>Created friendship details</returns>
    /// <response code="200">Friend request accepted successfully, friendship created</response>
    /// <response code="400">Invalid request data or validation failed</response>
    /// <response code="404">Friend request not found</response>
    /// <response code="409">Friend request cannot be accepted (already processed or invalid state)</response>
    [HttpPost("accept")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    public async Task<ActionResult<ApiResponse<FriendshipDto>>> Accept([FromBody] RespondFriendRequestDto dto)
    {
        if (dto is null || dto.SenderId == Guid.Empty || dto.ReceiverId == Guid.Empty)
        {
            return BadRequest(new ApiResponse<FriendshipDto>("SenderId and ReceiverId are required."));
        }

        var userId = GetAuthenticatedUserId();
        if (userId != dto.ReceiverId)
        {
            return Forbid();
        }

        try
        {
            var friendship = await _friendshipService.AcceptRequestAsync(dto.SenderId, dto.ReceiverId);
            var response = new FriendshipDto
            {
                User1Id = friendship.User1Id,
                User2Id = friendship.User2Id,
                CreatedAt = friendship.CreatedAt
            };

            return Ok(new ApiResponse<FriendshipDto>(response));
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new ApiResponse<FriendshipDto>(ex.Message));
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new ApiResponse<FriendshipDto>(ex.Message));
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new ApiResponse<FriendshipDto>(ex.Message));
        }
    }

    /// <summary>
    /// Decline a pending friend request
    /// </summary>
    /// <param name="dto">Contains the SenderId and ReceiverId of the friend request to decline</param>
    /// <returns>No content on successful decline</returns>
    /// <response code="204">Friend request declined successfully</response>
    /// <response code="400">Invalid request data or validation failed</response>
    /// <response code="404">Friend request not found</response>
    [HttpPost("decline")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Decline([FromBody] RespondFriendRequestDto dto)
    {
        if (dto is null || dto.SenderId == Guid.Empty || dto.ReceiverId == Guid.Empty)
        {
            return BadRequest(new ApiResponse<object>("SenderId and ReceiverId are required."));
        }

        var userId = GetAuthenticatedUserId();
        if (userId != dto.ReceiverId)
        {
            return Forbid();
        }

        try
        {
            await _friendshipService.DeclineRequestAsync(dto.SenderId, dto.ReceiverId);
            return NoContent();
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new ApiResponse<object>(ex.Message));
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new ApiResponse<object>(ex.Message));
        }
    }

    /// <summary>
    /// Cancel a sent friend request
    /// </summary>
    /// <param name="dto">Contains the SenderId and ReceiverId of the friend request to cancel</param>
    /// <returns>No content on successful cancellation</returns>
    /// <response code="204">Friend request cancelled successfully</response>
    /// <response code="400">Invalid request data or validation failed</response>
    /// <response code="404">Friend request not found</response>
    [HttpDelete("cancel")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Cancel([FromBody] RespondFriendRequestDto dto)
    {
        if (dto is null || dto.SenderId == Guid.Empty || dto.ReceiverId == Guid.Empty)
        {
            return BadRequest(new ApiResponse<object>("SenderId and ReceiverId are required."));
        }

        var userId = GetAuthenticatedUserId();
        if (userId != dto.SenderId)
        {
            return Forbid();
        }

        try
        {
            await _friendshipService.CancelRequestAsync(dto.SenderId, dto.ReceiverId);
            return NoContent();
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new ApiResponse<object>(ex.Message));
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new ApiResponse<object>(ex.Message));
        }
    }

    /// <summary>
    /// Remove/unfriend an existing friendship
    /// </summary>
    /// <param name="dto">Contains the SenderId and ReceiverId of the friendship to remove</param>
    /// <returns>No content on successful removal</returns>
    /// <response code="204">Friendship removed successfully</response>
    /// <response code="400">Invalid request data or validation failed</response>
    /// <response code="404">Friendship not found</response>
    [HttpDelete("remove")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Remove([FromBody] RespondFriendRequestDto dto)
    {
        if (dto is null || dto.SenderId == Guid.Empty || dto.ReceiverId == Guid.Empty)
        {
            return BadRequest(new ApiResponse<object>("SenderId and ReceiverId are required."));
        }

        var userId = GetAuthenticatedUserId();
        if (userId != dto.SenderId && userId != dto.ReceiverId)
        {
            return Forbid();
        }

        try
        {
            await _friendshipService.RemoveFriendshipAsync(userId, userId == dto.SenderId ? dto.ReceiverId : dto.SenderId);
            return NoContent();
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new ApiResponse<object>(ex.Message));
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new ApiResponse<object>(ex.Message));
        }
    }

    /// <summary>
    /// Get outgoing friend requests sent by the user
    /// </summary>
    /// <param name="id">User ID (must match authenticated user)</param>
    /// <returns>List of user IDs to whom friend requests were sent</returns>
    /// <response code="200">Outgoing friend requests retrieved successfully</response>
    /// <response code="403">Access denied - can only view own outgoing requests</response>
    [HttpGet("outgoing/{id:guid}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<ActionResult<ApiResponse<IEnumerable<Guid>>>> GetOutgoing(Guid id)
    {
        var userId = GetAuthenticatedUserId();
        if (id != userId)
        {
            return Forbid();
        }

        var receiverIds = await _friendshipService.GetPendingSentAsync(id);
        return Ok(new ApiResponse<IEnumerable<Guid>>(receiverIds));
    }

    /// <summary>
    /// Get incoming friend requests received by the user
    /// </summary>
    /// <param name="id">User ID (must match authenticated user)</param>
    /// <returns>List of user IDs from whom friend requests were received</returns>
    /// <response code="200">Incoming friend requests retrieved successfully</response>
    /// <response code="403">Access denied - can only view own incoming requests</response>
    [HttpGet("incoming/{id:guid}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<ActionResult<ApiResponse<IEnumerable<Guid>>>> GetIncoming(Guid id)
    {
        var userId = GetAuthenticatedUserId();
        if (id != userId)
        {
            return Forbid();
        }

        var senderIds = await _friendshipService.GetPendingReceivedAsync(id);
        return Ok(new ApiResponse<IEnumerable<Guid>>(senderIds));
    }

    /// <summary>
    /// Get the user's friends list with friendship details
    /// </summary>
    /// <param name="id">User ID (must match authenticated user)</param>
    /// <returns>List of friendship details including user IDs and creation dates</returns>
    /// <response code="200">Friends list retrieved successfully</response>
    /// <response code="403">Access denied - can only view own friends list</response>
    [HttpGet("friends/{id:guid}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<ActionResult<ApiResponse<IEnumerable<FriendshipDto>>>> GetFriends(Guid id)
    {
        var userId = GetAuthenticatedUserId();
        if (id != userId)
        {
            return Forbid();
        }

        var friendships = await _friendshipService.GetFriendshipsAsync(id);
        var response = friendships.Select(f => new FriendshipDto
        {
            User1Id = f.User1Id,
            User2Id = f.User2Id,
            CreatedAt = f.CreatedAt
        }).ToList();

        return Ok(new ApiResponse<IEnumerable<FriendshipDto>>(response));
    }

    /// <summary>
    /// Get only the user IDs of the user's friends (lightweight response)
    /// </summary>
    /// <param name="id">User ID (must match authenticated user)</param>
    /// <returns>List of friend user IDs only</returns>
    /// <response code="200">Friend IDs retrieved successfully</response>
    /// <response code="403">Access denied - can only view own friend IDs</response>
    [HttpGet("ids/{id:guid}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<ActionResult<ApiResponse<IEnumerable<Guid>>>> GetFriendIds(Guid id)
    {
        var userId = GetAuthenticatedUserId();
        if (id != userId)
        {
            return Forbid();
        }

        var friendIds = await _friendshipService.GetFriendIdsAsync(id);
        return Ok(new ApiResponse<IEnumerable<Guid>>(friendIds));
    }

    private Guid GetAuthenticatedUserId()
    {
        var userIdValue = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (Guid.TryParse(userIdValue, out var userId))
        {
            return userId;
        }

        throw new InvalidOperationException("Authenticated user identifier not found.");
    }
}
