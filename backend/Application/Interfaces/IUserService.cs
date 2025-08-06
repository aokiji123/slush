using Application.DTOs;

namespace Application.Interfaces;

public interface IUserService
{
    Task<UserDto> GetUserAsync(Guid id);
}
