using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Application.Common.Query;
using Application.DTOs;

namespace Application.Interfaces;

public interface IWishlistService
{
    Task<IEnumerable<Guid>> GetWishlistGameIdsAsync(Guid userId);
    Task<IEnumerable<GameDto>> GetWishlistGamesAsync(Guid userId);
    Task<PagedResult<GameDto>> GetWishlistGamesAsync(Guid userId, WishlistQueryParameters parameters);
    Task<bool> AddToWishlistAsync(Guid userId, Guid gameId);
    Task<bool> RemoveFromWishlistAsync(Guid userId, Guid gameId);
}
