using System;
using System.Linq;
using System.Threading.Tasks;

namespace Infrastructure.Services
{
    public class InMemoryVerificationCodeService : IRedisVerificationCodeService
    {
        private readonly IRedisCacheService _cacheService;
        private readonly TimeSpan _defaultExpiration = TimeSpan.FromMinutes(10);

        public InMemoryVerificationCodeService(IRedisCacheService cacheService)
        {
            _cacheService = cacheService;
        }

        public async Task<string> GenerateAndStoreCodeAsync(string email, string purpose, TimeSpan? expiration = null)
        {
            var code = GenerateRandomCode();
            var key = GetCacheKey(email, purpose);
            var expirationTime = expiration ?? _defaultExpiration;

            await _cacheService.SetAsync(key, code, expirationTime);
            return code;
        }

        public async Task<bool> VerifyCodeAsync(string email, string code, string purpose)
        {
            var key = GetCacheKey(email, purpose);
            var storedCode = await _cacheService.GetAsync<string>(key);

            if (string.IsNullOrEmpty(storedCode))
            {
                return false;
            }

            var isValid = string.Equals(storedCode, code, StringComparison.OrdinalIgnoreCase);
            
            if (isValid)
            {
                // Remove the code after successful verification
                await _cacheService.RemoveAsync(key);
            }

            return isValid;
        }

        public async Task RemoveCodeAsync(string email, string purpose)
        {
            var key = GetCacheKey(email, purpose);
            await _cacheService.RemoveAsync(key);
        }

        public async Task<bool> IsCodeValidAsync(string email, string purpose)
        {
            var key = GetCacheKey(email, purpose);
            return await _cacheService.ExistsAsync(key);
        }

        private static string GenerateRandomCode()
        {
            const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            var random = new Random();
            return new string(Enumerable.Repeat(chars, 6)
                .Select(s => s[random.Next(s.Length)]).ToArray());
        }

        private static string GetCacheKey(string email, string purpose)
        {
            return $"verification_code:{purpose}:{email.ToLowerInvariant()}";
        }
    }
}
