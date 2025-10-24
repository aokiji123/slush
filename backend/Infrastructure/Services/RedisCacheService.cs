using Microsoft.Extensions.Caching.Distributed;
using System.Text.Json;

namespace Infrastructure.Services;

public interface IRedisCacheService
{
    Task<T?> GetAsync<T>(string key) where T : class;
    Task SetAsync<T>(string key, T value, TimeSpan? expiration = null) where T : class;
    Task RemoveAsync(string key);
    Task RemoveByPatternAsync(string pattern);
    Task<bool> ExistsAsync(string key);
    Task<T?> GetOrSetAsync<T>(string key, Func<Task<T>> factory, TimeSpan? expiration = null) where T : class;
}

public class RedisCacheService : IRedisCacheService
{
    private readonly IDistributedCache _distributedCache;
    private readonly JsonSerializerOptions _jsonOptions;

    public RedisCacheService(IDistributedCache distributedCache)
    {
        _distributedCache = distributedCache;
        _jsonOptions = new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
            WriteIndented = false
        };
    }

    public async Task<T?> GetAsync<T>(string key) where T : class
    {
        var cachedValue = await _distributedCache.GetStringAsync(key);
        if (string.IsNullOrEmpty(cachedValue))
        {
            return null;
        }

        return JsonSerializer.Deserialize<T>(cachedValue, _jsonOptions);
    }

    public async Task SetAsync<T>(string key, T value, TimeSpan? expiration = null) where T : class
    {
        var serializedValue = JsonSerializer.Serialize(value, _jsonOptions);
        var options = new DistributedCacheEntryOptions();

        if (expiration.HasValue)
        {
            options.SetAbsoluteExpiration(expiration.Value);
        }

        await _distributedCache.SetStringAsync(key, serializedValue, options);
    }

    public async Task RemoveAsync(string key)
    {
        await _distributedCache.RemoveAsync(key);
    }

    public async Task RemoveByPatternAsync(string pattern)
    {
        // Note: This is a simplified implementation
        // In production, you might want to use Redis SCAN command for better performance
        // For now, we'll implement a basic pattern matching
        // This would require access to the Redis connection to use SCAN
        throw new NotImplementedException("Pattern-based removal requires Redis connection access. Use individual key removal for now.");
    }

    public async Task<bool> ExistsAsync(string key)
    {
        var cachedValue = await _distributedCache.GetStringAsync(key);
        return !string.IsNullOrEmpty(cachedValue);
    }

    public async Task<T?> GetOrSetAsync<T>(string key, Func<Task<T>> factory, TimeSpan? expiration = null) where T : class
    {
        var cachedValue = await GetAsync<T>(key);
        if (cachedValue != null)
        {
            return cachedValue;
        }

        var value = await factory();
        if (value != null)
        {
            await SetAsync(key, value, expiration);
        }

        return value;
    }
}
