using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Common.Query;
using Application.DTOs;
using Application.Interfaces;
using Domain.Entities;
using Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Services
{
    public class ReviewService : IReviewService
    {
        private readonly ReviewRepository _reviewRepository;
        private readonly ReviewLikeRepository _reviewLikeRepository;

        public ReviewService(ReviewRepository reviewRepository, ReviewLikeRepository reviewLikeRepository)
        {
            _reviewRepository = reviewRepository;
            _reviewLikeRepository = reviewLikeRepository;
        }

        public async Task<ReviewDto?> GetReviewByIdAsync(Guid id, Guid? currentUserId = null)
        {
            var review = await _reviewRepository.GetByIdAsync(id);
            if (review == null) return null;

            var isLiked = currentUserId.HasValue 
                ? await _reviewLikeRepository.IsLikedByUserAsync(currentUserId.Value, id)
                : false;

            return MapToDto(review, isLiked);
        }

        public async Task<IEnumerable<ReviewDto>> GetReviewsAsync(ReviewQueryParameters parameters, Guid? currentUserId = null)
        {
            var reviews = await _reviewRepository.GetReviewsAsync(parameters);
            var reviewDtos = new List<ReviewDto>();

            foreach (var review in reviews)
            {
                var isLiked = currentUserId.HasValue 
                    ? await _reviewLikeRepository.IsLikedByUserAsync(currentUserId.Value, review.Id)
                    : false;

                reviewDtos.Add(MapToDto(review, isLiked));
            }

            return reviewDtos;
        }

        public async Task<ReviewDto> CreateReviewAsync(CreateReviewDto createReviewDto, Guid userId)
        {
            // Check if user already reviewed this game
            if (await _reviewRepository.UserHasReviewedGameAsync(userId, createReviewDto.GameId))
            {
                throw new InvalidOperationException("User has already reviewed this game");
            }

            var review = new Review
            {
                Id = Guid.NewGuid(),
                GameId = createReviewDto.GameId,
                UserId = userId,
                Content = createReviewDto.Content,
                Rating = createReviewDto.Rating,
                CreatedAt = DateTime.UtcNow,
                Likes = 0
            };

            try
            {
                var createdReview = await _reviewRepository.AddReviewAsync(review);
                return MapToDto(createdReview, false);
            }
            catch (Exception ex)
            {
                throw new InvalidOperationException($"Failed to create review: {ex.Message}", ex);
            }
        }

        public async Task<ReviewDto?> UpdateReviewAsync(Guid id, CreateReviewDto updateReviewDto, Guid userId)
        {
            var review = await _reviewRepository.GetByIdAsync(id);
            if (review == null || review.UserId != userId) return null;

            review.Content = updateReviewDto.Content;
            review.Rating = updateReviewDto.Rating;

            var updatedReview = await _reviewRepository.UpdateReviewAsync(review);
            if (updatedReview == null) return null;

            var isLiked = await _reviewLikeRepository.IsLikedByUserAsync(userId, id);
            return MapToDto(updatedReview, isLiked);
        }

        public async Task<bool> DeleteReviewAsync(Guid id, Guid userId)
        {
            var review = await _reviewRepository.GetByIdAsync(id);
            if (review == null || review.UserId != userId) return false;

            return await _reviewRepository.DeleteReviewAsync(id);
        }

        public async Task<bool> LikeReviewAsync(Guid reviewId, Guid userId)
        {
            // Check if review exists
            if (!await _reviewRepository.ExistsAsync(reviewId)) return false;

            // Check if already liked
            if (await _reviewLikeRepository.IsLikedByUserAsync(userId, reviewId)) return false;

            var reviewLike = new ReviewLike
            {
                ReviewId = reviewId,
                UserId = userId,
                CreatedAt = DateTime.UtcNow
            };

            await _reviewLikeRepository.AddLikeAsync(reviewLike);

            // Update like count
            var review = await _reviewRepository.GetByIdAsync(reviewId);
            if (review != null)
            {
                review.Likes = await _reviewLikeRepository.GetLikeCountAsync(reviewId);
                await _reviewRepository.UpdateReviewAsync(review);
            }

            return true;
        }

        public async Task<bool> UnlikeReviewAsync(Guid reviewId, Guid userId)
        {
            var success = await _reviewLikeRepository.RemoveLikeAsync(userId, reviewId);
            if (!success) return false;

            // Update like count
            var review = await _reviewRepository.GetByIdAsync(reviewId);
            if (review != null)
            {
                review.Likes = await _reviewLikeRepository.GetLikeCountAsync(reviewId);
                await _reviewRepository.UpdateReviewAsync(review);
            }

            return true;
        }

        public async Task<bool> IsReviewLikedByUserAsync(Guid reviewId, Guid userId)
        {
            return await _reviewLikeRepository.IsLikedByUserAsync(userId, reviewId);
        }

        private static ReviewDto MapToDto(Review review, bool isLiked)
        {
            return new ReviewDto
            {
                Id = review.Id,
                GameId = review.GameId,
                UserId = review.UserId,
                Username = review.User?.Nickname ?? review.User?.UserName ?? "Unknown",
                UserAvatar = review.User?.Avatar ?? "https://static.vecteezy.com/system/resources/previews/060/605/418/non_2x/default-avatar-profile-icon-social-media-user-free-vector.jpg",
                Content = review.Content,
                Rating = review.Rating,
                CreatedAt = review.CreatedAt,
                Likes = review.Likes,
                IsLikedByCurrentUser = isLiked
            };
        }
    }
}