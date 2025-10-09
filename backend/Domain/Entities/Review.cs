using System;
using System.ComponentModel.DataAnnotations;

namespace Domain.Entities;

public class Review
{
    public Guid Id { get; set; }

    [Required]
    public Guid GameId { get; set; }

    [Required, MaxLength(100)]
    public string Username { get; set; } = null!;

    [Required, MaxLength(2000)]
    public string Content { get; set; } = null!;

    [Range(1, 5)]
    public int Rating { get; set; }

    [DataType(DataType.DateTime)]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [Range(0, int.MaxValue)]
    public int Likes { get; set; } = 0;

    [Range(0, int.MaxValue)]
    public int Dislikes { get; set; } = 0;

    public Game Game { get; set; } = null!;
}