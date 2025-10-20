using System.Threading.Tasks;
using Application.DTOs;
using Microsoft.AspNetCore.Http;

namespace Application.Interfaces;

public interface IStorageService
{
    /// <summary>
    /// Uploads a file to Supabase Storage and returns the public URL
    /// </summary>
    /// <param name="file">The file to upload</param>
    /// <param name="folder">The folder path in storage (e.g., "avatars", "community/posts")</param>
    /// <param name="fileName">Optional custom file name. If null, generates unique name</param>
    /// <returns>File upload result with URL and metadata</returns>
    Task<FileUploadDto> UploadFileAsync(IFormFile file, string folder, string? fileName = null);

    /// <summary>
    /// Deletes a file from Supabase Storage
    /// </summary>
    /// <param name="filePath">The full path to the file in storage</param>
    /// <returns>True if deletion was successful</returns>
    Task<bool> DeleteFileAsync(string filePath);

    /// <summary>
    /// Gets the public URL for an existing file in storage
    /// </summary>
    /// <param name="filePath">The full path to the file in storage</param>
    /// <returns>Public URL for the file</returns>
    Task<string> GetPublicUrlAsync(string filePath);

    /// <summary>
    /// Validates if a file meets the requirements for avatar upload
    /// </summary>
    /// <param name="file">The file to validate</param>
    /// <returns>Validation result with error message if invalid</returns>
    (bool IsValid, string? ErrorMessage) ValidateAvatarFile(IFormFile file);

    /// <summary>
    /// Validates if a file meets the requirements for community media upload
    /// </summary>
    /// <param name="file">The file to validate</param>
    /// <returns>Validation result with error message if invalid</returns>
    (bool IsValid, string? ErrorMessage) ValidateCommunityMediaFile(IFormFile file);

    /// <summary>
    /// Tests if the configured storage bucket exists and is accessible
    /// </summary>
    /// <returns>True if bucket exists and is accessible</returns>
    Task<bool> TestBucketExistsAsync();
}
