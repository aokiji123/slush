using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Domain.Entities;

public class GamesImages
{
    public Guid Id { get; set; }

    [Required]
    public Guid GameId { get; set; }

    [Required, MaxLength(500)]
    public string Path { get; set; } = null!;

    public Game Game { get; set; } = null!;
}