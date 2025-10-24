import { FaRegStar, FaStar } from 'react-icons/fa'
import { FavoriteIcon, FavoriteFilledIcon } from '@/icons'
import type { Review } from '@/api/types/game'
import { useLikeReview, useUnlikeReview } from '@/api/queries/useGame'
import { formatReviewDate } from '@/utils/dateFormat'
import { useState, memo } from 'react'
import { useTranslation } from 'react-i18next'

type GameCommentProps = {
  review: Review
  onLikeToggle?: () => void
  isCurrentUserReview?: boolean
}

export const GameComment = memo(({ review, onLikeToggle, isCurrentUserReview = false }: GameCommentProps) => {
  const { t, i18n } = useTranslation(['game'])
  const [isLiked, setIsLiked] = useState(review.isLikedByCurrentUser)
  const [likeCount, setLikeCount] = useState(review.likes)

  const likeMutation = useLikeReview()
  const unlikeMutation = useUnlikeReview()

  const handleLikeToggle = async () => {
    try {
      if (isLiked) {
        await unlikeMutation.mutateAsync(review.id)
        setIsLiked(false)
        setLikeCount(prev => prev - 1)
      } else {
        await likeMutation.mutateAsync(review.id)
        setIsLiked(true)
        setLikeCount(prev => prev + 1)
      }
      onLikeToggle?.()
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Failed to toggle like:', error)
      }
    }
  }

  return (
    <div
      className={`w-full p-[20px] rounded-[20px] flex flex-col gap-[30px] mb-[16px] relative ${
        isCurrentUserReview 
          ? 'bg-[var(--color-background-15)] border-2 border-[var(--color-background-21)]' 
          : 'bg-[var(--color-background-15)]'
      }`}
      style={{ breakInside: 'avoid' }}
    >
      {/* Your Review Badge */}
      {isCurrentUserReview && (
        <div className="absolute top-2 right-2 bg-[var(--color-background-21)] text-[var(--color-night-background)] px-2 py-1 rounded-full text-xs font-medium z-10">
          {t('review.yourReview')}
        </div>
      )}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-[16px]">
          <img
            src={review.userAvatar}
            alt="user avatar"
            className="object-cover size-[56px] rounded-full"
            loading="lazy"
          />
          <div className="flex flex-col gap-[8px]">
            <p className="text-[20px] font-bold">{review.username}</p>
            <div className="flex items-center gap-[8px]">
              {Array.from({ length: 5 }).map((_, index) => {
                return index < review.rating ? (
                  <FaStar
                    key={index}
                    size={24}
                    className="text-[var(--color-background-10)]"
                  />
                ) : (
                  <FaRegStar
                    key={index}
                    size={24}
                    className="text-[var(--color-background-10)]"
                  />
                )
              })}
            </div>
          </div>
        </div>
        {/* <button className="text-[var(--color-background)]">
          <BsThreeDots size={24} className="cursor-pointer" />
        </button> */}
      </div>
      <p className="text-[20px] font-normal">{review.content}</p>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-[16px]">
          <button 
            onClick={handleLikeToggle}
            disabled={likeMutation.isPending || unlikeMutation.isPending}
            className={`flex items-center gap-[8px] py-[4px] px-[8px] cursor-pointer text-[var(--color-background-25)] bg-[var(--color-background-17)] rounded-[8px] transition-colors ${
              isLiked ? 'text-[var(--color-background-10)]' : ''
            }`}
          >
            {isLiked ? (
              <FavoriteFilledIcon className="text-[var(--color-background-10)]" />
            ) : (
              <FavoriteIcon className="text-[var(--color-background-10)]" />
            )}
            <p>{likeCount}</p>
          </button>
          {/* <div className="flex items-center gap-[8px] py-[4px] px-[8px] cursor-pointer text-[var(--color-background-25)] bg-[var(--color-background-17)] rounded-[8px]">
            <CommentsIcon />
            <p>2.5k</p>
          </div> */}
        </div>
                <p className="text-[16px] font-normal text-[var(--color-background-25)]">
                  {formatReviewDate(review.createdAt, i18n.language)}
                </p>
      </div>
    </div>
  )
})
