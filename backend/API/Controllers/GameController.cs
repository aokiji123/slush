using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Application.DTOs;
using Application.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace API.Controllers;

[ApiController]
[Route("game")]
public class GameController : ControllerBase
{
    private readonly IGameService _gameService;
    private readonly ILogger<GameController> _logger;

    public GameController(IGameService gameService, ILogger<GameController> logger)
    {
        _gameService = gameService;
        _logger = logger;
    }

    // GET /game/{id}
    [HttpGet("{id:guid}")]
    public async Task<ActionResult<GameDto>> GetGame(Guid id)
    {
        if (id == Guid.Empty)
        {
            return BadRequest("Game ID cannot be empty");
        }

        try
        {
            _logger.LogInformation("Starting to retrieve game with ID: {GameId}", id);
            var game = await _gameService.GetGameByIdAsync(id);
            _logger.LogInformation("Game retrieved successfully: {GameFound}", game != null);
            
            if (game == null)
            {
                return NotFound($"Game with ID {id} not found");
            }
            
            return Ok(game);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while retrieving game {GameId}. Exception type: {ExceptionType}, Message: {Message}", 
            id, ex.GetType().Name, ex.Message);
        return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }

    // GET /game/search?genre=...&platform=...&price=...
    [HttpGet("search")]
    public async Task<ActionResult<IEnumerable<GameDto>>> Search([FromQuery] string? genre, [FromQuery] string? platform, [FromQuery] decimal? price)
    {
        try
        {
            var result = await _gameService.SearchAsync(genre, platform, price);
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while searching games");
            return StatusCode(500, "Internal server error");
        }
    }

    // GET /game/discount
    [HttpGet("discount")]
    public async Task<ActionResult<IEnumerable<GameDto>>> GetDiscounted()
    {
        try
        {
            var result = await _gameService.GetDiscountedAsync();
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while retrieving discounted games");
            return StatusCode(500, "Internal server error");
        }
    }

    // GET /game/recommended
    [HttpGet("recommended")]
    public async Task<ActionResult<IEnumerable<GameDto>>> GetRecommended()
    {
        try
        {
            var result = await _gameService.GetRecommendedAsync();
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while retrieving recommended games");
            return StatusCode(500, "Internal server error");
        }
    }

    // GET /game/price/{price}
    [HttpGet("price/{price:decimal}")]
    public async Task<ActionResult<IEnumerable<GameDto>>> GetCheaperThan(decimal price)
    {
        if (price < 0)
        {
            return BadRequest("Price must be non-negative");
        }

        try
        {
            var result = await _gameService.GetCheaperThanAsync(price);
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while retrieving cheaper-than games");
            return StatusCode(500, "Internal server error");
        }
    }

    // GET /game/hits
    [HttpGet("hits")]
    public async Task<ActionResult<IEnumerable<GameDto>>> GetHits()
    {
        try
        {
            var result = await _gameService.GetHitsAsync();
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while retrieving hits");
            return StatusCode(500, "Internal server error");
        }
    }

    // GET /game/new
    [HttpGet("new")]
    public async Task<ActionResult<IEnumerable<GameDto>>> GetNew()
    {
        try
        {
            var result = await _gameService.GetNewAsync();
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while retrieving new games");
            return StatusCode(500, "Internal server error");
        }
    }

    // GET /game/free
    [HttpGet("free")]
    public async Task<ActionResult<IEnumerable<GameDto>>> GetFree()
    {
        try
        {
            var result = await _gameService.GetFreeAsync();
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while retrieving free games");
            return StatusCode(500, "Internal server error");
        }
    }
}