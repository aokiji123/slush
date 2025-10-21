import { useState } from 'react'
import { FaStar, FaRegStar, FaTimes } from 'react-icons/fa'
import { useTranslation } from 'react-i18next'
import { useCreateGameReview } from '@/api/queries/useGame'
import type { CreateReviewRequest } from '@/api/types/game'

type ReviewModalProps = {
  isOpen: boolean
  onClose: () => void
  gameId: string
  onReviewCreated?: () => void
}

export const ReviewModal = ({ isOpen, onClose, gameId, onReviewCreated }: ReviewModalProps) => {
  const { t } = useTranslation(['game', 'common'])
  const [content, setContent] = useState('')
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [errors, setErrors] = useState<{ content?: string; rating?: string }>({})

  const createReviewMutation = useCreateGameReview()

  const validateForm = () => {
    const newErrors: { content?: string; rating?: string } = {}
    
    if (!content.trim()) {
      newErrors.content = t('game.review.contentRequired')
    } else if (content.trim().length < 10) {
      newErrors.content = t('game.review.contentTooShort')
    }
    
    if (rating === 0) {
      newErrors.rating = t('game.review.ratingRequired')
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    try {
      const reviewData: CreateReviewRequest = {
        gameId,
        content: content.trim(),
        rating
      }

      await createReviewMutation.mutateAsync(reviewData)
      
      // Reset form
      setContent('')
      setRating(0)
      setHoveredRating(0)
      setErrors({})
      
      onReviewCreated?.()
      onClose()
    } catch (error) {
      console.error('Failed to create review:', error)
    }
  }

  const handleClose = () => {
    setContent('')
    setRating(0)
    setHoveredRating(0)
    setErrors({})
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-[var(--color-background-15)] rounded-[20px] p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[24px] font-bold text-[var(--color-background)]">
            {t('game.review.writeReview')}
          </h2>
          <button
            onClick={handleClose}
            className="text-[var(--color-background-25)] hover:text-[var(--color-background)] transition-colors"
          >
            <FaTimes size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Rating */}
          <div>
            <label className="block text-[16px] font-medium text-[var(--color-background)] mb-2">
              {t('game.review.rating')}
            </label>
            <div className="flex items-center gap-2">
              {Array.from({ length: 5 }).map((_, index) => {
                const starValue = index + 1
                const isFilled = starValue <= (hoveredRating || rating)
                
                return (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setRating(starValue)}
                    onMouseEnter={() => setHoveredRating(starValue)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="text-[var(--color-background-10)] hover:scale-110 transition-transform"
                  >
                    {isFilled ? (
                      <FaStar size={32} />
                    ) : (
                      <FaRegStar size={32} />
                    )}
                  </button>
                )
              })}
            </div>
            {errors.rating && (
              <p className="text-red-500 text-[14px] mt-1">{errors.rating}</p>
            )}
          </div>

          {/* Content */}
          <div>
            <label className="block text-[16px] font-medium text-[var(--color-background)] mb-2">
              {t('game.review.content')}
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={t('game.review.contentPlaceholder')}
              className="w-full h-32 p-3 rounded-[12px] bg-[var(--color-background-17)] text-[var(--color-background)] placeholder-[var(--color-background-25)] border border-[var(--color-background-25)] focus:border-[var(--color-background-10)] focus:outline-none resize-none"
              maxLength={2000}
            />
            <div className="flex justify-between items-center mt-1">
              {errors.content && (
                <p className="text-red-500 text-[14px]">{errors.content}</p>
              )}
              <p className="text-[var(--color-background-25)] text-[14px] ml-auto">
                {content.length}/2000
              </p>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 py-3 px-4 rounded-[12px] bg-[var(--color-background-17)] text-[var(--color-background)] hover:bg-[var(--color-background-25)] transition-colors"
            >
              {t('common.cancel')}
            </button>
            <button
              type="submit"
              disabled={createReviewMutation.isPending}
              className="flex-1 py-3 px-4 rounded-[12px] bg-[var(--color-background-10)] text-[var(--color-background)] hover:bg-[var(--color-background-10)]/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {createReviewMutation.isPending ? t('common.submitting') : t('common.submit')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
