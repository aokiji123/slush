namespace Application.DTOs;

public class GameConsoleFeaturesDto
{
    public Guid Id { get; set; }
    public Guid GameId { get; set; }
    public string Platform { get; set; } = string.Empty;
    public string? PerformanceModes { get; set; }
    public string? Resolution { get; set; }
    public string? FrameRate { get; set; }
    public bool HDRSupport { get; set; }
    public bool RayTracingSupport { get; set; }
    public string? ControllerFeatures { get; set; }
    public string? StorageRequired { get; set; }
    public bool OnlinePlayRequired { get; set; }
}

