using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Common.Query;
using Application.DTOs;
using Application.Interfaces;
using Domain.Entities;
using Domain.Interfaces;
using Microsoft.EntityFrameworkCore;
using AutoMapper;

namespace Infrastructure.Services
{
    public class ReviewService : IReviewService
    {
        private readonly IReviewRepository _reviewRepository;
        private readonly IReviewLikeRepository _reviewLikeRepository;
        private readonly IMapper _mapper;

        public ReviewService(IReviewRepository reviewRepository, IReviewLikeRepository reviewLikeRepository, IMapper mapper)
        {
            _reviewRepository = reviewRepository;
            _reviewLikeRepository = reviewLikeRepository;
            _mapper = mapper;
        }

        public async Task<ReviewDto?> GetReviewByIdAsync(Guid id, Guid? currentUserId = null)
        {
            var review = await _reviewRepository.GetByIdAsync(id);
            if (review == null) return null;

            var isLiked = currentUserId.HasValue && 
                await _reviewLikeRepository.IsLikedByUserAsync(currentUserId.Value, id);

            var reviewDto = _mapper.Map<ReviewDto>(review);
            reviewDto.IsLikedByCurrentUser = isLiked;
            return reviewDto;
        }

        public async Task<IEnumerable<ReviewDto>> GetReviewsAsync(ReviewQueryParameters parameters, Guid? currentUserId = null)
        {
            var reviews = await _reviewRepository.GetReviewsAsync(
                parameters.GameId, 
                parameters.UserId, 
                parameters.MinRating, 
                (parameters.Page - 1) * parameters.PageSize, 
                parameters.PageSize);
            
            var reviewDtos = new List<ReviewDto>();

            foreach (var review in reviews)
            {
                var isLiked = currentUserId.HasValue && 
                    await _reviewLikeRepository.IsLikedByUserAsync(currentUserId.Value, review.Id);

                var reviewDto = _mapper.Map<ReviewDto>(review);
                reviewDto.IsLikedByCurrentUser = isLiked;
                reviewDtos.Add(reviewDto);
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

            var review = _mapper.Map<Review>(createReviewDto);
            review.Id = Guid.NewGuid();
            review.UserId = userId;
            review.CreatedAt = DateTime.UtcNow;
            review.Likes = 0;

            try
            {
                var createdReview = await _reviewRepository.AddReviewAsync(review);
                var reviewDto = _mapper.Map<ReviewDto>(createdReview);
                reviewDto.IsLikedByCurrentUser = false;
                return reviewDto;
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

            _mapper.Map(updateReviewDto, review);

            var updatedReview = await _reviewRepository.UpdateReviewAsync(review);
            if (updatedReview == null) return null;

            var isLiked = await _reviewLikeRepository.IsLikedByUserAsync(userId, id);
            var reviewDto = _mapper.Map<ReviewDto>(updatedReview);
            reviewDto.IsLikedByCurrentUser = isLiked;
            return reviewDto;
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

    }
}