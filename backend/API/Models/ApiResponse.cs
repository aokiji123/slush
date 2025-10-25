using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;

namespace API.Models;

/// <summary>
/// Standard API response wrapper
/// </summary>
/// <typeparam name="T">Type of the data being returned</typeparam>
public class ApiResponse<T>
{
    [JsonPropertyName("success")]
    public bool Success { get; set; }

    [JsonPropertyName("message")]
    public string Message { get; set; }

    [JsonPropertyName("data")]
    public T? Data { get; set; }

    public ApiResponse()
    {
        Success = true;
        Message = string.Empty;
    }

    public ApiResponse(T data)
    {
        Success = true;
        Message = string.Empty;
        Data = data;
    }

    public ApiResponse(string errorMessage)
    {
        Success = false;
        Message = errorMessage;
        Data = default;
    }

    public ApiResponse(T data, string message)
    {
        Success = true;
        Message = message;
        Data = data;
    }

    /// <summary>
    /// Creates a successful response
    /// </summary>
    public static ApiResponse<T> CreateSuccess(T data)
    {
        return new ApiResponse<T>(data);
    }

    /// <summary>
    /// Creates a successful response with message
    /// </summary>
    public static ApiResponse<T> CreateSuccess(T data, string message)
    {
        return new ApiResponse<T>(data, message);
    }

    /// <summary>
    /// Creates an error response
    /// </summary>
    public static ApiResponse<T> CreateError(string message)
    {
        return new ApiResponse<T>(message);
    }
}

/// <summary>
/// Paginated response wrapper
/// </summary>
/// <typeparam name="T">Type of the items in the page</typeparam>
public class PaginatedResponse<T>
{
    [JsonPropertyName("items")]
    public IEnumerable<T> Items { get; set; }

    [JsonPropertyName("page")]
    public int Page { get; set; }

    [JsonPropertyName("pageSize")]
    public int PageSize { get; set; }

    [JsonPropertyName("totalCount")]
    public int TotalCount { get; set; }

    [JsonPropertyName("totalPages")]
    public int TotalPages => (int)Math.Ceiling(TotalCount / (double)PageSize);

    public PaginatedResponse()
    {
        Items = Enumerable.Empty<T>();
    }

    public PaginatedResponse(IEnumerable<T> items, int page, int pageSize, int totalCount = 0)
    {
        Items = items;
        Page = page;
        PageSize = pageSize;
        TotalCount = totalCount > 0 ? totalCount : items.Count();
    }
}
