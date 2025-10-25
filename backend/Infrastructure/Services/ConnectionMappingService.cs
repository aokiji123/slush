using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Infrastructure.Services;

/// <summary>
/// Thread-safe service for mapping SignalR connection IDs to user IDs
/// </summary>
public class ConnectionMappingService
{
    private readonly ConcurrentDictionary<Guid, HashSet<string>> _userConnections = new();
    private readonly ConcurrentDictionary<string, Guid> _connectionUsers = new();

    /// <summary>
    /// Adds a connection for a user
    /// </summary>
    public void AddConnection(Guid userId, string connectionId)
    {
        _userConnections.AddOrUpdate(
            userId,
            new HashSet<string> { connectionId },
            (key, existing) =>
            {
                existing.Add(connectionId);
                return existing;
            });

        _connectionUsers.TryAdd(connectionId, userId);
    }

    /// <summary>
    /// Removes a connection for a user
    /// </summary>
    public void RemoveConnection(string connectionId)
    {
        if (_connectionUsers.TryRemove(connectionId, out var userId))
        {
            _userConnections.AddOrUpdate(
                userId,
                new HashSet<string>(),
                (key, existing) =>
                {
                    existing.Remove(connectionId);
                    return existing;
                });

            // Clean up empty user entries
            if (_userConnections.TryGetValue(userId, out var connections) && !connections.Any())
            {
                _userConnections.TryRemove(userId, out _);
            }
        }
    }

    /// <summary>
    /// Gets all connection IDs for a user
    /// </summary>
    public IReadOnlyList<string> GetUserConnections(Guid userId)
    {
        return _userConnections.TryGetValue(userId, out var connections) 
            ? connections.ToList() 
            : new List<string>();
    }

    /// <summary>
    /// Gets the user ID for a connection
    /// </summary>
    public Guid? GetUserId(string connectionId)
    {
        return _connectionUsers.TryGetValue(connectionId, out var userId) ? userId : null;
    }

    /// <summary>
    /// Checks if a user has any active connections
    /// </summary>
    public bool IsUserOnline(Guid userId)
    {
        return _userConnections.TryGetValue(userId, out var connections) && connections.Any();
    }

    /// <summary>
    /// Gets all online user IDs
    /// </summary>
    public IReadOnlyList<Guid> GetOnlineUsers()
    {
        return _userConnections
            .Where(kvp => kvp.Value.Any())
            .Select(kvp => kvp.Key)
            .ToList();
    }

    /// <summary>
    /// Gets the count of active connections for a user
    /// </summary>
    public int GetConnectionCount(Guid userId)
    {
        return _userConnections.TryGetValue(userId, out var connections) ? connections.Count : 0;
    }

    /// <summary>
    /// Gets the total number of active connections
    /// </summary>
    public int GetTotalConnections()
    {
        return _connectionUsers.Count;
    }
}
