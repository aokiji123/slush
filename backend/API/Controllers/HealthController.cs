using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Infrastructure.Data;
using API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;

namespace API.Controllers;

/// <summary>
/// Health check endpoints for monitoring application status
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class HealthController : ControllerBase
{
    private readonly AppDbContext _dbContext;
    private readonly ILogger<HealthController> _logger;

    public HealthController(AppDbContext dbContext, ILogger<HealthController> logger)
    {
        _dbContext = dbContext;
        _logger = logger;
    }

    /// <summary>
    /// Basic health check endpoint
    /// </summary>
    /// <returns>Application status</returns>
    [HttpGet]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status503ServiceUnavailable)]
    public async Task<ActionResult<ApiResponse<object>>> GetHealth()
    {
        try
        {
            var isHealthy = await IsDatabaseHealthy();
            
            if (!isHealthy)
            {
                _logger.LogWarning("Health check failed - database is not accessible");
                return StatusCode(StatusCodes.Status503ServiceUnavailable, 
                    new ApiResponse<object>("Service is unhealthy - database connection failed"));
            }

            return Ok(new ApiResponse<object>(new { 
                Status = "Healthy", 
                Timestamp = DateTime.UtcNow,
                Version = "1.0.0"
            }));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Health check failed with exception");
            return StatusCode(StatusCodes.Status503ServiceUnavailable, 
                new ApiResponse<object>("Service is unhealthy"));
        }
    }

    /// <summary>
    /// Readiness check endpoint for load balancers
    /// </summary>
    /// <returns>Readiness status</returns>
    [HttpGet("ready")]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status503ServiceUnavailable)]
    public async Task<ActionResult<ApiResponse<object>>> GetReadiness()
    {
        try
        {
            var isDatabaseReady = await IsDatabaseHealthy();
            
            if (!isDatabaseReady)
            {
                return StatusCode(StatusCodes.Status503ServiceUnavailable, 
                    new ApiResponse<object>("Service is not ready - database is not accessible"));
            }

            return Ok(new ApiResponse<object>(new { 
                Status = "Ready", 
                Timestamp = DateTime.UtcNow 
            }));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Readiness check failed with exception");
            return StatusCode(StatusCodes.Status503ServiceUnavailable, 
                new ApiResponse<object>("Service is not ready"));
        }
    }

    /// <summary>
    /// Liveness check endpoint for Kubernetes
    /// </summary>
    /// <returns>Liveness status</returns>
    [HttpGet("live")]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status200OK)]
    public ActionResult<ApiResponse<object>> GetLiveness()
    {
        return Ok(new ApiResponse<object>(new { 
            Status = "Alive", 
            Timestamp = DateTime.UtcNow 
        }));
    }

    /// <summary>
    /// Detailed health check with component status (requires authentication)
    /// </summary>
    /// <returns>Detailed health status</returns>
    [HttpGet("detailed")]
    [Authorize]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status503ServiceUnavailable)]
    public async Task<ActionResult<ApiResponse<object>>> GetDetailedHealth()
    {
        try
        {
            var databaseStatus = await IsDatabaseHealthy() ? "Healthy" : "Unhealthy";
            
            var healthStatus = new
            {
                Status = databaseStatus == "Healthy" ? "Healthy" : "Unhealthy",
                Timestamp = DateTime.UtcNow,
                Components = new
                {
                    Database = databaseStatus,
                    Memory = GetMemoryStatus(),
                    Environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") ?? "Unknown"
                }
            };

            var statusCode = databaseStatus == "Healthy" ? StatusCodes.Status200OK : StatusCodes.Status503ServiceUnavailable;
            return StatusCode(statusCode, new ApiResponse<object>(healthStatus));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Detailed health check failed with exception");
            return StatusCode(StatusCodes.Status503ServiceUnavailable, 
                new ApiResponse<object>("Detailed health check failed"));
        }
    }

    private async Task<bool> IsDatabaseHealthy()
    {
        try
        {
            await _dbContext.Database.CanConnectAsync();
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Database health check failed");
            return false;
        }
    }

    private static object GetMemoryStatus()
    {
        var process = System.Diagnostics.Process.GetCurrentProcess();
        return new
        {
            WorkingSet = process.WorkingSet64,
            PrivateMemory = process.PrivateMemorySize64,
            VirtualMemory = process.VirtualMemorySize64
        };
    }
}
