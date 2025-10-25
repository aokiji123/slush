using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.DTOs;
using Application.Interfaces;
using Infrastructure.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;
using API.Helpers;

namespace API.Hubs;

[Authorize]
public class ChatHub : Hub
{
    private readonly IChatService _chatService;
    private readonly ConnectionMappingService _connectionMapping;
    private readonly IFriendshipService _friendshipService;
    private readonly ILogger<ChatHub> _logger;
    private readonly Dictionary<Guid, DateTime> _typingUsers = new();

    public ChatHub(
        IChatService chatService,
        ConnectionMappingService connectionMapping,
        IFriendshipService friendshipService,
        ILogger<ChatHub> logger)
    {
        _chatService = chatService;
        _connectionMapping = connectionMapping;
        _friendshipService = friendshipService;
        _logger = logger;
    }

    public override async Task OnConnectedAsync()
    {
        try
        {
            var userId = ClaimsHelper.GetUserIdOrThrow(Context.User);
            var connectionId = Context.ConnectionId;

            _connectionMapping.AddConnection(userId, connectionId);
            _logger.LogInformation("User {UserId} connected with connection {ConnectionId}", userId, connectionId);

            // Join user to their personal group
            await Groups.AddToGroupAsync(connectionId, $"user_{userId}");

            // Notify friends that this user is now online
            await NotifyFriendsUserStatusChanged(userId, true);

            await base.OnConnectedAsync();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in OnConnectedAsync for connection {ConnectionId}", Context.ConnectionId);
            throw;
        }
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        try
        {
            var connectionId = Context.ConnectionId;
            var userId = _connectionMapping.GetUserId(connectionId);

            if (userId.HasValue)
            {
                _connectionMapping.RemoveConnection(connectionId);
                _logger.LogInformation("User {UserId} disconnected from connection {ConnectionId}", userId.Value, connectionId);

                // Remove from personal group
                await Groups.RemoveFromGroupAsync(connectionId, $"user_{userId.Value}");

                // Notify friends that this user is now offline
                await NotifyFriendsUserStatusChanged(userId.Value, false);
            }

            await base.OnDisconnectedAsync(exception);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in OnDisconnectedAsync for connection {ConnectionId}", Context.ConnectionId);
        }
    }

    public async Task SendTextMessage(Guid receiverId, string content)
    {
        try
        {
            var senderId = ClaimsHelper.GetUserIdOrThrow(Context.User);
            _logger.LogInformation("Sending text message from {SenderId} to {ReceiverId}", senderId, receiverId);

            var dto = new SendTextMessageDto
            {
                ReceiverId = receiverId,
                Content = content
            };

            var message = await _chatService.SendTextMessageAsync(senderId, dto);
            _logger.LogInformation("Text message saved with ID: {MessageId}", message.Id);

            // Send to receiver
            await Clients.User(receiverId.ToString()).SendAsync("ReceiveMessage", message);

            // Send confirmation to sender
            await Clients.Caller.SendAsync("MessageSent", message);

            _logger.LogInformation("Text message sent successfully from {SenderId} to {ReceiverId}", senderId, receiverId);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error sending text message from {SenderId} to {ReceiverId}", 
                ClaimsHelper.GetUserId(Context.User), receiverId);
            await Clients.Caller.SendAsync("Error", "Failed to send message");
        }
    }

    public async Task SendMediaMessage(Guid receiverId, SendMediaMessageDto dto)
    {
        try
        {
            var senderId = ClaimsHelper.GetUserIdOrThrow(Context.User);
            _logger.LogInformation("Sending media message from {SenderId} to {ReceiverId}", senderId, receiverId);

            dto.ReceiverId = receiverId;
            var message = await _chatService.SendMediaMessageAsync(senderId, dto);
            _logger.LogInformation("Media message saved with ID: {MessageId}", message.Id);

            // Send to receiver
            await Clients.User(receiverId.ToString()).SendAsync("ReceiveMessage", message);

            // Send confirmation to sender
            await Clients.Caller.SendAsync("MessageSent", message);

            _logger.LogInformation("Media message sent successfully from {SenderId} to {ReceiverId}", senderId, receiverId);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error sending media message from {SenderId} to {ReceiverId}", 
                ClaimsHelper.GetUserId(Context.User), receiverId);
            await Clients.Caller.SendAsync("Error", "Failed to send media message");
        }
    }

    public async Task StartTyping(Guid receiverId)
    {
        try
        {
            var senderId = ClaimsHelper.GetUserIdOrThrow(Context.User);
            _logger.LogDebug("User {SenderId} started typing to {ReceiverId}", senderId, receiverId);

            _typingUsers[senderId] = DateTime.UtcNow;

            var typingIndicator = new TypingIndicatorDto
            {
                UserId = senderId,
                UserNickname = Context.User?.Identity?.Name ?? "Unknown",
                IsTyping = true
            };

            await Clients.User(receiverId.ToString()).SendAsync("TypingIndicator", typingIndicator);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error sending typing indicator from {SenderId} to {ReceiverId}", 
                ClaimsHelper.GetUserId(Context.User), receiverId);
        }
    }

    public async Task StopTyping(Guid receiverId)
    {
        try
        {
            var senderId = ClaimsHelper.GetUserIdOrThrow(Context.User);
            _logger.LogDebug("User {SenderId} stopped typing to {ReceiverId}", senderId, receiverId);

            _typingUsers.Remove(senderId);

            var typingIndicator = new TypingIndicatorDto
            {
                UserId = senderId,
                UserNickname = Context.User?.Identity?.Name ?? "Unknown",
                IsTyping = false
            };

            await Clients.User(receiverId.ToString()).SendAsync("TypingIndicator", typingIndicator);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error stopping typing indicator from {SenderId} to {ReceiverId}", 
                ClaimsHelper.GetUserId(Context.User), receiverId);
        }
    }

    public async Task JoinConversation(Guid friendId)
    {
        try
        {
            var userId = ClaimsHelper.GetUserIdOrThrow(Context.User);
            var connectionId = Context.ConnectionId;

            // Validate friendship
            await _chatService.ValidateFriendshipAsync(userId, friendId);

            // Join conversation group
            var groupName = GetConversationGroupName(userId, friendId);
            await Groups.AddToGroupAsync(connectionId, groupName);

            _logger.LogInformation("User {UserId} joined conversation with {FriendId}", userId, friendId);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error joining conversation for user {UserId} with friend {FriendId}", 
                ClaimsHelper.GetUserId(Context.User), friendId);
            await Clients.Caller.SendAsync("Error", "Failed to join conversation");
        }
    }

    public async Task LeaveConversation(Guid friendId)
    {
        try
        {
            var userId = ClaimsHelper.GetUserIdOrThrow(Context.User);
            var connectionId = Context.ConnectionId;

            // Leave conversation group
            var groupName = GetConversationGroupName(userId, friendId);
            await Groups.RemoveFromGroupAsync(connectionId, groupName);

            _logger.LogInformation("User {UserId} left conversation with {FriendId}", userId, friendId);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error leaving conversation for user {UserId} with friend {FriendId}", 
                ClaimsHelper.GetUserId(Context.User), friendId);
        }
    }

    public async Task GetOnlineFriends()
    {
        try
        {
            var userId = ClaimsHelper.GetUserIdOrThrow(Context.User);
            var onlineUsers = _connectionMapping.GetOnlineUsers();
            
            // Convert Guids to strings for frontend compatibility
            var onlineUserIds = onlineUsers.Select(id => id.ToString()).ToList();
            
            await Clients.Caller.SendAsync("OnlineFriends", onlineUserIds);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting online friends for user {UserId}", 
                ClaimsHelper.GetUserId(Context.User));
            await Clients.Caller.SendAsync("Error", "Failed to get online friends");
        }
    }

    private static string GetConversationGroupName(Guid userId1, Guid userId2)
    {
        // Create a consistent group name regardless of parameter order
        var orderedIds = new[] { userId1, userId2 }.OrderBy(x => x).ToArray();
        return $"conversation_{orderedIds[0]}_{orderedIds[1]}";
    }

    private async Task NotifyFriendsUserStatusChanged(Guid userId, bool isOnline)
    {
        try
        {
            // Get all friends of this user
            var friendIds = await _friendshipService.GetFriendIdsAsync(userId);
            
            foreach (var friendId in friendIds)
            {
                // Send status update to each friend
                await Clients.Group($"user_{friendId}").SendAsync("UserStatusChanged", new
                {
                    UserId = userId.ToString(),
                    IsOnline = isOnline
                });
            }
            
            _logger.LogInformation("Notified {FriendCount} friends that user {UserId} is {Status}", 
                friendIds.Count, userId, isOnline ? "online" : "offline");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error notifying friends about user {UserId} status change", userId);
        }
    }
}
