using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Application.Common.Query;
using Application.DTOs;

namespace Application.Interfaces;

public interface ILibraryService
{
    Task<PagedResult<OwnedGameDto>> GetOwnedAsync(Guid userId, LibraryQueryParameters parameters);
    Task<bool> IsOwnedAsync(Guid userId, Guid gameId);
    
    // Library methods
    Task<IEnumerable<LibraryGameDto>> GetUserLibraryAsync(Guid userId);
    Task<IEnumerable<GameDto>> GetLibraryGamesAsync(Guid userId);
    Task<PagedResult<GameDto>> GetLibraryGamesAsync(Guid userId, LibraryQueryParameters parameters);
    Task<LibraryDto> AddToLibraryAsync(AddToLibraryDto dto);
    Task<bool> IsInLibraryAsync(Guid userId, Guid gameId);
}
