import { useState } from 'react'
import { useLikePost, useUnlikePost } from '@/api/queries/useCommunity'
import { useAuthState } from '@/api/queries/useAuth'

interface UseLikeToggleProps {
  itemId: string
  initialLikesCount?: number
}

interface UseLikeToggleReturn {
  isLiked: boolean
  likesCount: number
  handleLike: (e: React.MouseEvent) => Promise<void>
}

/**
 * Custom hook for handling like/unlike functionality with optimistic updates
 * 
 * @example
 * ```tsx
 * const { isLiked, likesCount, handleLike } = useLikeToggle({
 *   itemId: post.id,
 *   initialLikesCount: post.likesCount
 * })
 * ```
 */
export const useLikeToggle = ({ 
  itemId, 
  initialLikesCount = 0 
}: UseLikeToggleProps): UseLikeToggleReturn => {
  const { user } = useAuthState()
  const [isLiked, setIsLiked] = useState(false)
  const [likesCount, setLikesCount] = useState(initialLikesCount)

  const likePostMutation = useLikePost()
  const unlikePostMutation = useUnlikePost()

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
        await unlikePostMutation.mutateAsync(itemId)
      } else {
        await likePostMutation.mutateAsync(itemId)
      }
    } catch (error) {
      // Revert optimistic update on error
      setIsLiked(wasLiked)
      setLikesCount(previousLikesCount)
      console.error('Failed to toggle like:', error)
    }
  }

  return {
    isLiked,
    likesCount,
    handleLike,
  }
}

