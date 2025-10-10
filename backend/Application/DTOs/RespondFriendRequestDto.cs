using System;

namespace Application.DTOs;

public class RespondFriendRequestDto
{
    public Guid SenderId { get; set; }
    public Guid ReceiverId { get; set; }
}
