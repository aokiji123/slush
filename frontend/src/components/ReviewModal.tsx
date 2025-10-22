import { useState, useEffect } from 'react'
import { FaStar, FaRegStar, FaTimes } from 'react-icons/fa'
import { useTranslation } from 'react-i18next'
import { useCreateGameReview, useUpdateGameReview } from '@/api/queries/useGame'
import { useAuthenticatedUser } from '@/api/queries/useUser'
import type { CreateReviewRequest, Review, UpdateReviewRequest } from '@/api/types/game'

type ReviewModalProps = {
  isOpen: boolean
  onClose: () => void
  gameId: string
  onReviewCreated?: () => void
  existingReview?: Review
}

export const ReviewModal = ({ isOpen, onClose, gameId, onReviewCreated, existingReview }: ReviewModalProps) => {
  const { t } = useTranslation(['game', 'common'])
  const [content, setContent] = useState(existingReview?.content || '')
  const [rating, setRating] = useState(existingReview?.rating || 0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [errors, setErrors] = useState<{ content?: string; rating?: string }>({})
  const [showSuccess, setShowSuccess] = useState(false)

  const createReviewMutation = useCreateGameReview()
  const updateReviewMutation = useUpdateGameReview()
  const { data: user } = useAuthenticatedUser()
  
  const isEditMode = !!existingReview

  // Sync state with existingReview prop changes
  useEffect(() => {
    if (existingReview) {
      setContent(existingReview.content || '')
      setRating(existingReview.rating || 0)
    } else {
      setContent('')
      setRating(0)
    }
  }, [existingReview])

  const validateForm = () => {
    const newErrors: { content?: string; rating?: string } = {}
    
    if (!content.trim()) {
      newErrors.content = t('review.contentRequired')
    } else if (content.trim().length < 10) {
      newErrors.content = t('review.contentTooShort')
    }
    
    if (rating === 0) {
      newErrors.rating = t('review.ratingRequired')
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    // Validate GUID format
    const guidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    if (!guidRegex.test(gameId)) {
      console.error('Invalid GUID format:', gameId)
      setErrors({ rating: 'Invalid game ID format' })
      return
    }

    try {
      if (isEditMode && existingReview) {
        const updateData: UpdateReviewRequest = {
          Content: content.trim(),
          Rating: rating
        }

        console.log('Updating review data:', updateData)
        await updateReviewMutation.mutateAsync({ 
          reviewId: existingReview.id, 
          review: updateData 
        })
      } else {
        const reviewData: CreateReviewRequest = {
          GameId: gameId,
          Content: content.trim(),
          Rating: rating
        }

        console.log('Creating review data:', reviewData)
        console.log('Game ID type:', typeof gameId, 'Value:', gameId)
        await createReviewMutation.mutateAsync(reviewData)
      }
      
      // Show success notification
      setShowSuccess(true)
      
      // Only reset form for new reviews, not when editing
      if (!isEditMode) {
        setContent('')
        setRating(0)
        setHoveredRating(0)
        setErrors({})
      }
      
      // Close modal after a brief delay to show success
      setTimeout(() => {
        onReviewCreated?.()
        onClose()
        setShowSuccess(false)
      }, 1500)
    } catch (error: any) {
      console.error('Failed to create review:', error)
      console.error('Error response:', error.response?.data)
      console.error('Error status:', error.response?.status)
    }
  }

  const handleClose = () => {
    setContent(existingReview?.content || '')
    setRating(existingReview?.rating || 0)
    setHoveredRating(0)
    setErrors({})
    setShowSuccess(false)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-[var(--color-background-15)] rounded-[20px] p-[20px] w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[24px] font-bold text-[var(--color-background)]">
            {isEditMode ? t('review.editReview') : t('review.writeReview')}
          </h2>
          <button
            onClick={handleClose}
            className="text-[var(--color-background-25)] hover:text-[var(--color-background)] transition-colors"
          >
            <FaTimes size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Review Card Preview */}
          <div className="w-full p-[20px] rounded-[20px] flex flex-col gap-[30px] bg-[var(--color-background-15)] border-2 border-[var(--color-background-17)] mb-6">
            {/* User Info and Rating */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-[16px]">
                <img
                  src={user?.avatar || '/avatar.png'}
                  alt="user avatar"
                  className="object-cover size-[56px] rounded-full"
                  loading="lazy"
                />
                <div className="flex flex-col gap-[8px]">
                  <p className="text-[20px] font-bold text-white">{user?.nickname || 'User'}</p>
                  <div className="flex items-center gap-[8px]">
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
                            <FaStar size={24} />
                          ) : (
                            <FaRegStar size={24} />
                          )}
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={t('review.contentPlaceholder')}
                className="w-full min-h-[100px] p-0 bg-transparent text-[20px] font-normal text-[var(--color-background)] placeholder-[var(--color-background-25)] border-none outline-none resize-none"
                maxLength={2000}
                style={{ fontFamily: 'inherit' }}
              />
              {errors.content && (
                <p className="text-red-500 text-[14px] mt-2">{errors.content}</p>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-[16px]">
                <p className="text-[16px] font-normal text-[var(--color-background-25)]">
                  {content.length}/2000
                </p>
              </div>
              <p className="text-[16px] font-normal text-[var(--color-background-25)]">
                {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Error Messages */}
          {errors.rating && (
            <p className="text-red-500 text-[14px] mb-4">{errors.rating}</p>
          )}

          {/* Success Message */}
          {showSuccess && (
            <div className="mb-4 p-3 bg-green-500/20 border border-green-500/50 rounded-[12px]">
              <p className="text-green-400 text-[14px] text-center">
                {t('common.success')}! {isEditMode ? t('review.editReview') : t('review.writeReview')} {t('common.submitted')}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 py-3 px-4 rounded-[12px] bg-[var(--color-background-17)] text-[var(--color-background)] hover:bg-[var(--color-background-25)] transition-colors"
            >
              {t('common.cancel')}
            </button>
            <button
              type="submit"
              disabled={createReviewMutation.isPending || updateReviewMutation.isPending}
              className="flex-1 py-3 px-4 rounded-[12px] bg-[var(--color-background-10)] text-[var(--color-background)] hover:bg-[var(--color-background-10)]/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {(createReviewMutation.isPending || updateReviewMutation.isPending) 
                ? t('common.submitting') 
                : (isEditMode ? t('common.update') : t('common.submit'))
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
