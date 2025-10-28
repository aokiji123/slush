using System;
using System.Collections.Generic;
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
public class BadgeController : ControllerBase
{
    private readonly IBadgeService _badgeService;
    private readonly ILogger<BadgeController> _logger;

    public BadgeController(IBadgeService badgeService, ILogger<BadgeController> logger)
    {
        _badgeService = badgeService;
        _logger = logger;
    }

    /// <summary>
    /// Awards the first N available badges to a user by nickname
    /// </summary>
    [HttpPost("award/{nickname}")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<ApiResponse<object>>> AwardBadgesByNickname(string nickname, [FromQuery] int count = 5)
    {
        if (string.IsNullOrWhiteSpace(nickname))
        {
            return BadRequest(new ApiResponse<object>("Nickname cannot be empty."));
        }
        if (count <= 0)
        {
            return BadRequest(new ApiResponse<object>("Count must be greater than zero."));
        }

        try
        {
            var awarded = await _badgeService.AwardBadgesByNicknameAsync(nickname, count);
            return Ok(new ApiResponse<object>($"Awarded {awarded} badge(s) to {nickname}."));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error awarding badges to user {Nickname}", nickname);
            return StatusCode(StatusCodes.Status500InternalServerError, new ApiResponse<object>("Unable to award badges."));
        }
    }

    /// <summary>
    /// Gets all available badges
    /// </summary>
    [HttpGet("all")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<ApiResponse<IEnumerable<BadgeDto>>>> GetAllBadges()
    {
        try
        {
            var badges = await _badgeService.GetAllBadgesAsync();
            return Ok(new ApiResponse<IEnumerable<BadgeDto>>(badges));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving all badges");
            return StatusCode(StatusCodes.Status500InternalServerError, 
                new ApiResponse<IEnumerable<BadgeDto>>("Unable to retrieve badges."));
        }
    }

    /// <summary>
    /// Gets user's earned badges
    /// </summary>
    [HttpGet("user/{userId:guid}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<ApiResponse<IEnumerable<UserBadgeDto>>>> GetUserBadges(Guid userId)
    {
        if (userId == Guid.Empty)
        {
            return BadRequest(new ApiResponse<IEnumerable<UserBadgeDto>>("User ID cannot be empty."));
        }

        try
        {
            var badges = await _badgeService.GetUserBadgesAsync(userId);
            return Ok(new ApiResponse<IEnumerable<UserBadgeDto>>(badges));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving badges for user {UserId}", userId);
            return StatusCode(StatusCodes.Status500InternalServerError, 
                new ApiResponse<IEnumerable<UserBadgeDto>>("Unable to retrieve user badges."));
        }
    }

    /// <summary>
    /// Checks and awards badges for a user (admin only)
    /// </summary>
    [HttpPost("check/{userId:guid}")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<ApiResponse<object>>> CheckAndAwardBadges(Guid userId)
    {
        if (userId == Guid.Empty)
        {
            return BadRequest(new ApiResponse<object>("User ID cannot be empty."));
        }

        try
        {
            await _badgeService.CheckAndAwardBadgesAsync(userId);
            return Ok(new ApiResponse<object>("Badges checked and awarded successfully."));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error checking and awarding badges for user {UserId}", userId);
            return StatusCode(StatusCodes.Status500InternalServerError, 
                new ApiResponse<object>("Unable to check and award badges."));
        }
    }
}
