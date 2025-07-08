using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

namespace API.Controllers
{
    [Route("api/test")]
    [ApiController]
    public class TestController : ControllerBase
    {
        private readonly HttpClient _httpClient;
        private const string BaseUrl = "https://www.freetogame.com/api";

        public TestController(IHttpClientFactory httpClientFactory)
        {
            _httpClient = httpClientFactory.CreateClient();
        }

        // GET: api/test
        [HttpGet]
        public async Task<IActionResult> GetGames()
        {
            string url = $"{BaseUrl}/games";
            var response = await _httpClient.GetAsync(url);

            if (!response.IsSuccessStatusCode) return StatusCode((int)response.StatusCode, "Не вдалося отримати список ігор");

            var content = await response.Content.ReadAsStringAsync();
            var games = JsonSerializer.Deserialize<List<FreeToGameGame>>(content, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
            if (games == null || games.Count == 0) return NotFound("Список ігор порожній");

            foreach (var game in games)
            {
                game.ReleaseDate = DateTime.Today.ToString().Split(" ")[0];
                game.ShortDescription =
                    "Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.";
            }

            return Ok(games);
        }

        // GET: api/test/452
        [HttpGet("{id}")]
        public async Task<IActionResult> GetGame(int id)
        {
            string url = $"{BaseUrl}/game?id={id}";
            var response = await _httpClient.GetAsync(url);

            if (!response.IsSuccessStatusCode) return StatusCode((int)response.StatusCode, "Гра не знайдена");

            var content = await response.Content.ReadAsStringAsync();
            var game = JsonSerializer.Deserialize<FreeToGameGame>(content, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
            if (game == null || game.Id == 0) return NotFound("Гра не знайдена");
            game.ReleaseDate = DateTime.Today.ToString().Split(" ")[0];
            game.ShortDescription =
                "Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.";

            return Ok(game);
        }
    }
    
    public class FreeToGameGame
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Thumbnail { get; set; }
        public string Genre { get; set; }
        public string Platform { get; set; }
        public string ReleaseDate { get; set; }
        public string ShortDescription { get; set; }
    }
}
