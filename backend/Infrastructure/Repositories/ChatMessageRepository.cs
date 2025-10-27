using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain.Entities;
using Domain.Interfaces;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

public class ChatMessageRepository : IChatMessageRepository
{
    private readonly AppDbContext _context;

    public ChatMessageRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<ChatMessage> CreateAsync(ChatMessage message)
    {
        message.CreatedAt = DateTime.UtcNow;
        await _context.ChatMessages.AddAsync(message);
        await _context.SaveChangesAsync();
        return message;
    }

    public async Task<IReadOnlyList<ChatMessage>> GetConversationAsync(Guid userId1, Guid userId2, int page = 1, int pageSize = 50)
    {
        var skip = (page - 1) * pageSize;
        
        return await _context.ChatMessages
            .Where(m => !m.IsDeleted && 
                       ((m.SenderId == userId1 && m.ReceiverId == userId2) ||
                        (m.SenderId == userId2 && m.ReceiverId == userId1)))
            .Include(m => m.Sender)
            .Include(m => m.Receiver)
            .Include(m => m.Attachments)
            .OrderByDescending(m => m.CreatedAt)
            .Skip(skip)
            .Take(pageSize)
            .ToListAsync();
    }

    public async Task<ChatMessage?> GetByIdAsync(Guid messageId)
    {
        return await _context.ChatMessages
            .Where(m => m.Id == messageId && !m.IsDeleted)
            .Include(m => m.Sender)
            .Include(m => m.Receiver)
            .FirstOrDefaultAsync();
    }

    public async Task<ChatMessage?> GetByIdWithAttachmentsAsync(Guid messageId)
    {
        return await _context.ChatMessages
            .Where(m => m.Id == messageId && !m.IsDeleted)
            .Include(m => m.Sender)
            .Include(m => m.Receiver)
            .Include(m => m.Attachments)
            .FirstOrDefaultAsync();
    }

    public async Task<ChatMessage> UpdateAsync(ChatMessage message)
    {
        message.EditedAt = DateTime.UtcNow;
        message.IsEdited = true;
        _context.ChatMessages.Update(message);
        await _context.SaveChangesAsync();
        return message;
    }

    public async Task MarkAsDeletedAsync(Guid messageId)
    {
        var message = await _context.ChatMessages.FindAsync(messageId);
        if (message != null)
        {
            message.IsDeleted = true;
            message.DeletedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();
        }
    }

    public async Task DeleteAsync(ChatMessage message)
    {
        _context.ChatMessages.Remove(message);
        await _context.SaveChangesAsync();
    }

    public async Task<IReadOnlyList<ChatMessage>> GetConversationsAsync(Guid userId, int page = 1, int pageSize = 20)
    {
        var skip = (page - 1) * pageSize;

        // Step 1: Get the IDs of the latest messages for each conversation
        var latestMessageIds = await _context.ChatMessages
            .Where(m => !m.IsDeleted && (m.SenderId == userId || m.ReceiverId == userId))
            .GroupBy(m => m.SenderId == userId ? m.ReceiverId : m.SenderId)
            .Select(g => g.OrderByDescending(m => m.CreatedAt).First().Id)
            .ToListAsync();

        // Step 2: Fetch the full messages with navigation properties
        var conversations = await _context.ChatMessages
            .Where(m => latestMessageIds.Contains(m.Id))
            .Include(m => m.Sender)
            .Include(m => m.Receiver)
            .Include(m => m.Attachments)
            .OrderByDescending(m => m.CreatedAt)
            .Skip(skip)
            .Take(pageSize)
            .ToListAsync();

        return conversations;
    }

    public async Task<int> GetUnreadCountAsync(Guid userId)
    {
        // This would need a read status table in a real implementation
        // For now, return 0 as we're not implementing read receipts
        return await Task.FromResult(0);
    }

    public async Task MarkMessagesAsReadAsync(Guid userId, Guid friendId)
    {
        // This would need a read status table in a real implementation
        // For now, do nothing as we're not implementing read receipts
        await Task.CompletedTask;
    }

    public async Task<ChatMessage?> GetLastMessageAsync(Guid userId1, Guid userId2)
    {
        return await _context.ChatMessages
            .Where(m => !m.IsDeleted && 
                       ((m.SenderId == userId1 && m.ReceiverId == userId2) ||
                        (m.SenderId == userId2 && m.ReceiverId == userId1)))
            .Include(m => m.Sender)
            .Include(m => m.Receiver)
            .OrderByDescending(m => m.CreatedAt)
            .FirstOrDefaultAsync();
    }

    public async Task ClearConversationAsync(Guid userId1, Guid userId2)
    {
        var messages = await _context.ChatMessages
            .Where(m => !m.IsDeleted && 
                       ((m.SenderId == userId1 && m.ReceiverId == userId2) ||
                        (m.SenderId == userId2 && m.ReceiverId == userId1)))
            .ToListAsync();

        foreach (var message in messages)
        {
            message.IsDeleted = true;
            message.DeletedAt = DateTime.UtcNow;
        }

        await _context.SaveChangesAsync();
    }
}
