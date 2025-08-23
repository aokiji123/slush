using System;

namespace Application.DTOs;

public class DeveloperDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Website { get; set; } = string.Empty;
}