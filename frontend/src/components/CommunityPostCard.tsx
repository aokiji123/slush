import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useLikePost, useUnlikePost } from '@/api/queries/useCommunity'
import { useAuthState } from '@/api/queries/useAuth'
import { FavoriteIcon, FavoriteFilledIcon } from '@/icons'
import type { PostDto } from '@/types/community'
import { PostType } from '@/types/community'
import { ActionButton } from './ActionButton'
import { Card } from './Card'
import { CardHeader } from './CardHeader'
import { CardActions } from './CardActions'

interface CommunityPostCardProps {
  post: PostDto
  onNavigate?: () => void
  slug?: string | undefined
  showShareButton?: boolean
}


export const CommunityPostCard = ({ post, onNavigate, slug, showShareButton = true }: CommunityPostCardProps) => {
  const navigate = useNavigate()
  const { user } = useAuthState()
  
  // Use post's gameId if available, otherwise fallback to provided slug
  const currentSlug = post.gameId || slug || 'default'
  const [isLiked, setIsLiked] = useState(false)
  const [likesCount, setLikesCount] = useState(post.likesCount || 0)

  const likePostMutation = useLikePost()
  const unlikePostMutation = useUnlikePost()

  const handlePostClick = () => {
    if (onNavigate) {
      onNavigate()
    }
    navigate({
      to: '/$slug/community/post/$id',
      params: { slug: currentSlug, id: post.id },
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
        await unlikePostMutation.mutateAsync(post.id)
      } else {
        await likePostMutation.mutateAsync(post.id)
      }
    } catch (error) {
      // Revert optimistic update on error
      setIsLiked(wasLiked)
      setLikesCount(previousLikesCount)
      console.error('Failed to toggle like:', error)
    }
  }


  const renderMedia = () => {
    const coverMedia = post.media.find(media => media.isCover) || (post.media.length > 0 ? post.media[0] : undefined)
    
    if (!coverMedia) return null

    if (coverMedia.type === 1) { // Video
      return (
        <div className="relative h-[480px] rounded-[16px] overflow-hidden">
          <video
            src={coverMedia.file}
            controls
            className="w-full h-full object-cover"
            preload="metadata"
          >
            Your browser does not support the video tag.
          </video>
        </div>
      )
    }

    return (
      <img
        src={coverMedia.file}
        alt="Post media"
        className="w-full h-[480px] object-cover rounded-[16px]"
      />
    )
  }

  const renderContent = () => {
    switch (post.type) {
      case PostType.News:
        return (
          <div className="space-y-4">
            {renderMedia()}
            <div className="space-y-3">
              <h3 className="text-[20px] font-bold text-[#f1fdff] font-manrope">
                {post.title}
              </h3>
              <p className="text-[16px] text-[#f1fdff] leading-[1.5]">
                {post.content}
              </p>
            </div>
          </div>
        )

      case PostType.Screenshot:
        return (
          <div className="space-y-4">
            {renderMedia()}
            {post.title && (
              <p className="text-[16px] text-[#f1fdff] leading-[1.5]">
                {post.title}
              </p>
            )}
          </div>
        )

      case PostType.Video:
        return (
          <div className="space-y-4">
            {renderMedia()}
            {post.title && (
              <p className="text-[16px] text-[#f1fdff] leading-[1.5]">
                {post.title}
              </p>
            )}
          </div>
        )

      case PostType.Guide:
        return (
          <div className="flex gap-5">
            {post.media.length > 0 && (
              <div className="flex-shrink-0">
                <img
                  src={post.media[0]?.file || '/game-image.png'}
                  alt="Guide thumbnail"
                  className="w-[200px] h-full object-cover rounded-[20px]"
                />
              </div>
            )}
            <div className="flex-1 space-y-2">
              <h3 className="text-[20px] font-bold text-[#f1fdff] font-manrope">
                {post.title}
              </h3>
              <p className="text-[16px] text-[#f1fdff] leading-[1.5] line-clamp-3">
                {post.content}
              </p>
            </div>
          </div>
        )

      case PostType.Discussion:
      default:
        return (
          <div className="space-y-3">
            {post.title && (
              <h3 className="text-[20px] font-bold text-[#f1fdff] font-manrope">
                {post.title}
              </h3>
            )}
            <p className="text-[16px] text-[#f1fdff] leading-[1.5]">
              {post.content}
            </p>
            {post.media.length > 0 && (
              <div className="mt-4">
                <img
                  src={post.media[0]?.file || '/game-image.png'}
                  alt="Discussion media"
                  className="w-full h-[480px] object-cover rounded-[16px]"
                />
              </div>
            )}
          </div>
        )
    }
  }

  return (
    <Card 
      variant="interactive" 
      onClick={handlePostClick}
      className="p-6 space-y-6"
    >
        {/* Header */}
        <div className="flex items-center justify-between">
          <CardHeader
            avatar={post.authorAvatar}
            username={post.authorUsername || 'Unknown User'}
            date={post.createdAt}
          />
          
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-[rgba(55,195,255,0.12)] rounded-full transition-colors">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 14C13.1046 14 14 13.1046 14 12C14 10.8954 13.1046 10 12 10C10.8954 10 10 10.8954 10 12C10 13.1046 10.8954 14 12 14Z"
                  fill="#F1FDFF"
                />
                <path
                  d="M19 14C20.1046 14 21 13.1046 21 12C21 10.8954 20.1046 10 19 10C17.8954 10 17 10.8954 17 12C17 13.1046 17.8954 14 19 14Z"
                  fill="#F1FDFF"
                />
                <path
                  d="M5 14C6.10457 14 7 13.1046 7 12C7 10.8954 6.10457 10 5 10C3.89543 10 3 10.8954 3 12C3 13.1046 3.89543 14 5 14Z"
                  fill="#F1FDFF"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        {renderContent()}

        {/* Actions */}
        <CardActions>
          <ActionButton
            icon={
              isLiked ? (
                <FavoriteFilledIcon className="text-[var(--color-background-10)]" />
              ) : (
                <FavoriteIcon className="text-[var(--color-background-10)]" />
              )
            }
            count={likesCount}
            variant="like"
            isActive={isLiked}
            onClick={handleLike}
          />

          <ActionButton
            icon={
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 20C4.90566 20 4.71698 20 4.62264 19.9057C4.24528 19.717 4.0566 19.434 4.0566 19.0566V15.283H2.83019C1.22642 15.283 0 14.0566 0 12.4528V2.83019C0 1.22642 1.22642 0 2.83019 0H17.1698C18.7736 0 20 1.22642 20 2.83019V12.4528C20 14.0566 18.7736 15.283 17.1698 15.283H10.0943L5.66038 19.717C5.4717 19.9057 5.18868 20 5 20ZM2.83019 1.88679C2.26415 1.88679 1.88679 2.26415 1.88679 2.83019V12.4528C1.88679 13.0189 2.26415 13.3962 2.83019 13.3962H5C5.56604 13.3962 5.9434 13.7736 5.9434 14.3396V16.7925L9.0566 13.6792C9.24528 13.4906 9.43396 13.3962 9.71698 13.3962H17.1698C17.7358 13.3962 18.1132 13.0189 18.1132 12.4528V2.83019C18.1132 2.26415 17.7358 1.88679 17.1698 1.88679H2.83019Z" fill="#F1FDFF"/>
              </svg>
            }
            count={post.commentsCount || 0}
            variant="comment"
          />

          {showShareButton && (
            <ActionButton
              icon={
                <svg width="19" height="20" viewBox="0 0 19 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15.7 20H3.1C2.3 20 1.5 19.7 0.9 19.1C0.3 18.5 0 17.7 0 16.9V13.2C0 12.6 0.4 12.2 1 12.2C1.6 12.2 2 12.6 2 13.2V16.9C2 17.2 2.1 17.5 2.3 17.7C2.5 17.9 2.8 18 3.1 18H15.7C16 18 16.3 17.9 16.5 17.7C16.7 17.5 16.8 17.2 16.8 16.9V13.2C16.8 12.6 17.2 12.2 17.8 12.2C18.4 12.2 18.8 12.6 18.8 13.2V16.9C18.8 17.7 18.5 18.5 17.9 19.1C17.3 19.7 16.5 20 15.7 20ZM9.4 14C8.8 14 8.4 13.6 8.4 13V3.3L5.2 6.3C4.8 6.7 4.2 6.7 3.8 6.3C3.4 5.9 3.4 5.3 3.8 4.9L8.6 0.3C8.9 0 9.2 0 9.4 0C9.5 0 9.6 0 9.8 0.1C9.9 0.1 10 0.2 10.1 0.3L14.9 4.9C15.3 5.3 15.3 5.9 14.9 6.3C14.5 6.7 13.9 6.7 13.5 6.3L10.4 3.3V13C10.4 13.5 10 14 9.4 14Z" fill="#F1FDFF"/>
                </svg>
              }
              label="Поділитись"
              variant="share"
            />
          )}
        </CardActions>
    </Card>
  )
}
