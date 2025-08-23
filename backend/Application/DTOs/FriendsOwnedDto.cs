using System.Collections.Generic;

namespace Application.DTOs;

public class FriendsOwnedDto
{
    public int Count { get; set; }
    public List<FriendDto> Friends { get; set; } = new List<FriendDto>();
}