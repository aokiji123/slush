using System;

namespace Infrastructure.Configuration
{
    /// <summary>
    /// Configuration helper for loading and validating secrets from environment variables
    /// </summary>
    public static class SecretsConfiguration
    {
        /// <summary>
        /// Gets a required environment variable value or throws an exception if not found
        /// </summary>
        /// <param name="key">The environment variable key</param>
        /// <param name="description">Description of what this variable is for (used in error messages)</param>
        /// <returns>The environment variable value</returns>
        /// <exception cref="InvalidOperationException">Thrown when the environment variable is not set</exception>
        public static string GetRequiredSecret(string key, string description)
        {
            var value = Environment.GetEnvironmentVariable(key);
            if (string.IsNullOrWhiteSpace(value))
            {
                throw new InvalidOperationException(
                    $"Required environment variable '{key}' is not set. {description}");
            }
            return value;
        }

        /// <summary>
        /// Gets an optional environment variable value with a default fallback
        /// </summary>
        /// <param name="key">The environment variable key</param>
        /// <param name="defaultValue">Default value if the environment variable is not set</param>
        /// <returns>The environment variable value or default</returns>
        public static string GetOptionalSecret(string key, string defaultValue = "")
        {
            return Environment.GetEnvironmentVariable(key) ?? defaultValue;
        }

        /// <summary>
        /// Gets a required integer environment variable value
        /// </summary>
        /// <param name="key">The environment variable key</param>
        /// <param name="description">Description of what this variable is for</param>
        /// <returns>The parsed integer value</returns>
        /// <exception cref="InvalidOperationException">Thrown when the environment variable is not set or not a valid integer</exception>
        public static int GetRequiredIntSecret(string key, string description)
        {
            var value = GetRequiredSecret(key, description);
            if (!int.TryParse(value, out var intValue))
            {
                throw new InvalidOperationException(
                    $"Environment variable '{key}' must be a valid integer. Current value: '{value}'");
            }
            return intValue;
        }

        /// <summary>
        /// Gets an optional integer environment variable value with a default fallback
        /// </summary>
        /// <param name="key">The environment variable key</param>
        /// <param name="defaultValue">Default value if the environment variable is not set or invalid</param>
        /// <returns>The parsed integer value or default</returns>
        public static int GetOptionalIntSecret(string key, int defaultValue)
        {
            var value = Environment.GetEnvironmentVariable(key);
            if (string.IsNullOrWhiteSpace(value) || !int.TryParse(value, out var intValue))
            {
                return defaultValue;
            }
            return intValue;
        }

        /// <summary>
        /// Validates that all required secrets are present
        /// </summary>
        /// <exception cref="InvalidOperationException">Thrown when any required secret is missing</exception>
        public static void ValidateRequiredSecrets()
        {
            try
            {
                // Database configuration
                GetRequiredSecret("DB_HOST", "Database host address");
                GetRequiredSecret("DB_NAME", "Database name");
                GetRequiredSecret("DB_USER", "Database username");
                GetRequiredSecret("DB_PASSWORD", "Database password");

                // JWT configuration
                GetRequiredSecret("JWT_KEY", "JWT signing key (minimum 32 characters)");
                GetRequiredSecret("JWT_ISSUER", "JWT issuer URL");
                GetRequiredSecret("JWT_AUDIENCE", "JWT audience URL");

                // Email configuration
                GetRequiredSecret("EMAIL_FROM", "Email sender address");
                GetRequiredSecret("EMAIL_SMTP_SERVER", "SMTP server address");
                GetRequiredIntSecret("EMAIL_PORT", "SMTP server port");
                GetRequiredSecret("EMAIL_USERNAME", "Email username");
                GetRequiredSecret("EMAIL_PASSWORD", "Email password");

                // Supabase configuration
                GetRequiredSecret("SUPABASE_URL", "Supabase project URL");
                GetRequiredSecret("SUPABASE_KEY", "Supabase anonymous key");
                GetRequiredSecret("SUPABASE_BUCKET", "Supabase storage bucket name");

                // Validate JWT key length
                var jwtKey = GetRequiredSecret("JWT_KEY", "JWT signing key");
                if (jwtKey.Length < 32)
                {
                    throw new InvalidOperationException(
                        $"JWT_KEY must be at least 32 characters long. Current length: {jwtKey.Length}");
                }
            }
            catch (Exception ex)
            {
                throw new InvalidOperationException(
                    $"Secret validation failed. Please ensure all required environment variables are set. " +
                    $"See .env.example for the complete list. Error: {ex.Message}", ex);
            }
        }

        /// <summary>
        /// Builds a database connection string from environment variables
        /// </summary>
        /// <returns>Complete database connection string</returns>
        public static string BuildConnectionString()
        {
            var host = GetRequiredSecret("DB_HOST", "Database host");
            var database = GetRequiredSecret("DB_NAME", "Database name");
            var username = GetRequiredSecret("DB_USER", "Database username");
            var password = GetRequiredSecret("DB_PASSWORD", "Database password");

            return $"Host={host}; Database={database}; Username={username}; Password={password}; SSL Mode=VerifyFull; Channel Binding=Require;";
        }
    }
}
