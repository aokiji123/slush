using System;

namespace Application.DTOs
{
    public class ReviewDto
    {
        public Guid Id { get; set; }
        public Guid GameId { get; set; }
        public Guid UserId { get; set; }
        public string Username { get; set; } = null!;
        public string UserAvatar { get; set; } = null!;
        public string Content { get; set; } = null!;
        public int Rating { get; set; }
        public DateTime CreatedAt { get; set; }
        public int Likes { get; set; }
        public bool IsLikedByCurrentUser { get; set; }
        public int CommentsCount { get; set; }
    }
}
