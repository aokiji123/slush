using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Domain.Entities;

namespace Domain.Interfaces;

public interface IWalletRepository
{
    Task<User> GetOrCreateUserAsync(Guid userId);
    Task SaveAsync();
}
