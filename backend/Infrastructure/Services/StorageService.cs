using System;
using System.IO;
using System.Threading.Tasks;
using Application.DTOs;
using Application.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Supabase;
using Infrastructure.Configuration;

namespace Infrastructure.Services;

public class StorageService : IStorageService
{
    private readonly Supabase.Client _supabaseClient;
    private readonly ILogger<StorageService> _logger;
    private readonly string _bucketName;

    // File validation constants
    private const long MaxAvatarSizeBytes = 5 * 1024 * 1024; // 5MB
    private const long MaxCommunityMediaSizeBytes = 10 * 1024 * 1024; // 10MB
    
    private static readonly string[] AllowedImageExtensions = { ".jpg", ".jpeg", ".png", ".gif", ".webp" };
    private static readonly string[] AllowedVideoExtensions = { ".mp4", ".webm" };
    private static readonly string[] AllowedImageMimeTypes = { "image/jpeg", "image/png", "image/gif", "image/webp" };
    private static readonly string[] AllowedVideoMimeTypes = { "video/mp4", "video/webm" };

    public StorageService(IConfiguration configuration, ILogger<StorageService> logger)
    {
        _logger = logger;
        _bucketName = SecretsConfiguration.GetRequiredSecret("SUPABASE_BUCKET", "Supabase storage bucket name");
        
        var supabaseUrl = SecretsConfiguration.GetRequiredSecret("SUPABASE_URL", "Supabase project URL");
        var supabaseKey = SecretsConfiguration.GetRequiredSecret("SUPABASE_KEY", "Supabase anonymous key");

        try
        {
            _supabaseClient = new Supabase.Client(supabaseUrl, supabaseKey);
            _logger.LogInformation("Supabase client initialized successfully with URL: {Url}", supabaseUrl);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to initialize Supabase client with URL: {Url}", supabaseUrl);
            throw;
        }
    }

    public async Task<FileUploadDto> UploadFileAsync(IFormFile file, string folder, string? fileName = null)
    {
        try
        {
            _logger.LogInformation("Starting file upload: {FileName} to folder {Folder}", file.FileName, folder);
            
            // Generate unique file name if not provided
            var finalFileName = fileName ?? GenerateUniqueFileName(file.FileName);
            var filePath = $"{folder}/{finalFileName}";

            _logger.LogInformation("Generated file path: {FilePath}", filePath);

            // Upload file to Supabase Storage
            using var stream = file.OpenReadStream();
            using var memoryStream = new MemoryStream();
            await stream.CopyToAsync(memoryStream);
            var fileBytes = memoryStream.ToArray();
            
            _logger.LogInformation("File size: {FileSize} bytes, attempting upload to bucket: {BucketName}", fileBytes.Length, _bucketName);
            
            var result = await _supabaseClient.Storage
                .From(_bucketName)
                .Upload(fileBytes, filePath);

            if (result == null)
            {
                _logger.LogError("Upload result is null for file: {FilePath}", filePath);
                throw new InvalidOperationException("Failed to upload file to Supabase Storage - result is null");
            }

            _logger.LogInformation("File uploaded successfully, getting public URL");

            // Get public URL
            var publicUrl = await GetPublicUrlAsync(filePath);

            _logger.LogInformation("File upload completed successfully: {Url}", publicUrl);

            return new FileUploadDto
            {
                Url = publicUrl,
                FileName = finalFileName,
                FileSize = file.Length,
                ContentType = file.ContentType,
                FilePath = filePath
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error uploading file {FileName} to folder {Folder}. Error: {ErrorMessage}", file.FileName, folder, ex.Message);
            throw;
        }
    }

    public async Task<bool> DeleteFileAsync(string filePath)
    {
        try
        {
            _logger.LogInformation("Attempting to delete file: {FilePath} from bucket: {BucketName}", filePath, _bucketName);
            var result = await _supabaseClient.Storage
                .From(_bucketName)
                .Remove(filePath);

            if (result != null)
            {
                _logger.LogInformation("File {FilePath} deleted successfully.", filePath);
                return true;
            }
            _logger.LogWarning("File {FilePath} not found or could not be deleted.", filePath);
            return false;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting file {FilePath}", filePath);
            return false;
        }
    }

    public Task<string> GetPublicUrlAsync(string filePath)
    {
        try
        {
            var result = _supabaseClient.Storage
                .From(_bucketName)
                .GetPublicUrl(filePath);

            return Task.FromResult(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting public URL for file {FilePath}", filePath);
            throw;
        }
    }

    public (bool IsValid, string? ErrorMessage) ValidateAvatarFile(IFormFile file)
    {
        if (file == null || file.Length == 0)
        {
            return (false, "No file provided");
        }

        if (file.Length > MaxAvatarSizeBytes)
        {
            return (false, $"File size exceeds maximum allowed size of {MaxAvatarSizeBytes / (1024 * 1024)}MB");
        }

        var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
        if (!AllowedImageExtensions.Contains(extension))
        {
            return (false, $"File type not allowed. Allowed types: {string.Join(", ", AllowedImageExtensions)}");
        }

        if (!AllowedImageMimeTypes.Contains(file.ContentType.ToLowerInvariant()))
        {
            return (false, $"MIME type not allowed. Allowed types: {string.Join(", ", AllowedImageMimeTypes)}");
        }

        return (true, null);
    }

    public (bool IsValid, string? ErrorMessage) ValidateCommunityMediaFile(IFormFile file)
    {
        if (file == null || file.Length == 0)
        {
            return (false, "No file provided");
        }

        if (file.Length > MaxCommunityMediaSizeBytes)
        {
            return (false, $"File size exceeds maximum allowed size of {MaxCommunityMediaSizeBytes / (1024 * 1024)}MB");
        }

        var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
        var allowedExtensions = AllowedImageExtensions.Concat(AllowedVideoExtensions).ToArray();
        var allowedMimeTypes = AllowedImageMimeTypes.Concat(AllowedVideoMimeTypes).ToArray();

        if (!allowedExtensions.Contains(extension))
        {
            return (false, $"File type not allowed. Allowed types: {string.Join(", ", allowedExtensions)}");
        }

        if (!allowedMimeTypes.Contains(file.ContentType.ToLowerInvariant()))
        {
            return (false, $"MIME type not allowed. Allowed types: {string.Join(", ", allowedMimeTypes)}");
        }

        return (true, null);
    }

    public (bool IsValid, string? ErrorMessage) ValidateBannerFile(IFormFile file)
    {
        if (file == null || file.Length == 0)
        {
            return (false, "No file provided");
        }

        if (file.Length > MaxAvatarSizeBytes)
        {
            return (false, $"File size exceeds maximum allowed size of {MaxAvatarSizeBytes / (1024 * 1024)}MB");
        }

        var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
        if (!AllowedImageExtensions.Contains(extension))
        {
            return (false, $"File type not allowed. Allowed types: {string.Join(", ", AllowedImageExtensions)}");
        }

        if (!AllowedImageMimeTypes.Contains(file.ContentType.ToLowerInvariant()))
        {
            return (false, $"MIME type not allowed. Allowed types: {string.Join(", ", AllowedImageMimeTypes)}");
        }

        return (true, null);
    }

    public async Task<bool> TestBucketExistsAsync()
    {
        try
        {
            _logger.LogInformation("Testing if bucket {BucketName} exists", _bucketName);
            
            // Try to list files in the bucket to test if it exists
            var result = await _supabaseClient.Storage
                .From(_bucketName)
                .List();

            _logger.LogInformation("Bucket {BucketName} exists and is accessible", _bucketName);
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Bucket {BucketName} does not exist or is not accessible: {ErrorMessage}", _bucketName, ex.Message);
            return false;
        }
    }

    private static string GenerateUniqueFileName(string originalFileName)
    {
        var extension = Path.GetExtension(originalFileName);
        var nameWithoutExtension = Path.GetFileNameWithoutExtension(originalFileName);
        
        // Sanitize filename by removing invalid characters
        var sanitizedName = SanitizeFileName(nameWithoutExtension);
        
        // If sanitized name is empty or too short, use a default
        if (string.IsNullOrWhiteSpace(sanitizedName) || sanitizedName.Length < 3)
        {
            sanitizedName = "file";
        }
        
        var timestamp = DateTime.UtcNow.ToString("yyyyMMddHHmmss");
        var guid = Guid.NewGuid().ToString("N")[..8];
        
        return $"{sanitizedName}_{timestamp}_{guid}{extension}";
    }

    private static string SanitizeFileName(string fileName)
    {
        if (string.IsNullOrEmpty(fileName))
            return "file";

        var sanitized = fileName;

        // Handle Unicode dashes and other problematic characters first
        sanitized = sanitized.Replace("—", "_")  // em dash
                           .Replace("–", "_")   // en dash
                           .Replace("−", "_")   // minus sign
                           .Replace("‐", "_")   // hyphen
                           .Replace("‑", "_");  // non-breaking hyphen

        // Check for problematic starting characters (including Unicode variants)
        if (sanitized.StartsWith("-") || sanitized.StartsWith(".") || 
            sanitized.StartsWith("—") || sanitized.StartsWith("–") ||
            sanitized.StartsWith("−") || sanitized.StartsWith("‐") ||
            sanitized.StartsWith("‑"))
        {
            sanitized = "file_" + sanitized;
        }

        // Replace invalid characters with underscores
        var invalidChars = new char[] { '/', '\\', ':', '*', '?', '"', '<', '>', '|', '-', ' ' };
        foreach (var invalidChar in invalidChars)
        {
            sanitized = sanitized.Replace(invalidChar, '_');
        }

        // Remove any remaining Unicode characters that might be problematic
        sanitized = System.Text.RegularExpressions.Regex.Replace(sanitized, @"[^\w\-_\.]", "_");

        // Remove multiple consecutive underscores
        while (sanitized.Contains("__"))
        {
            sanitized = sanitized.Replace("__", "_");
        }

        // Remove leading/trailing underscores (but preserve the "file_" prefix if it was added)
        if (sanitized.StartsWith("file_"))
        {
            var rest = sanitized.Substring(5).Trim('_');
            sanitized = "file_" + rest;
        }
        else
        {
            sanitized = sanitized.Trim('_');
        }

        // Ensure we still have a valid name after all processing
        if (string.IsNullOrWhiteSpace(sanitized) || sanitized.Length < 3)
        {
            sanitized = "file";
        }

        // Limit length to prevent issues
        if (sanitized.Length > 50)
        {
            sanitized = sanitized.Substring(0, 50);
        }

        return sanitized;
    }
}
