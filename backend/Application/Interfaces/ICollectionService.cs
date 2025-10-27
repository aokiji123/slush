using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Application.DTOs;

namespace Application.Interfaces;

public interface ICollectionService
{
    Task<IEnumerable<CollectionDto>> GetUserCollectionsAsync(Guid userId);
    Task<CollectionDetailsDto> GetCollectionByIdAsync(Guid id);
    Task<CollectionDto> CreateCollectionAsync(Guid userId, CreateCollectionDto dto);
    Task<CollectionDto> UpdateCollectionAsync(Guid id, UpdateCollectionDto dto);
    Task<bool> DeleteCollectionAsync(Guid id);
    Task<bool> AddGameToCollectionAsync(Guid collectionId, Guid gameId);
    Task<bool> RemoveGameFromCollectionAsync(Guid collectionId, Guid gameId);
}

