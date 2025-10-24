using System;
using System.Security.Claims;
using System.Threading.Tasks;
using Application.DTOs;
using Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using API.Helpers;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class StoreController : ControllerBase
{
    private readonly IPurchaseService _purchaseService;

    public StoreController(IPurchaseService purchaseService)
    {
        _purchaseService = purchaseService;
    }

    [HttpPost("purchase")]
    public async Task<IActionResult> Purchase([FromBody] PurchaseRequestDto dto)
    {
        var userId = ClaimsHelper.GetUserIdOrThrow(User);
        var result = await _purchaseService.PurchaseAsync(userId, dto);
        if (!result.Success) return BadRequest(result);
        return Ok(result);
    }
}
