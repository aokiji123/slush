using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Application.DTOs;
using Application.Interfaces;
using Application.Common.Exceptions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using API.Helpers;
using API.Models;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ChatController : ControllerBase
{
    private readonly IChatService _chatService;
    private readonly IStorageService _storageService;
    private readonly ILogger<ChatController> _logger;

    public ChatController(IChatService chatService, IStorageService storageService, ILogger<ChatController> logger)
    {
        _chatService = chatService;
        _storageService = storageService;
        _logger = logger;
    }

    /// <summary>
    /// Gets all conversations for the current user
    /// </summary>
    /// <param name="page">Page number (default: 1)</param>
    /// <param name="pageSize">Page size (default: 20)</param>
    /// <returns>List of conversations with last message preview</returns>
    [HttpGet("conversations")]
    [ProducesResponseType(typeof(ApiResponse<IReadOnlyList<ChatConversationDto>>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<ApiResponse<IReadOnlyList<ChatConversationDto>>>> GetConversations(
        [FromQuery] int page = 1, 
        [FromQuery] int pageSize = 20)
    {
        try
        {
            var userId = ClaimsHelper.GetUserIdOrThrow(User);
            _logger.LogInformation("Getting conversations for user {UserId}, page {Page}", userId, page);

            var conversations = await _chatService.GetConversationsAsync(userId, page, pageSize);
            return Ok(ApiResponse<IReadOnlyList<ChatConversationDto>>.CreateSuccess(conversations));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting conversations for user {UserId}", ClaimsHelper.GetUserId(User));
            return StatusCode(500, ApiResponse<IReadOnlyList<ChatConversationDto>>.CreateError("Failed to get conversations"));
        }
    }

    /// <summary>
    /// Gets conversation history between the current user and a friend
    /// </summary>
    /// <param name="friendId">Friend's user ID</param>
    /// <param name="page">Page number (default: 1)</param>
    /// <param name="pageSize">Page size (default: 50)</param>
    /// <returns>List of messages in the conversation</returns>
    [HttpGet("messages/{friendId}")]
    [ProducesResponseType(typeof(ApiResponse<IReadOnlyList<ChatMessageDto>>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<ApiResponse<IReadOnlyList<ChatMessageDto>>>> GetConversationHistory(
        Guid friendId,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 50)
    {
        try
        {
            var userId = ClaimsHelper.GetUserIdOrThrow(User);
            _logger.LogInformation("Getting conversation history between {UserId} and {FriendId}, page {Page}", userId, friendId, page);

            var messages = await _chatService.GetConversationHistoryAsync(userId, friendId, page, pageSize);
            return Ok(ApiResponse<IReadOnlyList<ChatMessageDto>>.CreateSuccess(messages));
        }
        catch (UnauthorizedException ex)
        {
            _logger.LogWarning(ex, "Unauthorized access to conversation history between {UserId} and {FriendId}", 
                ClaimsHelper.GetUserId(User), friendId);
            return Unauthorized(ApiResponse<IReadOnlyList<ChatMessageDto>>.CreateError(ex.Message));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting conversation history between {UserId} and {FriendId}", 
                ClaimsHelper.GetUserId(User), friendId);
            return StatusCode(500, ApiResponse<IReadOnlyList<ChatMessageDto>>.CreateError("Failed to get conversation history"));
        }
    }

    /// <summary>
    /// Uploads a media file for chat
    /// </summary>
    /// <param name="file">The media file to upload</param>
    /// <returns>File upload result with URL and metadata</returns>
    [HttpPost("upload")]
    [ProducesResponseType(typeof(ApiResponse<FileUploadDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<ApiResponse<FileUploadDto>>> UploadMedia(IFormFile file)
    {
        try
        {
            var userId = ClaimsHelper.GetUserIdOrThrow(User);
            _logger.LogInformation("Uploading chat media file: {FileName} for user {UserId}", file.FileName, userId);

            if (file == null || file.Length == 0)
            {
                return BadRequest(ApiResponse<FileUploadDto>.CreateError("No file provided"));
            }

            var result = await _chatService.UploadChatMediaAsync(file, userId);
            _logger.LogInformation("Chat media uploaded successfully: {Url}", result.Url);

            return Ok(ApiResponse<FileUploadDto>.CreateSuccess(result));
        }
        catch (ValidationException ex)
        {
            _logger.LogWarning(ex, "Invalid file upload for user {UserId}: {Message}", 
                ClaimsHelper.GetUserId(User), ex.Message);
            return BadRequest(ApiResponse<FileUploadDto>.CreateError(ex.Message));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error uploading chat media for user {UserId}", ClaimsHelper.GetUserId(User));
            return StatusCode(500, ApiResponse<FileUploadDto>.CreateError("Failed to upload media file"));
        }
    }

    /// <summary>
    /// Deletes a message
    /// </summary>
    /// <param name="messageId">Message ID to delete</param>
    /// <returns>Success response</returns>
    [HttpDelete("messages/{messageId}")]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<ApiResponse<object>>> DeleteMessage(Guid messageId)
    {
        try
        {
            var userId = ClaimsHelper.GetUserIdOrThrow(User);
            _logger.LogInformation("Deleting message {MessageId} for user {UserId}", messageId, userId);

            await _chatService.DeleteMessageAsync(messageId, userId);
            _logger.LogInformation("Message {MessageId} deleted successfully", messageId);

            return Ok(ApiResponse<object>.CreateSuccess(null, "Message deleted successfully"));
        }
        catch (NotFoundException ex)
        {
            _logger.LogWarning(ex, "Message {MessageId} not found for user {UserId}", messageId, ClaimsHelper.GetUserId(User));
            return NotFound(ApiResponse<object>.CreateError(ex.Message));
        }
        catch (UnauthorizedException ex)
        {
            _logger.LogWarning(ex, "Unauthorized deletion of message {MessageId} by user {UserId}", 
                messageId, ClaimsHelper.GetUserId(User));
            return Unauthorized(ApiResponse<object>.CreateError(ex.Message));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting message {MessageId} for user {UserId}", messageId, ClaimsHelper.GetUserId(User));
            return StatusCode(500, ApiResponse<object>.CreateError("Failed to delete message"));
        }
    }

    /// <summary>
    /// Gets a specific message by ID
    /// </summary>
    /// <param name="messageId">Message ID</param>
    /// <returns>Message details</returns>
    [HttpGet("messages/details/{messageId}")]
    [ProducesResponseType(typeof(ApiResponse<ChatMessageDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<ApiResponse<ChatMessageDto>>> GetMessage(Guid messageId)
    {
        try
        {
            var userId = ClaimsHelper.GetUserIdOrThrow(User);
            _logger.LogInformation("Getting message {MessageId} for user {UserId}", messageId, userId);

            var message = await _chatService.GetMessageAsync(messageId, userId);
            if (message == null)
            {
                return NotFound(ApiResponse<ChatMessageDto>.CreateError("Message not found"));
            }

            return Ok(ApiResponse<ChatMessageDto>.CreateSuccess(message));
        }
        catch (UnauthorizedException ex)
        {
            _logger.LogWarning(ex, "Unauthorized access to message {MessageId} by user {UserId}", 
                messageId, ClaimsHelper.GetUserId(User));
            return Unauthorized(ApiResponse<ChatMessageDto>.CreateError(ex.Message));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting message {MessageId} for user {UserId}", messageId, ClaimsHelper.GetUserId(User));
            return StatusCode(500, ApiResponse<ChatMessageDto>.CreateError("Failed to get message"));
        }
    }

    /// <summary>
    /// Send a text message (for testing purposes)
    /// </summary>
    /// <param name="dto">Message data</param>
    /// <returns>Created message</returns>
    [HttpPost("send-text")]
    [ProducesResponseType(typeof(ApiResponse<ChatMessageDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<ApiResponse<ChatMessageDto>>> SendTextMessage([FromBody] SendTextMessageDto dto)
    {
        try
        {
            var userId = ClaimsHelper.GetUserIdOrThrow(User);
            _logger.LogInformation("Sending text message from {UserId} to {ReceiverId}", userId, dto.ReceiverId);

            var message = await _chatService.SendTextMessageAsync(userId, dto);
            _logger.LogInformation("Text message sent successfully with ID: {MessageId}", message.Id);

            return Ok(ApiResponse<ChatMessageDto>.CreateSuccess(message));
        }
        catch (ValidationException ex)
        {
            _logger.LogWarning(ex, "Invalid message data for user {UserId}: {Message}", 
                ClaimsHelper.GetUserId(User), ex.Message);
            return BadRequest(ApiResponse<ChatMessageDto>.CreateError(ex.Message));
        }
        catch (UnauthorizedException ex)
        {
            _logger.LogWarning(ex, "Unauthorized message send from {UserId} to {ReceiverId}", 
                ClaimsHelper.GetUserId(User), dto.ReceiverId);
            return Unauthorized(ApiResponse<ChatMessageDto>.CreateError(ex.Message));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error sending text message from {UserId} to {ReceiverId}", 
                ClaimsHelper.GetUserId(User), dto.ReceiverId);
            return StatusCode(500, ApiResponse<ChatMessageDto>.CreateError("Failed to send message"));
        }
    }

    /// <summary>
    /// Upload file for chat message
    /// </summary>
    /// <param name="file">File to upload</param>
    /// <param name="receiverId">Receiver ID for the message</param>
    /// <returns>File upload result with URL and metadata</returns>
    [HttpPost("upload-file")]
    [ProducesResponseType(typeof(ApiResponse<FileUploadDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<ApiResponse<FileUploadDto>>> UploadFile(
        IFormFile file, 
        [FromQuery] string receiverId)
    {
        try
        {
            var userId = ClaimsHelper.GetUserIdOrThrow(User);
            _logger.LogInformation("Uploading file for chat message from {UserId} to {ReceiverId}", userId, receiverId);
            
            // Debug logging - check what we received
            _logger.LogInformation("Request details - File: {FileName}, Size: {FileSize}, ContentType: {ContentType}", 
                file?.FileName ?? "null", 
                file?.Length ?? 0, 
                file?.ContentType ?? "null");
            
            // Check if we have any form data at all
            if (Request.HasFormContentType)
            {
                _logger.LogInformation("Request has form content type");
                foreach (var formField in Request.Form)
                {
                    _logger.LogInformation("Form field: {Key} = {Value}", formField.Key, formField.Value);
                }
            }
            else
            {
                _logger.LogWarning("Request does not have form content type. Content-Type: {ContentType}", Request.ContentType);
            }

            if (file == null || file.Length == 0)
            {
                _logger.LogWarning("File validation failed: file is null or empty");
                return BadRequest(ApiResponse<FileUploadDto>.CreateError("No file provided"));
            }

            // Validate file
            var validation = _storageService.ValidateChatMediaFile(file);
            if (!validation.IsValid)
            {
                _logger.LogWarning("Invalid file upload from {UserId}: {Error}", userId, validation.ErrorMessage);
                return BadRequest(ApiResponse<FileUploadDto>.CreateError(validation.ErrorMessage));
            }

            // Upload file to storage
            var uploadResult = await _storageService.UploadFileAsync(file, "chat-media");
            _logger.LogInformation("File uploaded successfully: {Url}", uploadResult.Url);

            return Ok(ApiResponse<FileUploadDto>.CreateSuccess(uploadResult));
        }
        catch (UnauthorizedException ex)
        {
            _logger.LogWarning(ex, "Unauthorized file upload from {UserId}", ClaimsHelper.GetUserId(User));
            return Unauthorized(ApiResponse<FileUploadDto>.CreateError(ex.Message));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error uploading file from {UserId} to {ReceiverId}", 
                ClaimsHelper.GetUserId(User), receiverId);
            return StatusCode(500, ApiResponse<FileUploadDto>.CreateError("Failed to upload file"));
        }
    }

    /// <summary>
    /// Clears all messages in a conversation between the current user and a friend
    /// </summary>
    /// <param name="friendId">Friend's user ID</param>
    /// <returns>Success response</returns>
    [HttpDelete("conversations/{friendId}")]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<ApiResponse<object>>> ClearConversationHistory(Guid friendId)
    {
        try
        {
            var userId = ClaimsHelper.GetUserIdOrThrow(User);
            _logger.LogInformation("Clearing conversation history between {UserId} and {FriendId}", userId, friendId);

            await _chatService.ClearConversationHistoryAsync(userId, friendId);
            _logger.LogInformation("Conversation history cleared successfully");

            return Ok(ApiResponse<object>.CreateSuccess(null, "Conversation history cleared successfully"));
        }
        catch (UnauthorizedException ex)
        {
            _logger.LogWarning(ex, "Unauthorized access to clear conversation history between {UserId} and {FriendId}", 
                ClaimsHelper.GetUserId(User), friendId);
            return Unauthorized(ApiResponse<object>.CreateError(ex.Message));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error clearing conversation history between {UserId} and {FriendId}", 
                ClaimsHelper.GetUserId(User), friendId);
            return StatusCode(500, ApiResponse<object>.CreateError("Failed to clear conversation history"));
        }
    }

    /// <summary>
    /// Gets media (photos, files, or voice messages) from a conversation
    /// </summary>
    /// <param name="friendId">Friend's user ID</param>
    /// <param name="mediaType">Type of media: photos, files, or voice</param>
    /// <param name="page">Page number (default: 1)</param>
    /// <param name="pageSize">Page size (default: 50)</param>
    /// <returns>List of media messages</returns>
    [HttpGet("messages/{friendId}/media")]
    [ProducesResponseType(typeof(ApiResponse<IReadOnlyList<ChatMessageDto>>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<ApiResponse<IReadOnlyList<ChatMessageDto>>>> GetConversationMedia(
        Guid friendId,
        [FromQuery] string mediaType,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 50)
    {
        try
        {
            var userId = ClaimsHelper.GetUserIdOrThrow(User);
            _logger.LogInformation("Getting {MediaType} media for conversation between {UserId} and {FriendId}, page {Page}", 
                mediaType, userId, friendId, page);

            var messages = await _chatService.GetConversationMediaAsync(userId, friendId, mediaType, page, pageSize);
            return Ok(ApiResponse<IReadOnlyList<ChatMessageDto>>.CreateSuccess(messages));
        }
        catch (UnauthorizedException ex)
        {
            _logger.LogWarning(ex, "Unauthorized access to conversation media between {UserId} and {FriendId}", 
                ClaimsHelper.GetUserId(User), friendId);
            return Unauthorized(ApiResponse<IReadOnlyList<ChatMessageDto>>.CreateError(ex.Message));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting conversation media between {UserId} and {FriendId}", 
                ClaimsHelper.GetUserId(User), friendId);
            return StatusCode(500, ApiResponse<IReadOnlyList<ChatMessageDto>>.CreateError("Failed to get conversation media"));
        }
    }

    /// <summary>
    /// Gets media counts (photos, files, voice messages) for a conversation
    /// </summary>
    /// <param name="friendId">Friend's user ID</param>
    /// <returns>Media counts</returns>
    [HttpGet("messages/{friendId}/media/counts")]
    [ProducesResponseType(typeof(ApiResponse<MediaCountsDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<ApiResponse<MediaCountsDto>>> GetConversationMediaCounts(Guid friendId)
    {
        try
        {
            var userId = ClaimsHelper.GetUserIdOrThrow(User);
            _logger.LogInformation("Getting media counts for conversation between {UserId} and {FriendId}", userId, friendId);

            var counts = await _chatService.GetConversationMediaCountsAsync(userId, friendId);
            return Ok(ApiResponse<MediaCountsDto>.CreateSuccess(counts));
        }
        catch (UnauthorizedException ex)
        {
            _logger.LogWarning(ex, "Unauthorized access to conversation media counts between {UserId} and {FriendId}", 
                ClaimsHelper.GetUserId(User), friendId);
            return Unauthorized(ApiResponse<MediaCountsDto>.CreateError(ex.Message));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting conversation media counts between {UserId} and {FriendId}", 
                ClaimsHelper.GetUserId(User), friendId);
            return StatusCode(500, ApiResponse<MediaCountsDto>.CreateError("Failed to get conversation media counts"));
        }
    }
}
