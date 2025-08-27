using System;
using System.Threading.Tasks;
using Domain.Entities;

namespace Domain.Interfaces;

public interface IAuthRepository
{
    Task<User?> GetByEmailAsync(string email);
    Task AddAsync(User user);
}
