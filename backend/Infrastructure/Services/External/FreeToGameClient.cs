using System;
using System.Net.Http;
using System.Net.Http.Json;
using System.Threading.Tasks;
using Application.DTOs.External;
using Application.Interfaces;

namespace Infrastructure.Services.External;

public class FreeToGameClient : IFreeToGameClient
{
    private readonly HttpClient _httpClient;

    public FreeToGameClient(HttpClient httpClient)
    {
        _httpClient = httpClient;
        if (_httpClient.BaseAddress == null)
        {
            _httpClient.BaseAddress = new Uri("https://www.freetogame.com/");
        }
    }

    public async Task<FreeToGameGameDto?> GetGameAsync(int id)
    {
        var response = await _httpClient.GetAsync($"api/game?id={id}");
        if (!response.IsSuccessStatusCode)
        {
            return null;
        }

        var dto = await response.Content.ReadFromJsonAsync<FreeToGameGameDto>();
        return dto;
    }
}


