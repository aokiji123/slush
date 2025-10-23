using System;
using System.Collections.Generic;
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
[Authorize]
public class ProfileCommentController : ControllerBase
{
    private readonly IProfileCommentService _profileCommentService;
    private readonly ILogger<ProfileCommentController> _logger;

    public ProfileCommentController(IProfileCommentService profileCommentService, ILogger<ProfileCommentController> logger)
    {
        _profileCommentService = profileCommentService;
        _logger = logger;
    }

    /// <summary>
    /// Gets all comments on a user's profile
    /// </summary>
    [HttpGet("{userId:guid}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<ApiResponse<IEnumerable<ProfileCommentDto>>>> GetProfileComments(Guid userId)
    {
        if (userId == Guid.Empty)
        {
            return BadRequest(new ApiResponse<IEnumerable<ProfileCommentDto>>("User ID cannot be empty."));
        }

        try
        {
            var comments = await _profileCommentService.GetByProfileUserIdAsync(userId);
            return Ok(new ApiResponse<IEnumerable<ProfileCommentDto>>(comments));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving profile comments for user {UserId}", userId);
            return StatusCode(StatusCodes.Status500InternalServerError, 
                new ApiResponse<IEnumerable<ProfileCommentDto>>("Unable to retrieve profile comments."));
        }
    }

    /// <summary>
    /// Adds a comment to a user's profile
    /// </summary>
    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<ApiResponse<ProfileCommentDto>>> CreateProfileComment([FromBody] CreateProfileCommentDto dto)
    {
        if (dto == null)
        {
            return BadRequest(new ApiResponse<ProfileCommentDto>("Request body is required."));
        }

        if (string.IsNullOrWhiteSpace(dto.Content))
        {
            return BadRequest(new ApiResponse<ProfileCommentDto>("Comment content is required."));
        }

        if (dto.ProfileUserId == Guid.Empty)
        {
            return BadRequest(new ApiResponse<ProfileCommentDto>("Profile user ID is required."));
        }

        try
        {
            var authorId = GetAuthenticatedUserId();
            var comment = await _profileCommentService.CreateAsync(authorId, dto);
            
            return StatusCode(StatusCodes.Status201Created, new ApiResponse<ProfileCommentDto>(comment));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating profile comment");
            return StatusCode(StatusCodes.Status500InternalServerError, 
                new ApiResponse<ProfileCommentDto>("Unable to create profile comment."));
        }
    }

    /// <summary>
    /// Deletes a profile comment (only by author or profile owner)
    /// </summary>
    [HttpDelete("{commentId:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> DeleteProfileComment(Guid commentId)
    {
        if (commentId == Guid.Empty)
        {
            return BadRequest(new ApiResponse<object>("Comment ID cannot be empty."));
        }

        try
        {
            var userId = GetAuthenticatedUserId();
            var deleted = await _profileCommentService.DeleteAsync(commentId, userId);
            
            if (!deleted)
            {
                return NotFound(new ApiResponse<object>("Comment not found or you don't have permission to delete it."));
            }

            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting profile comment {CommentId}", commentId);
            return StatusCode(StatusCodes.Status500InternalServerError, 
                new ApiResponse<object>("Unable to delete profile comment."));
        }
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
