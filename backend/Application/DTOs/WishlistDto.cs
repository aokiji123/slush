using System;
using System.ComponentModel.DataAnnotations;

namespace Application.DTOs;

public class WishlistRequestDto
{
    [Required]
    public Guid UserId { get; set; }

    [Required]
    public Guid GameId { get; set; }
}
