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

    [HttpPut("declined")]
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

    [HttpGet("pending/{id:guid}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<ActionResult<ApiResponse<IEnumerable<Guid>>>> GetPending(Guid id)
    {
        var userId = GetAuthenticatedUserId();
        if (id != userId)
        {
            return Forbid();
        }

        var receiverIds = await _friendshipService.GetPendingSentAsync(id);
        return Ok(new ApiResponse<IEnumerable<Guid>>(receiverIds));
    }

    [HttpGet("accept/{id:guid}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<ActionResult<ApiResponse<IEnumerable<FriendshipDto>>>> GetAccepted(Guid id)
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
