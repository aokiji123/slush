using System;

namespace Application.DTOs;

public class WishlistRequestDto
{
    public Guid UserId { get; set; }
    public Guid GameId { get; set; }
}

public class WishlistMeRequestDto
{
    public Guid GameId { get; set; }
}
