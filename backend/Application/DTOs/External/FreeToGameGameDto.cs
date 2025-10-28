using System;
using System.Collections.Generic;

namespace Application.DTOs.External;

public class FreeToGameScreenshotDto
{
    public int Id { get; set; }
    public string Image { get; set; } = string.Empty;
}

public class FreeToGameGameDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Thumbnail { get; set; } = string.Empty;
    public string Short_Description { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Game_Url { get; set; } = string.Empty;
    public string Genre { get; set; } = string.Empty;
    public string Platform { get; set; } = string.Empty;
    public string Publisher { get; set; } = string.Empty;
    public string Developer { get; set; } = string.Empty;
    public string Release_Date { get; set; } = string.Empty; // yyyy-mm-dd
    public List<FreeToGameScreenshotDto> Screenshots { get; set; } = new();
    public FreeToGameSystemRequirementsDto? Minimum_System_Requirements { get; set; }
}


public class FreeToGameSystemRequirementsDto
{
    public string Os { get; set; } = string.Empty;
    public string Processor { get; set; } = string.Empty;
    public string Memory { get; set; } = string.Empty;
    public string Graphics { get; set; } = string.Empty;
    public string Storage { get; set; } = string.Empty;
}


