using System;
using System.Threading.Tasks;
using Application.DTOs;
using Application.Interfaces;
using Domain.Interfaces;

namespace Application.Services;

public class UserService : IUserService
{
    private readonly IUserRepository _userRepository;

    public UserService(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }
    
    public async Task<UserDto> GetUserAsync(Guid id)
    {
        var user = await _userRepository.GetByIdAsync(id);
        return new UserDto(user.Id, user.Username, user.Email);
    }
}
