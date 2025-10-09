using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Domain.Entities;

namespace Domain.Interfaces;

public interface ILibraryRepository
{
    Task<IEnumerable<Library>> GetByUserIdAsync(Guid userId);
    Task<Library?> GetByUserIdAndGameIdAsync(Guid userId, Guid gameId);
    Task<Library> AddAsync(Library library);
    Task<bool> ExistsAsync(Guid userId, Guid gameId);
    Task DeleteAsync(Library library);
}