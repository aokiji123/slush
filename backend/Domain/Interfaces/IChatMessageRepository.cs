using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Domain.Entities;

namespace Domain.Interfaces;

public interface IChatMessageRepository
{
    /// <summary>
    /// Creates a new chat message
    /// </summary>
    Task<ChatMessage> CreateAsync(ChatMessage message);

    /// <summary>
    /// Gets a conversation between two users with pagination
    /// </summary>
    Task<IReadOnlyList<ChatMessage>> GetConversationAsync(Guid userId1, Guid userId2, int page = 1, int pageSize = 50);

    /// <summary>
    /// Gets a specific message by ID
    /// </summary>
    Task<ChatMessage?> GetByIdAsync(Guid messageId);

    /// <summary>
    /// Gets a specific message by ID with attachments
    /// </summary>
    Task<ChatMessage?> GetByIdWithAttachmentsAsync(Guid messageId);

    /// <summary>
    /// Updates an existing message
    /// </summary>
    Task<ChatMessage> UpdateAsync(ChatMessage message);

    /// <summary>
    /// Soft deletes a message (marks as deleted)
    /// </summary>
    Task MarkAsDeletedAsync(Guid messageId);

    /// <summary>
    /// Permanently deletes a message
    /// </summary>
    Task DeleteAsync(ChatMessage message);

    /// <summary>
    /// Gets all conversations for a user with last message preview
    /// </summary>
    Task<IReadOnlyList<ChatMessage>> GetConversationsAsync(Guid userId, int page = 1, int pageSize = 20);

    /// <summary>
    /// Gets unread message count for a user
    /// </summary>
    Task<int> GetUnreadCountAsync(Guid userId);

    /// <summary>
    /// Marks messages as read for a conversation
    /// </summary>
    Task MarkMessagesAsReadAsync(Guid userId, Guid friendId);

    /// <summary>
    /// Gets the last message in a conversation
    /// </summary>
    Task<ChatMessage?> GetLastMessageAsync(Guid userId1, Guid userId2);

    /// <summary>
    /// Clears all messages in a conversation between two users
    /// </summary>
    Task ClearConversationAsync(Guid userId1, Guid userId2);
}
