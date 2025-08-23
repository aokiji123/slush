using System;
using System.Threading.Tasks;
using Application.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace API.Controllers
{
    [Route("api/user")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly ILogger<UserController> _logger;

        public UserController(IUserService userService, ILogger<UserController> logger)
        {
            _userService = userService;
            _logger = logger;
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetUser(Guid id)
        {
            if (id == Guid.Empty)
            {
                return BadRequest("User ID cannot be empty");
            }

            try
            {
                var user = await _userService.GetUserAsync(id);
                
                if (user == null)
                {
                    return NotFound($"User with ID {id} not found");
                }
                
                return Ok(user);
            }
            catch (ArgumentException ex)
            {
                _logger.LogWarning(ex, "Invalid request for user {UserId}", id);
                return BadRequest("Invalid request");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while retrieving user {UserId}", id);
                return StatusCode(500, "Internal server error");
            }
        }
    }
}
