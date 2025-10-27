using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.DTOs;
using Application.Interfaces;
using Domain.Entities;
using Domain.Interfaces;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Services;

public class CollectionService : ICollectionService
{
    private readonly AppDbContext _context;
    private readonly ICollectionRepository _collectionRepository;

    public CollectionService(AppDbContext context, ICollectionRepository collectionRepository)
    {
        _context = context;
        _collectionRepository = collectionRepository;
    }

    public async Task<IEnumerable<CollectionDto>> GetUserCollectionsAsync(Guid userId)
    {
        var collections = await _collectionRepository.GetByUserIdAsync(userId);
        
        return collections.Select(c => new CollectionDto
        {
            Id = c.Id,
            Name = c.Name,
            Description = c.Description,
            GamesCount = c.Games.Count,
            CreatedAt = c.CreatedAt
        }).ToList();
    }

    public async Task<CollectionDetailsDto> GetCollectionByIdAsync(Guid id)
    {
        var collection = await _collectionRepository.GetByIdAsync(id);
        
        if (collection == null)
        {
            throw new InvalidOperationException("Collection not found");
        }

        var games = collection.Games.Select(cg => new LibraryGameDto
        {
            Id = cg.Game.Id,
            Name = cg.Game.Name,
            Slug = cg.Game.Slug,
            MainImage = cg.Game.MainImage,
            Price = (double)cg.Game.Price,
            SalePrice = (double)cg.Game.SalePrice,
            DiscountPercent = cg.Game.DiscountPercent,
            Rating = cg.Game.Rating,
            ReleaseDate = cg.Game.ReleaseDate,
            Genres = cg.Game.Genre,
            Platforms = cg.Game.Platforms,
            AddedAt = cg.AddedAt,
            IsFavorite = false // Collections don't track favorites directly
        }).ToList();

        return new CollectionDetailsDto
        {
            Id = collection.Id,
            Name = collection.Name,
            Description = collection.Description,
            Games = games,
            CreatedAt = collection.CreatedAt,
            UpdatedAt = collection.UpdatedAt
        };
    }

    public async Task<CollectionDto> CreateCollectionAsync(Guid userId, CreateCollectionDto dto)
    {
        var collection = new GameCollection
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            Name = dto.Name,
            Description = dto.Description,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        await _collectionRepository.CreateAsync(collection);

        return new CollectionDto
        {
            Id = collection.Id,
            Name = collection.Name,
            Description = collection.Description,
            GamesCount = 0,
            CreatedAt = collection.CreatedAt
        };
    }

    public async Task<CollectionDto> UpdateCollectionAsync(Guid id, UpdateCollectionDto dto)
    {
        var collection = await _collectionRepository.GetByIdAsync(id);
        
        if (collection == null)
        {
            throw new InvalidOperationException("Collection not found");
        }

        collection.Name = dto.Name;
        collection.Description = dto.Description;
        collection.UpdatedAt = DateTime.UtcNow;

        await _collectionRepository.UpdateAsync(collection);

        return new CollectionDto
        {
            Id = collection.Id,
            Name = collection.Name,
            Description = collection.Description,
            GamesCount = collection.Games.Count,
            CreatedAt = collection.CreatedAt
        };
    }

    public async Task<bool> DeleteCollectionAsync(Guid id)
    {
        return await _collectionRepository.DeleteAsync(id);
    }

    public async Task<bool> AddGameToCollectionAsync(Guid collectionId, Guid gameId)
    {
        return await _collectionRepository.AddGameToCollectionAsync(collectionId, gameId);
    }

    public async Task<bool> RemoveGameFromCollectionAsync(Guid collectionId, Guid gameId)
    {
        return await _collectionRepository.RemoveGameFromCollectionAsync(collectionId, gameId);
    }
}

