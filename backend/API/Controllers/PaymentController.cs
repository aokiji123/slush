using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using API.Models;
using Application.DTOs;
using Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace API.Controllers;

/// <summary>
/// Provides endpoints for managing payment transactions.
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class PaymentController : ControllerBase
{
    private const string UnexpectedErrorMessage = "An unexpected error occurred while processing the request.";

    private readonly IPaymentService _paymentService;
    private readonly ILogger<PaymentController> _logger;

    public PaymentController(IPaymentService paymentService, ILogger<PaymentController> logger)
    {
        _paymentService = paymentService;
        _logger = logger;
    }

    /// <summary>
    /// Creates a new payment record.
    /// </summary>
    /// <param name="dto">Payment creation data</param>
    /// <returns>Created payment information</returns>
    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<ApiResponse<PaymentDto>>> CreatePaymentAsync([FromBody] CreatePaymentDto? dto)
    {
        if (dto is null)
        {
            return BadRequest(new ApiResponse<PaymentDto>("Request body is required."));
        }

        if (dto.UserId == Guid.Empty)
        {
            return BadRequest(new ApiResponse<PaymentDto>("UserId is required."));
        }

        if (dto.Sum <= 0)
        {
            return BadRequest(new ApiResponse<PaymentDto>("Sum must be greater than zero."));
        }

        try
        {
            var payment = await _paymentService.CreatePaymentAsync(dto);
            var response = new ApiResponse<PaymentDto>(payment)
            {
                Message = "Payment created successfully."
            };

            return CreatedAtAction(nameof(GetUserPaymentsAsync), new { userId = payment.UserId }, response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating payment for user {UserId}", dto.UserId);
            return StatusCode(StatusCodes.Status500InternalServerError, new ApiResponse<PaymentDto>(UnexpectedErrorMessage));
        }
    }

    /// <summary>
    /// Gets all payments for a specific user.
    /// </summary>
    /// <param name="userId">User identifier</param>
    /// <returns>List of user's payments</returns>
    [HttpGet("{userId:guid}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<ApiResponse<IReadOnlyList<PaymentDto>>>> GetUserPaymentsAsync(Guid userId)
    {
        if (userId == Guid.Empty)
        {
            return BadRequest(new ApiResponse<IReadOnlyList<PaymentDto>>("User ID cannot be empty."));
        }

        try
        {
            var payments = await _paymentService.GetUserPaymentsAsync(userId);
            var response = new ApiResponse<IReadOnlyList<PaymentDto>>(payments)
            {
                Message = $"Found {payments.Count} payments for user {userId}."
            };

            return Ok(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving payments for user {UserId}", userId);
            return StatusCode(StatusCodes.Status500InternalServerError, new ApiResponse<IReadOnlyList<PaymentDto>>(UnexpectedErrorMessage));
        }
    }
}