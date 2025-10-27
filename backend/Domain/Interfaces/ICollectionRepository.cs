using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Domain.Entities;

namespace Domain.Interfaces;

public interface ICollectionRepository
{
    Task<IEnumerable<GameCollection>> GetByUserIdAsync(Guid userId);
    Task<GameCollection?> GetByIdAsync(Guid id);
    Task<GameCollection> CreateAsync(GameCollection collection);
    Task<GameCollection> UpdateAsync(GameCollection collection);
    Task<bool> DeleteAsync(Guid id);
    Task<bool> AddGameToCollectionAsync(Guid collectionId, Guid gameId);
    Task<bool> RemoveGameFromCollectionAsync(Guid collectionId, Guid gameId);
    Task<bool> IsGameInCollectionAsync(Guid collectionId, Guid gameId);
}

