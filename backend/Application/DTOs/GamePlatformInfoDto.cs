using System.Collections.Generic;

namespace Application.DTOs;

public class GamePlatformInfoDto
{
    public List<GameCharacteristicDto> PcCharacteristics { get; set; } = new();
    public List<GameConsoleFeaturesDto> ConsoleFeatures { get; set; } = new();
    public List<string> AvailablePlatforms { get; set; } = new();
}

