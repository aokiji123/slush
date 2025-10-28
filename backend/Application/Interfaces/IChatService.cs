using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Application.DTOs;
using Microsoft.AspNetCore.Http;

namespace Application.Interfaces;

public interface IChatService
{
    /// <summary>
    /// Sends a text message between friends
    /// </summary>
    Task<ChatMessageDto> SendTextMessageAsync(Guid senderId, SendTextMessageDto dto);

    /// <summary>
    /// Sends a media message between friends
    /// </summary>
    Task<ChatMessageDto> SendMediaMessageAsync(Guid senderId, SendMediaMessageDto dto);

    /// <summary>
    /// Uploads a media file for chat
    /// </summary>
    Task<FileUploadDto> UploadChatMediaAsync(IFormFile file, Guid userId);

    /// <summary>
    /// Gets conversation history between two users
    /// </summary>
    Task<IReadOnlyList<ChatMessageDto>> GetConversationHistoryAsync(Guid userId, Guid friendId, int page = 1, int pageSize = 50);

    /// <summary>
    /// Gets all conversations for a user
    /// </summary>
    Task<IReadOnlyList<ChatConversationDto>> GetConversationsAsync(Guid userId, int page = 1, int pageSize = 20);

    /// <summary>
    /// Deletes a message (soft delete)
    /// </summary>
    Task DeleteMessageAsync(Guid messageId, Guid userId);

    /// <summary>
    /// Validates that two users are friends
    /// </summary>
    Task<bool> ValidateFriendshipAsync(Guid userId1, Guid userId2);

    /// <summary>
    /// Gets a specific message by ID
    /// </summary>
    Task<ChatMessageDto?> GetMessageAsync(Guid messageId, Guid userId);

    /// <summary>
    /// Gets the last message in a conversation
    /// </summary>
    Task<ChatMessageDto?> GetLastMessageAsync(Guid userId1, Guid userId2);

    /// <summary>
    /// Clears conversation history between two users
    /// </summary>
    Task ClearConversationHistoryAsync(Guid userId, Guid friendId);

    /// <summary>
    /// Gets conversation media filtered by type (photos, files, voice messages)
    /// </summary>
    Task<IReadOnlyList<ChatMessageDto>> GetConversationMediaAsync(Guid userId, Guid friendId, string mediaType, int page = 1, int pageSize = 50);

    /// <summary>
    /// Gets media counts for a conversation (photos, files, voice messages)
    /// </summary>
    Task<MediaCountsDto> GetConversationMediaCountsAsync(Guid userId, Guid friendId);
}
