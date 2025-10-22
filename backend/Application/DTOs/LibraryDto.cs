using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

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
    [Required]
    public Guid GameId { get; set; }
}

public class LibraryGameDto
{
    public Guid GameId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string MainImage { get; set; } = string.Empty;
    public DateTime AddedAt { get; set; }
}