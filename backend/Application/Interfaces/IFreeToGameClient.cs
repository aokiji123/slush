using System.Threading.Tasks;
using Application.DTOs.External;

namespace Application.Interfaces;

public interface IFreeToGameClient
{
    Task<FreeToGameGameDto?> GetGameAsync(int id);
}


