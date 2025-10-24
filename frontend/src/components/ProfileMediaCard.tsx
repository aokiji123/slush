import { useNavigate } from '@tanstack/react-router'
import { BsThreeDots } from 'react-icons/bs'
import { FaPlay } from 'react-icons/fa'
import type { PostDto } from '@/types/community'
import { PostType, MediaType } from '@/types/community'
import { OptimizedImage } from './OptimizedImage'

export interface ProfileMediaCardProps {
  post: PostDto
  onNavigate?: () => void
  className?: string
}

export const ProfileMediaCard = ({ 
  post, 
  onNavigate, 
  className = '' 
}: ProfileMediaCardProps) => {
  const navigate = useNavigate()

  const handlePostClick = () => {
    if (onNavigate) {
      onNavigate()
    }
    navigate({
      to: '/$slug/community/post/$id',
      params: { slug: post.gameId || 'default', id: post.id },
    })
  }

  const getCoverImage = () => {
    if (post.media.length > 0) {
      return post.media[0].file
    }
    return post.gameMainImage || '/game-image.png'
  }

  const isVideo = post.type === PostType.Video || 
    (post.media.length > 0 && post.media[0].type === MediaType.Video)

  return (
    <div
      className={`bg-[#002f3d] rounded-[12px] overflow-hidden hover:bg-[#003a4a] transition-all cursor-pointer group hover:scale-[1.02] ${className}`}
      onClick={handlePostClick}
    >
      {/* Media Thumbnail */}
      <div className="relative h-[212px]">
        <OptimizedImage
          src={getCoverImage()}
          alt={post.title}
          className="w-full h-full object-cover"
          placeholder="/game-image.png"
        />
        
        {/* Video Play Overlay */}
        {isVideo && (
          <div className="absolute inset-0 flex items-center justify-center bg-[rgba(0,20,31,0.4)] group-hover:bg-[rgba(0,20,31,0.5)] transition-all">
            <div className="bg-[#f1fdff] p-[6px] rounded-[39px] flex items-center justify-center">
              <FaPlay size={24} className="text-[#00141f] ml-[2px]" />
            </div>
          </div>
        )}

        {/* Menu Button */}
        <button
          onClick={(e) => e.stopPropagation()}
          className="absolute top-[12px] right-[12px] p-[8px] bg-black bg-opacity-50 hover:bg-opacity-70 rounded-[8px] transition-all opacity-0 group-hover:opacity-100"
        >
          <BsThreeDots size={16} className="text-white" />
        </button>
      </div>
    </div>
  )
}
