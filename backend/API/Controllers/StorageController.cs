using System;
using System.Security.Claims;
using System.Threading.Tasks;
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
public class StorageController : ControllerBase
{
    private readonly IStorageService _storageService;
    private readonly ILogger<StorageController> _logger;

    public StorageController(IStorageService storageService, ILogger<StorageController> logger)
    {
        _storageService = storageService;
        _logger = logger;
    }

    /// <summary>
    /// Uploads a user avatar image
    /// </summary>
    /// <param name="file">The avatar image file</param>
    /// <returns>File upload result with public URL</returns>
    [HttpPost("upload/avatar")]
    [ProducesResponseType(typeof(FileUploadDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> UploadAvatar(IFormFile file)
    {
        if (file == null)
        {
            return BadRequest(new { message = "No file provided" });
        }

        // Validate file
        var validation = _storageService.ValidateAvatarFile(file);
        if (!validation.IsValid)
        {
            return BadRequest(new { message = validation.ErrorMessage });
        }

        try
        {
            var userId = GetCurrentUserId();
            var folder = $"avatars/{userId}";
            var result = await _storageService.UploadFileAsync(file, folder);

            var dto = new FileUploadDto
            {
                Url = result.Url,
                FileName = result.FileName,
                FileSize = result.FileSize,
                ContentType = result.ContentType,
                FilePath = result.FilePath
            };

            return Ok(dto);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error uploading avatar for user {UserId}", GetCurrentUserId());
            return StatusCode(StatusCodes.Status500InternalServerError, new { message = "Failed to upload avatar" });
        }
    }

    /// <summary>
    /// Uploads community media (images/videos for posts)
    /// </summary>
    /// <param name="file">The media file</param>
    /// <param name="postId">The post ID this media belongs to</param>
    /// <returns>File upload result with public URL</returns>
    [HttpPost("upload/community")]
    [ProducesResponseType(typeof(FileUploadDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> UploadCommunityMedia(IFormFile file, [FromQuery] Guid postId)
    {
        if (file == null)
        {
            return BadRequest(new { message = "No file provided" });
        }

        if (postId == Guid.Empty)
        {
            return BadRequest(new { message = "Post ID is required" });
        }

        // Validate file
        var validation = _storageService.ValidateCommunityMediaFile(file);
        if (!validation.IsValid)
        {
            return BadRequest(new { message = validation.ErrorMessage });
        }

        try
        {
            var folder = $"community/posts/{postId}";
            var result = await _storageService.UploadFileAsync(file, folder);

            var dto = new FileUploadDto
            {
                Url = result.Url,
                FileName = result.FileName,
                FileSize = result.FileSize,
                ContentType = result.ContentType,
                FilePath = result.FilePath
            };

            return Ok(dto);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error uploading community media for post {PostId}", postId);
            return StatusCode(StatusCodes.Status500InternalServerError, new { message = "Failed to upload media" });
        }
    }

    /// <summary>
    /// Deletes a file from storage
    /// </summary>
    /// <param name="filePath">The path to the file to delete</param>
    /// <returns>Success status</returns>
    [HttpDelete("{*filePath}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> DeleteFile(string filePath)
    {
        if (string.IsNullOrEmpty(filePath))
        {
            return BadRequest(new { message = "File path is required" });
        }

        try
        {
            var success = await _storageService.DeleteFileAsync(filePath);
            if (!success)
            {
                return BadRequest(new { message = "Failed to delete file" });
            }

            return Ok(new { message = "File deleted successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting file {FilePath}", filePath);
            return StatusCode(StatusCodes.Status500InternalServerError, new { message = "Failed to delete file" });
        }
    }

    private Guid GetCurrentUserId()
    {
        var identifier = User.FindFirstValue(ClaimTypes.NameIdentifier);
        return Guid.Parse(identifier ?? throw new UnauthorizedAccessException("User ID not found"));
    }
}
