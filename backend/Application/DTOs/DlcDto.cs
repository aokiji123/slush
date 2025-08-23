using System;

namespace Application.DTOs;

public class DlcDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public double Price { get; set; }
}