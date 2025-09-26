using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Application.DTOs;
using Application.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace API.Controllers;

[ApiController]
[Route("api/Game")]
public class GameController : ControllerBase
{
    private readonly IGameService _gameService;
    private readonly ILogger<GameController> _logger;

    public GameController(IGameService gameService, ILogger<GameController> logger)
    {
        _gameService = gameService;
        _logger = logger;
    }

    // GET: api/Game/{id}
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

    // GET: api/Game/top-popular?top=10
    [HttpGet("top-popular")]
    public async Task<ActionResult<IEnumerable<GameDto>>> GetTopPopular([FromQuery] int top = 10)
    {
        if (top < 1 || top > 100)
        {
            return BadRequest("'top' must be between 1 and 100");
        }

        try
        {
            var result = await _gameService.GetTopPopularGamesAsync(top);
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while retrieving top popular games");
            return StatusCode(500, "Internal server error");
        }
    }

    // POST: api/Game/filter
    // Body: GamesFilterRequestDto { Genres, Platforms, WithDiscount, SortBy, Page, Limit, Query }
    [HttpPost("filter")]
    public async Task<ActionResult<IEnumerable<GameDto>>> GetByFilter([FromBody] GamesFilterRequestDto request)
    {
        if (request == null)
        {
            return BadRequest("Request body is required");
        }

        if (request.Page < 1)
        {
            return BadRequest("Page must be greater than 0");
        }

        if (request.Limit < 1 || request.Limit > 100)
        {
            return BadRequest("Limit must be between 1 and 100");
        }

        var validSorts = new HashSet<string>(StringComparer.OrdinalIgnoreCase)
        {
            "relevancy", "publish_date", "rating", "price_asc", "price_desc", "alphabet", "discount"
        };
        if (!validSorts.Contains(request.SortBy))
        {
            return BadRequest("Invalid SortBy. Use one of: relevancy, publish_date, rating, price_asc, price_desc, alphabet, discount");
        }

        try
        {
            var result = await _gameService.GetGamesByFilterAsync(request);
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while filtering games");
            return StatusCode(500, "Internal server error");
        }
    }
}