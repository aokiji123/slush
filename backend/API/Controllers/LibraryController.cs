using System;
using System.Security.Claims;
using System.Threading.Tasks;
using Application.Common.Query;
using Application.DTOs;
using Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class LibraryController : ControllerBase
{
    private readonly ILibraryService _libraryService;

    public LibraryController(ILibraryService libraryService)
    {
        _libraryService = libraryService;
    }

    [HttpGet("owned")]
    public async Task<IActionResult> GetOwned([FromQuery] int page = 1, [FromQuery] int limit = 20)
    {
        var userId = Guid.Parse(User.FindFirstValue(System.Security.Claims.ClaimTypes.NameIdentifier)!);
        var parameters = new LibraryQueryParameters { Page = page, Limit = limit };
        var items = await _libraryService.GetOwnedAsync(userId, parameters);
        return Ok(items);
    }

    [HttpGet("{userId}")]
    public async Task<IActionResult> GetUserLibrary(Guid userId)
    {
        try
        {
            var library = await _libraryService.GetUserLibraryAsync(userId);
            return Ok(library);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPost]
    public async Task<IActionResult> AddToLibrary([FromBody] AddToLibraryDto dto)
    {
        try
        {
            var result = await _libraryService.AddToLibraryAsync(dto);
            return Ok(result);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Internal server error", details = ex.Message });
        }
    }
}
