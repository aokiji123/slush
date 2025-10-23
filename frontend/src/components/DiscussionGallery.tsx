import { CommunityPostCard } from './CommunityPostCard'
import type { PostDto } from '@/types/community'
import { PostType } from '@/types/community'

interface DiscussionGalleryProps {
  posts: PostDto[]
  slug?: string
}

export const DiscussionGallery = ({ posts, slug }: DiscussionGalleryProps) => {
  // Filter for discussion posts only
  const discussionPosts = posts.filter(post => post.type === PostType.Discussion)
  
  // Separate screenshot discussions from regular discussions
  const screenshotDiscussions = discussionPosts.filter(post => 
    post.media && post.media.length > 0 && post.media.some(media => media.type === 0) // MediaType.Image
  )
  const regularDiscussions = discussionPosts.filter(post => 
    !post.media || post.media.length === 0 || !post.media.some(media => media.type === 0)
  )
  
  // Get first screenshot discussion and first regular discussion
  const firstScreenshotDiscussion = screenshotDiscussions[0]
  const firstRegularDiscussion = regularDiscussions[0]
  
  // Calculate remaining count (total - 1 screenshot - 1 regular)
  const remainingCount = Math.max(0, discussionPosts.length - (firstScreenshotDiscussion ? 1 : 0) - (firstRegularDiscussion ? 1 : 0))

  return (
    <div className="bg-[var(--color-background-8)] rounded-[20px] p-[20px] mb-[24px]">
      <div className="flex items-center justify-between mb-[20px]">
        <h2 className="text-[20px] font-bold text-[var(--color-background)] font-manrope">
          Галерея обговорень
        </h2>
        {discussionPosts.length > 0 && (
          <div className="bg-[var(--color-background-18)] rounded-[20px] px-[12px] py-[4px]">
            <span className="text-[14px] font-bold text-[var(--color-background-25)] opacity-65">
              {discussionPosts.length}
            </span>
          </div>
        )}
      </div>

      <div className="space-y-[24px]">
        {/* Display first screenshot discussion (full width) */}
        {firstScreenshotDiscussion && (
          <CommunityPostCard 
            key={firstScreenshotDiscussion.id} 
            post={firstScreenshotDiscussion} 
            slug={slug}
            showShareButton={false}
          />
        )}
        
        {/* Second row: regular discussion + "see more" indicator */}
        {firstRegularDiscussion && (
          <div className="flex gap-[24px]">
            {/* Regular discussion post (without screenshot) */}
            <div className="flex-1">
              <CommunityPostCard 
                key={firstRegularDiscussion.id} 
                post={firstRegularDiscussion} 
                slug={slug}
                showShareButton={false}
              />
            </div>
            
            {/* "See more" indicator */}
            {remainingCount > 0 && (
              <div className="w-[160px] flex-shrink-0">
                <div className="bg-[#002f3d] rounded-[20px] h-full flex items-center justify-center border border-[#046075] min-h-[216px]">
                  <div className="text-center">
                    <div className="text-[24px] font-bold text-[#f1fdff] mb-[8px]">
                      +{remainingCount}
                    </div>
                    <div className="text-[14px] text-[rgba(204,248,255,0.65)]">
                      більше обговорень
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* Show only "see more" if there's only screenshot discussions but more exist */}
        {firstScreenshotDiscussion && !firstRegularDiscussion && remainingCount > 0 && (
          <div className="flex justify-center">
            <div className="bg-[#002f3d] rounded-[20px] w-[160px] h-[216px] flex items-center justify-center border border-[#046075]">
              <div className="text-center">
                <div className="text-[24px] font-bold text-[#f1fdff] mb-[8px]">
                  +{remainingCount}
                </div>
                <div className="text-[14px] text-[rgba(204,248,255,0.65)]">
                  більше обговорень
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Show empty state if no posts */}
        {discussionPosts.length === 0 && (
          <div className="flex justify-center items-center h-32">
            <div className="text-[var(--color-background)] opacity-60">
              Немає обговорень
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
