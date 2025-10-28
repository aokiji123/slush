using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Application.DTOs;
using Application.Interfaces;
using Application.Common.Exceptions;
using AutoMapper;
using Domain.Entities;
using Domain.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Infrastructure.Services;

public class ChatService : IChatService
{
    private readonly IChatMessageRepository _chatMessageRepository;
    private readonly IFriendshipRepository _friendshipRepository;
    private readonly IUserBlockRepository _userBlockRepository;
    private readonly IStorageService _storageService;
    private readonly IMapper _mapper;
    private readonly ILogger<ChatService> _logger;

    public ChatService(
        IChatMessageRepository chatMessageRepository,
        IFriendshipRepository friendshipRepository,
        IUserBlockRepository userBlockRepository,
        IStorageService storageService,
        IMapper mapper,
        ILogger<ChatService> logger)
    {
        _chatMessageRepository = chatMessageRepository;
        _friendshipRepository = friendshipRepository;
        _userBlockRepository = userBlockRepository;
        _storageService = storageService;
        _mapper = mapper;
        _logger = logger;
    }

    public async Task<ChatMessageDto> SendTextMessageAsync(Guid senderId, SendTextMessageDto dto)
    {
        _logger.LogInformation("Sending text message from {SenderId} to {ReceiverId}", senderId, dto.ReceiverId);

        // Validate friendship
        await ValidateFriendshipAsync(senderId, dto.ReceiverId);

        // Check if users have blocked each other
        var isBlocked = await _userBlockRepository.IsBlockedAsync(senderId, dto.ReceiverId);
        if (isBlocked)
        {
            throw new UnauthorizedException("Cannot send message to blocked user");
        }

        // Create message
        var message = _mapper.Map<ChatMessage>(dto);
        message.SenderId = senderId;
        message.MessageType = ChatMessageType.Text;

        // Save message
        var savedMessage = await _chatMessageRepository.CreateAsync(message);
        _logger.LogInformation("Text message saved with ID: {MessageId}", savedMessage.Id);

        return _mapper.Map<ChatMessageDto>(savedMessage);
    }

    public async Task<ChatMessageDto> SendMediaMessageAsync(Guid senderId, SendMediaMessageDto dto)
    {
        _logger.LogInformation("Sending media message from {SenderId} to {ReceiverId}", senderId, dto.ReceiverId);

        // Validate friendship
        await ValidateFriendshipAsync(senderId, dto.ReceiverId);

        // Check if users have blocked each other
        var isBlocked = await _userBlockRepository.IsBlockedAsync(senderId, dto.ReceiverId);
        if (isBlocked)
        {
            throw new UnauthorizedException("Cannot send message to blocked user");
        }

        // Create message
        var message = _mapper.Map<ChatMessage>(dto);
        message.SenderId = senderId;
        message.MessageType = (ChatMessageType)dto.MessageType;

        // Create attachment if media URL is provided
        if (!string.IsNullOrEmpty(dto.MediaUrl))
        {
            var attachment = new ChatMessageAttachment
            {
                AttachmentType = (ChatMessageType)dto.MessageType,
                Url = dto.MediaUrl,
                FileName = dto.FileName ?? "unknown",
                FileSize = dto.FileSize,
                ContentType = dto.ContentType,
                CreatedAt = DateTime.UtcNow
            };
            
            message.Attachments.Add(attachment);
        }

        // Save message with attachment in a single operation
        var savedMessage = await _chatMessageRepository.CreateAsync(message);
        _logger.LogInformation("Media message saved with ID: {MessageId}", savedMessage.Id);

        return _mapper.Map<ChatMessageDto>(savedMessage);
    }

    /// <summary>
    /// Determines the message type based on file content type and extension
    /// </summary>
    public static ChatMessageTypeDto DetermineMessageType(string contentType, string fileName)
    {
        var extension = Path.GetExtension(fileName).ToLowerInvariant();
        
        // Check by content type first
        if (contentType.StartsWith("image/"))
            return ChatMessageTypeDto.Image;
        if (contentType.StartsWith("video/"))
            return ChatMessageTypeDto.Video;
        if (contentType.StartsWith("audio/"))
            return ChatMessageTypeDto.Audio;
            
        // Fallback to file extension
        var imageExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif", ".webp", ".bmp", ".svg" };
        var videoExtensions = new[] { ".mp4", ".webm", ".mov", ".avi", ".mkv" };
        var audioExtensions = new[] { ".mp3", ".wav", ".ogg", ".m4a", ".aac", ".flac" };
        
        if (imageExtensions.Contains(extension))
            return ChatMessageTypeDto.Image;
        if (videoExtensions.Contains(extension))
            return ChatMessageTypeDto.Video;
        if (audioExtensions.Contains(extension))
            return ChatMessageTypeDto.Audio;
            
        // Default to text for other files (documents, etc.)
        return ChatMessageTypeDto.Text;
    }

    public async Task<FileUploadDto> UploadChatMediaAsync(IFormFile file, Guid userId)
    {
        _logger.LogInformation("Uploading chat media file: {FileName} for user {UserId}", file.FileName, userId);

        // Validate file
        var validation = _storageService.ValidateChatMediaFile(file);
        if (!validation.IsValid)
        {
            throw new ValidationException(validation.ErrorMessage);
        }

        // Upload file
        var folder = $"chat/{userId}";
        var result = await _storageService.UploadFileAsync(file, folder);

        _logger.LogInformation("Chat media uploaded successfully: {Url}", result.Url);
        return result;
    }

    public async Task<IReadOnlyList<ChatMessageDto>> GetConversationHistoryAsync(Guid userId, Guid friendId, int page = 1, int pageSize = 50)
    {
        _logger.LogInformation("Getting conversation history between {UserId} and {FriendId}, page {Page}", userId, friendId, page);

        // Validate friendship
        await ValidateFriendshipAsync(userId, friendId);

        var messages = await _chatMessageRepository.GetConversationAsync(userId, friendId, page, pageSize);
        return _mapper.Map<IReadOnlyList<ChatMessageDto>>(messages);
    }

    public async Task<IReadOnlyList<ChatConversationDto>> GetConversationsAsync(Guid userId, int page = 1, int pageSize = 20)
    {
        _logger.LogInformation("Getting conversations for user {UserId}, page {Page}", userId, page);

        var messages = await _chatMessageRepository.GetConversationsAsync(userId, page, pageSize);
        var conversations = new List<ChatConversationDto>();

        foreach (var message in messages)
        {
            var friendId = message.SenderId == userId ? message.ReceiverId : message.SenderId;
            var friend = message.SenderId == userId ? message.Receiver : message.Sender;

            conversations.Add(new ChatConversationDto
            {
                FriendId = friendId,
                FriendNickname = friend?.Nickname ?? string.Empty,
                FriendAvatar = friend?.Avatar,
                FriendIsOnline = friend?.IsOnline ?? false,
                LastMessage = _mapper.Map<ChatMessageDto>(message),
                UnreadCount = 0, // Not implementing read receipts for now
                LastActivityAt = message.CreatedAt
            });
        }

        return conversations;
    }

    public async Task DeleteMessageAsync(Guid messageId, Guid userId)
    {
        _logger.LogInformation("Deleting message {MessageId} for user {UserId}", messageId, userId);

        var message = await _chatMessageRepository.GetByIdAsync(messageId);
        if (message == null)
        {
            throw new NotFoundException("Message not found");
        }

        // Check if user is the sender
        if (message.SenderId != userId)
        {
            throw new UnauthorizedException("You can only delete your own messages");
        }

        await _chatMessageRepository.MarkAsDeletedAsync(messageId);
        _logger.LogInformation("Message {MessageId} deleted successfully", messageId);
    }

    public async Task<bool> ValidateFriendshipAsync(Guid userId1, Guid userId2)
    {
        var friendship = await _friendshipRepository.ExistsForPairAsync(userId1, userId2);
        if (!friendship)
        {
            throw new UnauthorizedException("You can only send messages to friends");
        }

        return true;
    }

    public async Task<ChatMessageDto?> GetMessageAsync(Guid messageId, Guid userId)
    {
        var message = await _chatMessageRepository.GetByIdWithAttachmentsAsync(messageId);
        if (message == null)
        {
            return null;
        }

        // Check if user is part of the conversation
        if (message.SenderId != userId && message.ReceiverId != userId)
        {
            throw new UnauthorizedException("You can only view messages from your conversations");
        }

        return _mapper.Map<ChatMessageDto>(message);
    }

    public async Task<ChatMessageDto?> GetLastMessageAsync(Guid userId1, Guid userId2)
    {
        var message = await _chatMessageRepository.GetLastMessageAsync(userId1, userId2);
        return message != null ? _mapper.Map<ChatMessageDto>(message) : null;
    }

    public async Task ClearConversationHistoryAsync(Guid userId, Guid friendId)
    {
        _logger.LogInformation("Clearing conversation history between {UserId} and {FriendId}", userId, friendId);

        // Validate friendship
        await ValidateFriendshipAsync(userId, friendId);

        await _chatMessageRepository.ClearConversationAsync(userId, friendId);
        
        _logger.LogInformation("Conversation history cleared successfully between {UserId} and {FriendId}", userId, friendId);
    }

    public async Task<IReadOnlyList<ChatMessageDto>> GetConversationMediaAsync(Guid userId, Guid friendId, string mediaType, int page = 1, int pageSize = 50)
    {
        _logger.LogInformation("Getting {MediaType} media for conversation between {UserId} and {FriendId}, page {Page}", 
            mediaType, userId, friendId, page);

        // Validate friendship
        await ValidateFriendshipAsync(userId, friendId);

        // Map media type string to ChatMessageType
        ChatMessageType? messageType = mediaType.ToLower() switch
        {
            "photos" => ChatMessageType.Image,
            "voice" => ChatMessageType.Audio,
            "files" => null, // Files are documents with Text type but has attachments
            _ => null
        };

        // Get all messages and filter
        var messages = await _chatMessageRepository.GetConversationAsync(userId, friendId, 1, 1000);
        
        var filteredMessages = messages.Where(m =>
        {
            if (mediaType.ToLower() == "photos")
                return m.MessageType == ChatMessageType.Image;
            
            if (mediaType.ToLower() == "voice")
                return m.MessageType == ChatMessageType.Audio;
            
            if (mediaType.ToLower() == "files")
                return m.MessageType == ChatMessageType.Text && 
                       !string.IsNullOrEmpty(m.MediaUrl) && 
                       !string.IsNullOrEmpty(m.FileName);
            
            return false;
        }).ToList();

        // Apply pagination
        var paginatedMessages = filteredMessages
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToList();

        return _mapper.Map<IReadOnlyList<ChatMessageDto>>(paginatedMessages);
    }

    public async Task<MediaCountsDto> GetConversationMediaCountsAsync(Guid userId, Guid friendId)
    {
        _logger.LogInformation("Getting media counts for conversation between {UserId} and {FriendId}", userId, friendId);

        // Validate friendship
        await ValidateFriendshipAsync(userId, friendId);

        // Get all messages
        var messages = await _chatMessageRepository.GetConversationAsync(userId, friendId, 1, 1000);

        return new MediaCountsDto
        {
            PhotosCount = messages.Count(m => m.MessageType == ChatMessageType.Image),
            VoiceCount = messages.Count(m => m.MessageType == ChatMessageType.Audio),
            FilesCount = messages.Count(m => m.MessageType == ChatMessageType.Text && 
                                            !string.IsNullOrEmpty(m.MediaUrl) && 
                                            !string.IsNullOrEmpty(m.FileName))
        };
    }
}
