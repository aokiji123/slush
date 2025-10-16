using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Application.Interfaces;
using Application.DTOs;
using Application.Common.Query;
using API.Models;
using System.Security.Claims;
using System.Threading.Tasks;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ReviewController : ControllerBase
    {
        private readonly IReviewService _reviewService;

        public ReviewController(IReviewService reviewService)
        {
            _reviewService = reviewService;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ApiResponse<ReviewDto>>> GetReview(Guid id)
        {
            try
            {
                var currentUserId = GetCurrentUserId();
                var review = await _reviewService.GetReviewByIdAsync(id, currentUserId);
                
                if (review == null)
                {
                    return NotFound(new ApiResponse<ReviewDto>("Review not found"));
                }

                return Ok(new ApiResponse<ReviewDto>(review));
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ApiResponse<ReviewDto>($"Internal server error: {ex.Message}"));
            }
        }

        [HttpGet]
        public async Task<ActionResult<ApiResponse<IEnumerable<ReviewDto>>>> GetReviews(
            [FromQuery] ReviewQueryParameters parameters)
        {
            try
            {
                var currentUserId = GetCurrentUserId();
                var reviews = await _reviewService.GetReviewsAsync(parameters, currentUserId);
                
                return Ok(new ApiResponse<IEnumerable<ReviewDto>>(reviews));
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ApiResponse<IEnumerable<ReviewDto>>($"Internal server error: {ex.Message}"));
            }
        }

        [HttpPost]
        [Authorize]
        public async Task<ActionResult<ApiResponse<ReviewDto>>> CreateReview([FromBody] CreateReviewDto createReviewDto)
        {
            try
            {
                var userId = GetCurrentUserId();
                if (userId == null)
                {
                    return Unauthorized(new ApiResponse<ReviewDto>("User not authenticated"));
                }

                var review = await _reviewService.CreateReviewAsync(createReviewDto, userId.Value);
                return CreatedAtAction(nameof(GetReview), new { id = review.Id }, 
                    new ApiResponse<ReviewDto>(review));
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new ApiResponse<ReviewDto>(ex.Message));
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ApiResponse<ReviewDto>($"Internal server error: {ex.Message}"));
            }
        }

        [HttpPut("{id}")]
        [Authorize]
        public async Task<ActionResult<ApiResponse<ReviewDto>>> UpdateReview(Guid id, [FromBody] CreateReviewDto updateReviewDto)
        {
            try
            {
                var userId = GetCurrentUserId();
                if (userId == null)
                {
                    return Unauthorized(new ApiResponse<ReviewDto>("User not authenticated"));
                }

                var review = await _reviewService.UpdateReviewAsync(id, updateReviewDto, userId.Value);
                
                if (review == null)
                {
                    return NotFound(new ApiResponse<ReviewDto>("Review not found or you don't have permission to update it"));
                }

                return Ok(new ApiResponse<ReviewDto>(review));
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ApiResponse<ReviewDto>($"Internal server error: {ex.Message}"));
            }
        }

        [HttpDelete("{id}")]
        [Authorize]
        public async Task<ActionResult<ApiResponse<bool>>> DeleteReview(Guid id)
        {
            try
            {
                var userId = GetCurrentUserId();
                if (userId == null)
                {
                    return Unauthorized(new ApiResponse<bool>("User not authenticated"));
                }

                var success = await _reviewService.DeleteReviewAsync(id, userId.Value);
                
                if (!success)
                {
                    return NotFound(new ApiResponse<bool>("Review not found or you don't have permission to delete it"));
                }

                return Ok(new ApiResponse<bool>(true));
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ApiResponse<bool>($"Internal server error: {ex.Message}"));
            }
        }

        [HttpPost("{id}/like")]
        [Authorize]
        public async Task<ActionResult<ApiResponse<bool>>> LikeReview(Guid id)
        {
            try
            {
                var userId = GetCurrentUserId();
                if (userId == null)
                {
                    return Unauthorized(new ApiResponse<bool>("User not authenticated"));
                }

                var success = await _reviewService.LikeReviewAsync(id, userId.Value);
                
                if (!success)
                {
                    return BadRequest(new ApiResponse<bool>("Unable to like review. Review may not exist or already liked."));
                }

                return Ok(new ApiResponse<bool>(true));
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ApiResponse<bool>($"Internal server error: {ex.Message}"));
            }
        }

        [HttpDelete("{id}/like")]
        [Authorize]
        public async Task<ActionResult<ApiResponse<bool>>> UnlikeReview(Guid id)
        {
            try
            {
                var userId = GetCurrentUserId();
                if (userId == null)
                {
                    return Unauthorized(new ApiResponse<bool>("User not authenticated"));
                }

                var success = await _reviewService.UnlikeReviewAsync(id, userId.Value);
                
                if (!success)
                {
                    return BadRequest(new ApiResponse<bool>("Unable to unlike review. Review may not exist or not liked."));
                }

                return Ok(new ApiResponse<bool>(true));
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ApiResponse<bool>($"Internal server error: {ex.Message}"));
            }
        }

        [HttpGet("{id}/is-liked")]
        [Authorize]
        public async Task<ActionResult<ApiResponse<bool>>> IsReviewLiked(Guid id)
        {
            try
            {
                var userId = GetCurrentUserId();
                if (userId == null)
                {
                    return Unauthorized(new ApiResponse<bool>("User not authenticated"));
                }

                var isLiked = await _reviewService.IsReviewLikedByUserAsync(id, userId.Value);
                return Ok(new ApiResponse<bool>(isLiked));
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ApiResponse<bool>($"Internal server error: {ex.Message}"));
            }
        }

        private Guid? GetCurrentUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
            {
                return null;
            }
            
            if (Guid.TryParse(userIdClaim.Value, out var userId))
            {
                return userId;
            }
            
            return null;
        }
    }
}
