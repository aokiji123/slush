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
public class WalletController : ControllerBase
{
    private readonly IWalletService _walletService;

    public WalletController(IWalletService walletService)
    {
        _walletService = walletService;
    }

    [HttpGet("balance")]
    public async Task<IActionResult> GetBalance()
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var balance = await _walletService.GetBalanceAsync(userId);
        return Ok(balance);
    }

    [HttpPost("add")]
    public async Task<IActionResult> Add([FromBody] WalletChangeDto dto)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var result = await _walletService.AddAsync(userId, dto);
        return Ok(result);
    }

    [HttpPost("subtract")]
    public async Task<IActionResult> Subtract([FromBody] WalletChangeDto dto)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var result = await _walletService.SubtractAsync(userId, dto);
        return Ok(result);
    }

    [HttpGet("history")]
    public async Task<IActionResult> History([FromQuery] int page = 1, [FromQuery] int limit = 20)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var parameters = new WalletQueryParameters { Page = page, Limit = limit };
        var items = await _walletService.GetHistoryAsync(userId, parameters);
        return Ok(items);
    }
}
