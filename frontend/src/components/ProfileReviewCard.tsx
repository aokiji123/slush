import { useNavigate } from '@tanstack/react-router'
import { useLikeToggle } from '@/hooks/useLikeToggle'
import { useShare } from '@/hooks/useShare'
import { formatRelativeDate } from '@/utils/formatters'
import { BsThreeDots } from 'react-icons/bs'
import { FaStar } from 'react-icons/fa'
import { OptimizedImage } from './OptimizedImage'
import { PostActionButtons } from './PostActionButtons'

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
  const { share } = useShare()
  
  const { isLiked, likesCount, handleLike } = useLikeToggle({
    itemId: review.id,
    initialLikesCount: review.likesCount || 0
  })

  const handleReviewClick = () => {
    if (onNavigate) {
      onNavigate()
    }
    navigate({
      to: '/$slug/community/post/$id',
      params: { slug: review.gameId, id: review.id },
    })
  }

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation()
    await share({
      title: review.title,
      text: review.content,
      url: `${window.location.origin}/${review.gameId}/community/post/${review.id}`
    })
  }

  const handleComment = (e: React.MouseEvent) => {
    e.stopPropagation()
    handleReviewClick()
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
            {formatRelativeDate(review.createdAt)}
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <PostActionButtons
            likesCount={likesCount}
            commentsCount={review.commentsCount || 0}
            isLiked={isLiked}
            onLike={handleLike}
            onComment={handleComment}
            onShare={handleShare}
          />
        </div>
      </div>
    </div>
  )
}
