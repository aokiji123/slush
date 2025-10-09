using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain.Entities;
using Domain.Interfaces;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

public class LibraryRepository : ILibraryRepository
{
    private readonly AppDbContext _context;

    public LibraryRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Library>> GetByUserIdAsync(Guid userId)
    {
        return await _context.Libraries
            .Where(l => l.UserId == userId)
            .Include(l => l.Game)
            .OrderByDescending(l => l.AddedAt)
            .ToListAsync();
    }

    public async Task<Library?> GetByUserIdAndGameIdAsync(Guid userId, Guid gameId)
    {
        return await _context.Libraries
            .FirstOrDefaultAsync(l => l.UserId == userId && l.GameId == gameId);
    }

    public async Task<Library> AddAsync(Library library)
    {
        _context.Libraries.Add(library);
        await _context.SaveChangesAsync();
        return library;
    }

    public async Task<bool> ExistsAsync(Guid userId, Guid gameId)
    {
        return await _context.Libraries
            .AnyAsync(l => l.UserId == userId && l.GameId == gameId);
    }

    public async Task DeleteAsync(Library library)
    {
        _context.Libraries.Remove(library);
        await _context.SaveChangesAsync();
    }
}