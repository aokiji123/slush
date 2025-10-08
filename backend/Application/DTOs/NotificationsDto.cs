using System;

namespace Application.DTOs;

public class NotificationsDto
{
    public Guid UserId { get; set; }
    public bool BigSale { get; set; }
    public bool WishlistDiscount { get; set; }
    public bool NewProfileComment { get; set; }
    public bool NewFriendRequest { get; set; }
    public bool FriendRequestAccepted { get; set; }
    public bool FriendRequestDeclined { get; set; }
}


