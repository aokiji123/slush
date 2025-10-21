using System;
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

/// <summary>
/// Provides endpoints for managing user profile information and preferences.
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class UserController : ControllerBase
{
    private const string UnexpectedErrorMessage = "An unexpected error occurred while processing the request.";

    private readonly IUserService _userService;
    private readonly ILogger<UserController> _logger;

    public UserController(IUserService userService, ILogger<UserController> logger)
    {
        _userService = userService;
        _logger = logger;
    }

    /// <summary>
    /// Gets the current authenticated user profile.
    /// </summary>
    [Authorize]
    [HttpGet("me")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<ApiResponse<UserDto>>> GetCurrentUserAsync()
    {
        if (!TryGetUserIdFromClaims(out var userId))
        {
            return Unauthorized(new ApiResponse<UserDto>("Unable to determine the current user."));
        }

        return await GetUserInternalAsync(userId);
    }

    /// <summary>
    /// Gets notification preferences for the authenticated user.
    /// </summary>
    [Authorize]
    [HttpGet("{id:guid}/notifications")]
    [ProducesResponseType(typeof(ApiResponse<NotificationsDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse<NotificationsDto>>> GetNotificationsAsync(Guid id)
    {
        if (!TryGetUserIdFromClaims(out var currentUserId))
        {
            return Unauthorized(new ApiResponse<NotificationsDto>("Unable to determine the current user."));
        }

        if (currentUserId != id)
        {
            return Forbid();
        }

        var notifications = await _userService.GetNotificationsAsync(id);
        if (notifications == null)
        {
            return NotFound(new ApiResponse<NotificationsDto>($"Notifications for user '{id}' not found."));
        }

        return Ok(new ApiResponse<NotificationsDto>(notifications));
    }

    /// <summary>
    /// Gets a user profile by identifier.
    /// </summary>
    [HttpGet("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<ApiResponse<UserDto>>> GetUserAsync(Guid id)
    {
        if (id == Guid.Empty)
        {
            return BadRequest(new ApiResponse<UserDto>("User identifier cannot be empty."));
        }

        return await GetUserInternalAsync(id);
    }

    /// <summary>
    /// Updates the current user's profile information.
    /// </summary>
    [Authorize]
    [HttpPut("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<ApiResponse<UserDto>>> UpdateUserAsync(Guid id, [FromBody] UserUpdateDto? dto)
    {
        if (dto is null)
        {
            return BadRequest(new ApiResponse<UserDto>("Request body is required."));
        }

        if (!TryGetUserIdFromClaims(out var currentUserId))
        {
            return Unauthorized(new ApiResponse<UserDto>("Unable to determine the current user."));
        }

        if (currentUserId != id)
        {
            return Forbid();
        }

        if (dto.Id != Guid.Empty && dto.Id != id)
        {
            return BadRequest(new ApiResponse<UserDto>("Route identifier and payload identifier must match."));
        }

        if (string.IsNullOrWhiteSpace(dto.Nickname))
        {
            return BadRequest(new ApiResponse<UserDto>("Nickname is required."));
        }

        if (string.IsNullOrWhiteSpace(dto.Email))
        {
            return BadRequest(new ApiResponse<UserDto>("Email is required."));
        }

        dto.Id = id;

        try
        {
            var updated = await _userService.UpdateUserAsync(id, dto);
            if (updated is null)
            {
                return NotFound(new ApiResponse<UserDto>($"User with id '{id}' was not found."));
            }

            var response = new ApiResponse<UserDto>(updated)
            {
                Message = "User profile updated successfully."
            };

            return Ok(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating user {UserId}", id);
            return StatusCode(StatusCodes.Status500InternalServerError, new ApiResponse<UserDto>(UnexpectedErrorMessage));
        }
    }

    /// <summary>
    /// Adds funds to the authenticated user's balance.
    /// </summary>
    [Authorize]
    [HttpPatch("{id:guid}/balance")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<ApiResponse<object>>> AddBalanceAsync(Guid id, [FromBody] UserBalanceDto? dto)
    {
        if (dto is null)
        {
            return BadRequest(new ApiResponse<object>("Request body is required."));
        }

        if (!TryGetUserIdFromClaims(out var currentUserId))
        {
            return Unauthorized(new ApiResponse<object>("Unable to determine the current user."));
        }

        if (currentUserId != id)
        {
            return Forbid();
        }

        if (dto.AmountToAdd <= 0)
        {
            return BadRequest(new ApiResponse<object>("AmountToAdd must be greater than zero."));
        }

        if (dto.UserId != Guid.Empty && dto.UserId != id)
        {
            return BadRequest(new ApiResponse<object>("Route identifier and payload identifier must match."));
        }

        try
        {
            var updated = await _userService.AddBalanceAsync(id, dto.AmountToAdd);
            if (!updated)
            {
                return NotFound(new ApiResponse<object>($"User with id '{id}' was not found."));
            }

            var response = new ApiResponse<object>
            {
                Message = "Balance updated successfully.",
                Data = null
            };

            return Ok(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error adding balance to user {UserId}", id);
            return StatusCode(StatusCodes.Status500InternalServerError, new ApiResponse<object>(UnexpectedErrorMessage));
        }
    }

    /// <summary>
    /// Deletes the authenticated user's account.
    /// </summary>
    [Authorize]
    [HttpDelete("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<ApiResponse<object>>> DeleteUserAsync(Guid id, [FromBody] UserDeleteDto? dto)
    {
        if (dto is null)
        {
            return BadRequest(new ApiResponse<object>("Request body is required."));
        }

        if (!TryGetUserIdFromClaims(out var currentUserId))
        {
            return Unauthorized(new ApiResponse<object>("Unable to determine the current user."));
        }

        if (currentUserId != id)
        {
            return Forbid();
        }

        if (string.IsNullOrWhiteSpace(dto.Nickname) ||
            string.IsNullOrWhiteSpace(dto.Password) ||
            string.IsNullOrWhiteSpace(dto.ConfirmPassword))
        {
            return BadRequest(new ApiResponse<object>("Nickname, password, and confirm password are required."));
        }

        if (!string.Equals(dto.Password, dto.ConfirmPassword, StringComparison.Ordinal))
        {
            return BadRequest(new ApiResponse<object>("Password and confirm password must match."));
        }

        dto.UserId = id;

        try
        {
            var deleted = await _userService.DeleteUserAsync(dto);
            if (!deleted)
            {
                return NotFound(new ApiResponse<object>($"User with id '{id}' was not found or credentials are invalid."));
            }

            var response = new ApiResponse<object>
            {
                Message = "User account deleted successfully.",
                Data = null
            };

            return Ok(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting user {UserId}", id);
            return StatusCode(StatusCodes.Status500InternalServerError, new ApiResponse<object>(UnexpectedErrorMessage));
        }
    }

    /// <summary>
    /// Uploads a new avatar for the authenticated user.
    /// </summary>
    [Authorize]
    [HttpPost("{id:guid}/avatar")]
    [ProducesResponseType(typeof(FileUploadDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<ApiResponse<FileUploadDto>>> UploadAvatarAsync(Guid id, IFormFile file)
    {
        if (!TryGetUserIdFromClaims(out var currentUserId))
        {
            return Unauthorized(new ApiResponse<FileUploadDto>("Unable to determine the current user."));
        }

        if (currentUserId != id)
        {
            return Forbid();
        }

        if (file == null)
        {
            return BadRequest(new ApiResponse<FileUploadDto>("No file provided."));
        }

        try
        {
            var result = await _userService.UploadAvatarAsync(id, file);
            return Ok(new ApiResponse<FileUploadDto>(result) { Message = "Avatar uploaded successfully." });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error uploading avatar for user {UserId}", id);
            return StatusCode(StatusCodes.Status500InternalServerError, new ApiResponse<FileUploadDto>(UnexpectedErrorMessage));
        }
    }

    /// <summary>
    /// Uploads a new banner for the authenticated user.
    /// </summary>
    [Authorize]
    [HttpPost("{id:guid}/banner")]
    [ProducesResponseType(typeof(FileUploadDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<ApiResponse<FileUploadDto>>> UploadBannerAsync(Guid id, IFormFile file)
    {
        if (!TryGetUserIdFromClaims(out var currentUserId))
        {
            return Unauthorized(new ApiResponse<FileUploadDto>("Unable to determine the current user."));
        }

        if (currentUserId != id)
        {
            return Forbid();
        }

        if (file == null)
        {
            return BadRequest(new ApiResponse<FileUploadDto>("No file provided."));
        }

        try
        {
            var result = await _userService.UploadBannerAsync(id, file);
            return Ok(new ApiResponse<FileUploadDto>(result) { Message = "Banner uploaded successfully." });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error uploading banner for user {UserId}", id);
            return StatusCode(StatusCodes.Status500InternalServerError, new ApiResponse<FileUploadDto>(UnexpectedErrorMessage));
        }
    }

    /// <summary>
    /// Updates notification preferences for the authenticated user.
    /// </summary>
    [Authorize]
    [HttpPut("{id:guid}/notifications")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<ApiResponse<object>>> UpdateNotificationsAsync(Guid id, [FromBody] NotificationsDto? dto)
    {
        if (dto is null)
        {
            return BadRequest(new ApiResponse<object>("Request body is required."));
        }

        if (!TryGetUserIdFromClaims(out var currentUserId))
        {
            return Unauthorized(new ApiResponse<object>("Unable to determine the current user."));
        }

        if (currentUserId != id)
        {
            return Forbid();
        }

        if (dto.UserId != Guid.Empty && dto.UserId != id)
        {
            return BadRequest(new ApiResponse<object>("Route identifier and payload identifier must match."));
        }

        dto.UserId = id;

        try
        {
            var updated = await _userService.UpdateNotificationsAsync(dto);
            if (!updated)
            {
                return NotFound(new ApiResponse<object>($"User with id '{id}' was not found."));
            }

            var response = new ApiResponse<object>
            {
                Message = "Notification preferences updated successfully.",
                Data = null
            };

            return Ok(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating notifications for user {UserId}", id);
            return StatusCode(StatusCodes.Status500InternalServerError, new ApiResponse<object>(UnexpectedErrorMessage));
        }
    }

    private async Task<ActionResult<ApiResponse<UserDto>>> GetUserInternalAsync(Guid id)
    {
        try
        {
            var user = await _userService.GetUserAsync(id);
            if (user is null)
            {
                return NotFound(new ApiResponse<UserDto>($"User with id '{id}' was not found."));
            }

            return Ok(new ApiResponse<UserDto>(user));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving user {UserId}", id);
            return StatusCode(StatusCodes.Status500InternalServerError, new ApiResponse<UserDto>(UnexpectedErrorMessage));
        }
    }

    private bool TryGetUserIdFromClaims(out Guid userId)
    {
        var identifier = User.FindFirstValue(ClaimTypes.NameIdentifier);
        return Guid.TryParse(identifier, out userId);
    }
}


