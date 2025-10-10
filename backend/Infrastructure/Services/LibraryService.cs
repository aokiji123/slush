using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Common.Query;
using Application.DTOs;
using Application.Interfaces;
using Domain.Entities;
using Domain.Interfaces;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Services;

public class LibraryService : ILibraryService
{
    private readonly AppDbContext _context;
    private readonly ILibraryRepository _libraryRepository;

    public LibraryService(AppDbContext context, ILibraryRepository libraryRepository)
    {
        _context = context;
        _libraryRepository = libraryRepository;
    }

    public async Task<PagedResult<OwnedGameDto>> GetOwnedAsync(Guid userId, LibraryQueryParameters parameters)
    {
        parameters ??= new LibraryQueryParameters();

        IQueryable<Library> baseQuery = _context.Libraries
            .AsNoTracking()
            .Where(l => l.UserId == userId);

        if (parameters.IsDlc.HasValue)
        {
            baseQuery = baseQuery.Where(l => l.Game.IsDlc == parameters.IsDlc.Value);
        }

        baseQuery = baseQuery.ApplySearch(parameters,
            l => l.Game.Name,
            l => l.Game.Developer,
            l => l.Game.Publisher);

        var total = await baseQuery.CountAsync();

        var items = await baseQuery
            .Include(l => l.Game)
            .ApplySorting(parameters)
            .ApplyPagination(parameters)
            .Select(l => new OwnedGameDto
            {
                GameId = l.GameId,
                Title = l.Game.Title ?? string.Empty,
                MainImage = l.Game.MainImage ?? string.Empty,
                PurchasedAt = l.AddedAt,
                PurchasePrice = (double)l.Game.Price
            })
            .ToListAsync();

        return new PagedResult<OwnedGameDto>(items, parameters.Page, parameters.Limit, total);
    }

    public async Task<bool> IsOwnedAsync(Guid userId, Guid gameId)
    {
        return await _context.Libraries.AnyAsync(l => l.UserId == userId && l.GameId == gameId);
    }

    public async Task<IEnumerable<LibraryGameDto>> GetUserLibraryAsync(Guid userId)
    {
        var libraries = await _libraryRepository.GetByUserIdAsync(userId);
        return libraries.Select(l => new LibraryGameDto
        {
            GameId = l.GameId,
            Title = l.Game.Name,
            MainImage = l.Game.MainImage,
            AddedAt = l.AddedAt
        });
    }

    public async Task<LibraryDto> AddToLibraryAsync(AddToLibraryDto dto)
    {
        // Check if already exists
        var exists = await _libraryRepository.ExistsAsync(dto.UserId, dto.GameId);
        if (exists)
        {
            throw new InvalidOperationException("Game is already in user's library");
        }

        var library = new Library
        {
            Id = Guid.NewGuid(),
            UserId = dto.UserId,
            GameId = dto.GameId,
            AddedAt = DateTime.UtcNow
        };

        var addedLibrary = await _libraryRepository.AddAsync(library);
        
        return new LibraryDto
        {
            Id = addedLibrary.Id,
            UserId = addedLibrary.UserId,
            GameId = addedLibrary.GameId,
            AddedAt = addedLibrary.AddedAt
        };
    }

    public async Task<bool> IsInLibraryAsync(Guid userId, Guid gameId)
    {
        return await _libraryRepository.ExistsAsync(userId, gameId);
    }
}