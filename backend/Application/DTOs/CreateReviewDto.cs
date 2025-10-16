using System;
using System.ComponentModel.DataAnnotations;

namespace Application.DTOs
{
    public class CreateReviewDto
    {
        [Required]
        public Guid GameId { get; set; }
        [Required, MaxLength(2000)]
        public string Content { get; set; } = null!;
        [Required, Range(1, 5)]
        public int Rating { get; set; }
    }
}
