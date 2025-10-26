using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Domain.Entities;

public class GameCharacteristic
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();
    
    public Guid GameId { get; set; }

    [MaxLength(100)]
    public string Platform { get; set; } = string.Empty;

    [MaxLength(100)]
    public string MinVersion { get; set; } = string.Empty;

    [MaxLength(200)]
    public string MinCpu { get; set; } = string.Empty;

    [MaxLength(50)]
    public string MinRam { get; set; } = string.Empty;

    [MaxLength(200)]
    public string MinGpu { get; set; } = string.Empty;

    [MaxLength(50)]
    public string MinDirectX { get; set; } = string.Empty;

    [MaxLength(50)]
    public string MinMemory { get; set; } = string.Empty;

    [MaxLength(200)]
    public string MinAudioCard { get; set; } = string.Empty;

    [MaxLength(100)]
    public string RecommendedVersion { get; set; } = string.Empty;

    [MaxLength(200)]
    public string RecommendedCpu { get; set; } = string.Empty;

    [MaxLength(50)]
    public string RecommendedRam { get; set; } = string.Empty;

    [MaxLength(200)]
    public string RecommendedGpu { get; set; } = string.Empty;

    [MaxLength(50)]
    public string RecommendedDirectX { get; set; } = string.Empty;

    [MaxLength(50)]
    public string RecommendedMemory { get; set; } = string.Empty;

    [MaxLength(200)]
    public string RecommendedAudioCard { get; set; } = string.Empty;

    [MaxLength(100)]
    public string Controller { get; set; } = string.Empty;

    [MaxLength(1000)]
    public string Additional { get; set; } = string.Empty;

    public List<string>? LangAudio { get; set; }

    public List<string>? LangText { get; set; }
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public Game? Game { get; set; }
}
