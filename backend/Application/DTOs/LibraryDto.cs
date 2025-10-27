using System;
using System.Collections.Generic;

namespace Application.DTOs;

public class LibraryDto
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public Guid GameId { get; set; }
    public DateTime AddedAt { get; set; }
}

public class AddToLibraryDto
{
    public Guid UserId { get; set; }
    public Guid GameId { get; set; }
}

public class LibraryMeRequestDto
{
    public Guid GameId { get; set; }
}

public class LibraryGameDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string MainImage { get; set; } = string.Empty;
    public double Price { get; set; }
    public double SalePrice { get; set; }
    public int DiscountPercent { get; set; }
    public double Rating { get; set; }
    public DateTime ReleaseDate { get; set; }
    public List<string> Genres { get; set; } = new();
    public List<string> Platforms { get; set; } = new();
    public DateTime AddedAt { get; set; }
    public bool IsFavorite { get; set; }
}