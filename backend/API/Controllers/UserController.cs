using System;
using System.Threading.Tasks;
using Application.DTOs;
using Application.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace API.Controllers;

[ApiController]
[Route("user")]
public class UserController : ControllerBase
{
    private readonly IUserService _userService;
    private readonly ILogger<UserController> _logger;

    public UserController(IUserService userService, ILogger<UserController> logger)
    {
        _userService = userService;
        _logger = logger;
    }

    // GET /user/{id}
    [HttpGet("{id:guid}")]
    public async Task<ActionResult<UserDto>> GetUser(Guid id)
    {
        if (id == Guid.Empty) return BadRequest("Invalid user id");
        try
        {
            var user = await _userService.GetUserAsync(id);
            if (user == null) return NotFound();
            return Ok(user);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting user {UserId}", id);
            return StatusCode(500, "Internal server error");
        }
    }

    // PUT /user/{id}
    [HttpPut("{id:guid}")]
    public async Task<ActionResult<UserDto>> UpdateUser(Guid id, [FromBody] UserUpdateDto dto)
    {
        if (id == Guid.Empty) return BadRequest("Invalid user id");
        if (dto == null) return BadRequest("Body is required");
        try
        {
            var updated = await _userService.UpdateUserAsync(id, dto);
            if (updated == null) return NotFound();
            return Ok(updated);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating user {UserId}", id);
            return StatusCode(500, "Internal server error");
        }
    }

    // PUT /user/{id}/addBalance
    [HttpPut("{id:guid}/addBalance")]
    public async Task<ActionResult> AddBalance(Guid id, [FromBody] UserBalanceDto dto)
    {
        if (id == Guid.Empty) return BadRequest("Invalid user id");
        if (dto == null) return BadRequest("Body is required");
        if (dto.AmountToAdd <= 0) return BadRequest("Amount must be positive");
        try
        {
            var ok = await _userService.AddBalanceAsync(id, dto.AmountToAdd);
            if (!ok) return NotFound();
            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error adding balance to user {UserId}", id);
            return StatusCode(500, "Internal server error");
        }
    }

    // DELETE /user/{id}
    [HttpDelete("{id:guid}")]
    public async Task<ActionResult> DeleteUser(Guid id, [FromBody] UserDeleteDto dto)
    {
        if (id == Guid.Empty) return BadRequest("Invalid user id");
        if (dto == null) return BadRequest("Body is required");
        if (string.IsNullOrWhiteSpace(dto.Nickname) || string.IsNullOrWhiteSpace(dto.Password) || string.IsNullOrWhiteSpace(dto.ConfirmPassword))
            return BadRequest("Nickname, password and confirm-password are required");
        if (dto.Password != dto.ConfirmPassword) return BadRequest("Passwords do not match");
        try
        {
            dto.UserId = id;
            var ok = await _userService.DeleteUserAsync(dto);
            if (!ok) return NotFound();
            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting user {UserId}", id);
            return StatusCode(500, "Internal server error");
        }
    }

    // PUT /user/notifications
    [HttpPut("notifications")]
    public async Task<ActionResult> UpdateNotifications([FromBody] NotificationsDto dto)
    {
        if (dto == null) return BadRequest("Body is required");
        if (dto.UserId == Guid.Empty) return BadRequest("Invalid user id");
        try
        {
            var ok = await _userService.UpdateNotificationsAsync(dto);
            if (!ok) return NotFound();
            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating notifications for user {UserId}", dto.UserId);
            return StatusCode(500, "Internal server error");
        }
    }
}


