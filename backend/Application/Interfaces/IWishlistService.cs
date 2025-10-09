using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Application.Interfaces;

public interface IWishlistService
{
    Task<IEnumerable<Guid>> GetWishlistGameIdsAsync(Guid userId);
    Task<bool> AddToWishlistAsync(Guid userId, Guid gameId);
    Task<bool> RemoveFromWishlistAsync(Guid userId, Guid gameId);
}
