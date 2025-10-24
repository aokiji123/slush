using System;
using System.Security.Claims;
using Microsoft.AspNetCore.Http;

namespace API.Helpers;

/// <summary>
/// Helper methods for working with user claims
/// </summary>
public static class ClaimsHelper
{
    /// <summary>
    /// Safely extracts and parses the user ID from claims
    /// </summary>
    /// <param name="user">The claims principal</param>
    /// <returns>The user ID if found and valid, null otherwise</returns>
    public static Guid? GetUserId(ClaimsPrincipal user)
    {
        var userIdClaim = user.FindFirst(ClaimTypes.NameIdentifier);
        if (userIdClaim == null || string.IsNullOrWhiteSpace(userIdClaim.Value))
        {
            return null;
        }

        return Guid.TryParse(userIdClaim.Value, out var userId) ? userId : null;
    }

    /// <summary>
    /// Safely extracts and parses the user ID from claims, throwing an exception if not found
    /// </summary>
    /// <param name="user">The claims principal</param>
    /// <returns>The user ID</returns>
    /// <exception cref="Application.Common.Exceptions.UnauthorizedException">Thrown when user ID cannot be found or parsed</exception>
    public static Guid GetUserIdOrThrow(ClaimsPrincipal user)
    {
        var userId = GetUserId(user);
        if (userId == null)
        {
            throw new Application.Common.Exceptions.UnauthorizedException("Unable to determine the current user.");
        }
        return userId.Value;
    }

    /// <summary>
    /// Safely extracts and parses the user ID from HTTP context
    /// </summary>
    /// <param name="context">The HTTP context</param>
    /// <returns>The user ID if found and valid, null otherwise</returns>
    public static Guid? GetUserId(HttpContext context)
    {
        return GetUserId(context.User);
    }

    /// <summary>
    /// Safely extracts and parses the user ID from HTTP context, throwing an exception if not found
    /// </summary>
    /// <param name="context">The HTTP context</param>
    /// <returns>The user ID</returns>
    /// <exception cref="Application.Common.Exceptions.UnauthorizedException">Thrown when user ID cannot be found or parsed</exception>
    public static Guid GetUserIdOrThrow(HttpContext context)
    {
        return GetUserIdOrThrow(context.User);
    }
}
