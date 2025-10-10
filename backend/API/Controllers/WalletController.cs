using System;
using System.Security.Claims;
using System.Threading.Tasks;
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

// history endpoint removed; payments act as ledger
}
