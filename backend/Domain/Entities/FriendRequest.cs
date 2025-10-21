using System;
using System.ComponentModel.DataAnnotations;

namespace Domain.Entities;

public class FriendRequest
{
    [Required]
    public Guid SenderId { get; set; }

    [Required]
    public Guid ReceiverId { get; set; }

    [Required]
    [MaxLength(20)]
    public string Status { get; set; } = FriendRequestStatus.Pending;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public User? Sender { get; set; }
    public User? Receiver { get; set; }
}

public static class FriendRequestStatus
{
    public const string Pending = "Pending";
    public const string Accepted = "Accepted";
    public const string Declined = "Declined";
}
