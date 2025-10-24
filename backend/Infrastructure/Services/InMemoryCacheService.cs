using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.Extensions.Caching.Memory;

namespace Infrastructure.Services
{
    public class InMemoryCacheService : IRedisCacheService
    {
        private readonly IMemoryCache _memoryCache;
        private readonly JsonSerializerOptions _jsonOptions;

        public InMemoryCacheService(IMemoryCache memoryCache)
        {
            _memoryCache = memoryCache;
            _jsonOptions = new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
                WriteIndented = false
            };
        }

        public async Task<T?> GetAsync<T>(string key) where T : class
        {
            if (_memoryCache.TryGetValue(key, out var cachedValue))
            {
                if (cachedValue is string jsonString)
                {
                    return JsonSerializer.Deserialize<T>(jsonString, _jsonOptions);
                }
                return cachedValue as T;
            }
            return null;
        }

        public async Task SetAsync<T>(string key, T value, TimeSpan? expiration = null) where T : class
        {
            var options = new MemoryCacheEntryOptions();
            if (expiration.HasValue)
            {
                options.SetAbsoluteExpiration(expiration.Value);
            }
            else
            {
                // Default expiration of 1 hour for in-memory cache
                options.SetAbsoluteExpiration(TimeSpan.FromHours(1));
            }

            var jsonString = JsonSerializer.Serialize(value, _jsonOptions);
            _memoryCache.Set(key, jsonString, options);
        }

        public async Task RemoveAsync(string key)
        {
            _memoryCache.Remove(key);
        }

        public async Task RemoveByPatternAsync(string pattern)
        {
            // For in-memory cache, we can't easily implement pattern matching
            // This is a limitation of IMemoryCache vs Redis
            // In a real scenario, you might want to track keys separately
            throw new NotImplementedException("Pattern-based removal is not supported with in-memory cache. Use individual key removal.");
        }

        public async Task<bool> ExistsAsync(string key)
        {
            return _memoryCache.TryGetValue(key, out _);
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
}
