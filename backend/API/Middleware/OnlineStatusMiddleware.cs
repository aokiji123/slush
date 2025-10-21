using System;
using System.Security.Claims;
using System.Threading.Tasks;
using Application.Interfaces;
using Microsoft.AspNetCore.Http;

namespace API.Middleware;

public class OnlineStatusMiddleware
{
    private readonly RequestDelegate _next;

    public OnlineStatusMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context, IUserService userService)
    {
        if (context.User.Identity?.IsAuthenticated == true)
        {
            var userIdValue = context.User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (Guid.TryParse(userIdValue, out var userId))
            {
                // Update last seen timestamp
                await userService.UpdateLastSeenAsync(userId);
            }
        }

        await _next(context);
    }
}
