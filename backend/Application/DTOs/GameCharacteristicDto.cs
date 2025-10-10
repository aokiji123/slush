using System;
using System.Collections.Generic;

namespace Application.DTOs;

public class GameCharacteristicDto
{
    public Guid GameId { get; set; }
    public string Platform { get; set; } = string.Empty;
    public string MinVersion { get; set; } = string.Empty;
    public string MinCpu { get; set; } = string.Empty;
    public string MinRam { get; set; } = string.Empty;
    public string MinGpu { get; set; } = string.Empty;
    public string MinDirectX { get; set; } = string.Empty;
    public string MinMemory { get; set; } = string.Empty;
    public string MinAudioCard { get; set; } = string.Empty;
    public string RecommendedVersion { get; set; } = string.Empty;
    public string RecommendedCpu { get; set; } = string.Empty;
    public string RecommendedRam { get; set; } = string.Empty;
    public string RecommendedGpu { get; set; } = string.Empty;
    public string RecommendedDirectX { get; set; } = string.Empty;
    public string RecommendedMemory { get; set; } = string.Empty;
    public string RecommendedAudioCard { get; set; } = string.Empty;
    public string Controller { get; set; } = string.Empty;
    public string Additional { get; set; } = string.Empty;
    public List<string> LangAudio { get; set; } = new();
    public List<string> LangText { get; set; } = new();
}
