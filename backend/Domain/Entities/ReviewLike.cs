using System;
using System.ComponentModel.DataAnnotations;

namespace Domain.Entities;

public class ReviewLike
{
    public Guid Id { get; set; }

    [Required]
    public Guid ReviewId { get; set; }

    [Required]
    public Guid UserId { get; set; }

    [DataType(DataType.DateTime)]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public Review Review { get; set; } = null!;
    public User User { get; set; } = null!;
}