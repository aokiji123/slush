using System;

namespace Application.DTOs
{
    public class CreateReviewDto
    {
        public Guid GameId { get; set; }
        public string Content { get; set; } = null!;
        public int Rating { get; set; }
    }
}
