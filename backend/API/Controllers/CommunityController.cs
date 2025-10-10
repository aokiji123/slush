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
public class CommunityController : ControllerBase
{
	private readonly ICommunityService _communityService;

	public CommunityController(ICommunityService communityService)
	{
		_communityService = communityService;
	}

	[HttpGet("posts/{gameId:guid}")]
	[AllowAnonymous]
	public async Task<IActionResult> GetPosts(Guid gameId)
	{
		var items = await _communityService.GetPostsByGameAsync(gameId);
		return Ok(items);
	}

	[HttpGet("post/{gameId:guid}/{postId:guid}")]
	[AllowAnonymous]
	public async Task<IActionResult> GetPost(Guid gameId, Guid postId)
	{
		var post = await _communityService.GetPostAsync(gameId, postId);
		if (post == null) return NotFound();
		return Ok(post);
	}

	[HttpPost("post/{gameId:guid}")]
	public async Task<IActionResult> CreatePost(Guid gameId, [FromBody] CreatePostDto dto)
	{
		var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
		var created = await _communityService.CreatePostAsync(userId, gameId, dto);
		return Ok(created);
	}

	[HttpPut("post/{gameId:guid}/{postId:guid}")]
	public async Task<IActionResult> UpdatePost(Guid gameId, Guid postId, [FromBody] UpdatePostDto dto)
	{
		var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
		var updated = await _communityService.UpdatePostAsync(userId, gameId, postId, dto);
		if (updated == null) return NotFound();
		return Ok(updated);
	}

	[HttpDelete("post/{gameId:guid}/{postId:guid}")]
	public async Task<IActionResult> DeletePost(Guid gameId, Guid postId)
	{
		var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
		var ok = await _communityService.DeletePostAsync(userId, gameId, postId);
		if (!ok) return NotFound();
		return NoContent();
	}

	[HttpGet("comments/{postId:guid}")]
	[AllowAnonymous]
	public async Task<IActionResult> GetComments(Guid postId)
	{
		var items = await _communityService.GetCommentsByPostAsync(postId);
		return Ok(items);
	}

	[HttpPost("comments/{postId:guid}")]
	public async Task<IActionResult> CreateComment(Guid postId, [FromBody] CreateCommentDto dto)
	{
		var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
		var created = await _communityService.CreateCommentAsync(userId, postId, dto);
		return Ok(created);
	}

	[HttpDelete("comments/{postId:guid}/{commentId:guid}")]
	public async Task<IActionResult> DeleteComment(Guid postId, Guid commentId)
	{
		var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
		var ok = await _communityService.DeleteCommentAsync(userId, postId, commentId);
		if (!ok) return NotFound();
		return NoContent();
	}

	[HttpPost("like/post/{postId:guid}")]
	public async Task<IActionResult> LikePost(Guid postId)
	{
		var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
		await _communityService.LikePostAsync(userId, postId);
		return Ok();
	}

	[HttpDelete("like/post/{postId:guid}")]
	public async Task<IActionResult> UnlikePost(Guid postId)
	{
		var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
		await _communityService.UnlikePostAsync(userId, postId);
		return NoContent();
	}

	[HttpPost("like/comment/{commentId:guid}")]
	public async Task<IActionResult> LikeComment(Guid commentId)
	{
		var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
		await _communityService.LikeCommentAsync(userId, commentId);
		return Ok();
	}

	[HttpDelete("like/comment/{commentId:guid}")]
	public async Task<IActionResult> UnlikeComment(Guid commentId)
	{
		var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
		await _communityService.UnlikeCommentAsync(userId, commentId);
		return NoContent();
	}

	[HttpPost("upload")]
	public async Task<IActionResult> Upload([FromQuery] Guid postId, [FromBody] UploadMediaDto dto)
	{
		var media = await _communityService.UploadMediaAsync(postId, dto);
		return Ok(media);
	}
}


