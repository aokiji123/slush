import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useLikePost, useUnlikePost } from '@/api/queries/useCommunity'
import { useAuthState } from '@/api/queries/useAuth'
import { FavoriteIcon, FavoriteFilledIcon, CommentsIcon } from '@/icons'
import { BsThreeDots } from 'react-icons/bs'
import { FaStar, FaShare } from 'react-icons/fa'
import { OptimizedImage } from './OptimizedImage'

export interface ProfileReviewCardProps {
  review: {
    id: string
    title: string
    content: string
    rating: number
    gameName: string
    gameImage: string
    gameId: string
    authorNickname: string
    authorAvatar?: string
    createdAt: string
    likesCount: number
    commentsCount: number
  }
  onNavigate?: () => void
  className?: string
}

export const ProfileReviewCard = ({ 
  review, 
  onNavigate, 
  className = '' 
}: ProfileReviewCardProps) => {
  const navigate = useNavigate()
  const { user } = useAuthState()
  
  const [isLiked, setIsLiked] = useState(false)
  const [likesCount, setLikesCount] = useState(review.likesCount || 0)

  const likePostMutation = useLikePost()
  const unlikePostMutation = useUnlikePost()

  const handleReviewClick = () => {
    if (onNavigate) {
      onNavigate()
    }
    navigate({
      to: '/$slug/community/post/$id',
      params: { slug: review.gameId, id: review.id },
    })
  }

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation()
    
    if (!user) return

    const wasLiked = isLiked
    const previousLikesCount = likesCount

    // Optimistic update
    setIsLiked(!wasLiked)
    setLikesCount(wasLiked ? likesCount - 1 : likesCount + 1)

    try {
      if (wasLiked) {
        await unlikePostMutation.mutateAsync(review.id)
      } else {
        await likePostMutation.mutateAsync(review.id)
      }
    } catch (error) {
      // Revert optimistic update on error
      setIsLiked(wasLiked)
      setLikesCount(previousLikesCount)
    }
  }

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation()
    // TODO: Implement share functionality
  }

  const handleComment = (e: React.MouseEvent) => {
    e.stopPropagation()
    handleReviewClick()
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Щойно'
    if (diffInHours < 24) return `${diffInHours} год. тому`
    
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays} дн. тому`
    
    return date.toLocaleDateString('uk-UA', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <FaStar
        key={index}
        size={20}
        className={index < rating ? 'text-[#FFD700]' : 'text-[rgba(204,248,255,0.3)]'}
      />
    ))
  }

  return (
    <div
      className={`bg-[#002f3d] rounded-[20px] overflow-hidden hover:bg-[#003a4a] transition-colors cursor-pointer ${className}`}
      onClick={handleReviewClick}
    >
      {/* Game Image */}
      <div className="relative">
        <OptimizedImage
          src={review.gameImage}
          alt={review.gameName}
          className="w-full h-[256px] object-cover"
          placeholder="/game-image.png"
        />
        
        {/* Menu Button */}
        <button
          onClick={(e) => e.stopPropagation()}
          className="absolute top-[12px] right-[12px] p-[8px] bg-black bg-opacity-50 hover:bg-opacity-70 rounded-[8px] transition-colors"
        >
          <BsThreeDots size={16} className="text-white" />
        </button>
      </div>

      {/* Content */}
      <div className="p-[20px]">
        {/* Game Title */}
        <h3 className="text-[24px] font-bold text-[#f1fdff] font-manrope mb-[8px] line-clamp-1 leading-[1.1]">
          {review.gameName}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-[8px] mb-[12px]">
          <div className="flex items-center gap-[8px]">
            {renderStars(review.rating)}
          </div>
        </div>

        {/* Review Content */}
        <p className="text-[16px] text-[rgba(204,248,255,0.8)] font-artifakt mb-[16px] line-clamp-3 leading-[1.5]">
          {review.content}
        </p>

        {/* Date */}
        <div className="mb-[16px]">
          <span className="text-[14px] font-artifakt text-[rgba(204,248,255,0.65)]">
            {formatDate(review.createdAt)}
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-[24px]">
            {/* Like Button */}
            <button
              onClick={handleLike}
              className="flex items-center gap-[8px] bg-[rgba(55,195,255,0.12)] px-[8px] py-[4px] rounded-[8px] text-[rgba(204,248,255,0.65)] hover:text-[#24E5C2] transition-colors"
            >
            {isLiked ? (
              <FavoriteFilledIcon className="text-[#24E5C2] w-[24px] h-[24px]" />
            ) : (
              <FavoriteIcon className="w-[24px] h-[24px]" />
            )}
              <span className="text-[16px] font-artifakt-medium">{likesCount}</span>
            </button>

            {/* Comment Button */}
            <button
              onClick={handleComment}
              className="flex items-center gap-[8px] bg-[rgba(55,195,255,0.12)] px-[8px] py-[4px] rounded-[8px] text-[rgba(204,248,255,0.65)] hover:text-[#24E5C2] transition-colors"
            >
              <CommentsIcon className="w-[24px] h-[24px]" />
              <span className="text-[16px] font-artifakt-medium">{review.commentsCount || 0}</span>
            </button>

            {/* Share Button */}
            <button
              onClick={handleShare}
              className="flex items-center gap-[8px] bg-[rgba(55,195,255,0.12)] px-[8px] py-[4px] rounded-[8px] text-[rgba(204,248,255,0.65)] hover:text-[#24E5C2] transition-colors"
            >
              <FaShare className="w-[24px] h-[24px]" />
              <span className="text-[16px] font-artifakt-medium">Поділитись</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
