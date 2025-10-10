using System;

namespace Application.DTOs;

public class FriendshipDto
{
    public Guid User1Id { get; set; }
    public Guid User2Id { get; set; }
    public DateTime CreatedAt { get; set; }
}
