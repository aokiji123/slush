import { memo } from 'react'

interface MessageSkeletonProps {
  count?: number
}

export const MessageSkeleton = memo<MessageSkeletonProps>(({ count = 5 }) => {
  return (
    <div className="space-y-[12px]">
      {Array.from({ length: count }).map((_, index) => {
        // Alternate between left and right alignments
        const isOwn = index % 3 === 2
        const width = isOwn ? 'w-[40%]' : 'w-[35%]'
        
        return (
          <div 
            key={index} 
            className={`flex ${isOwn ? 'justify-end' : 'justify-start'} gap-[14px] items-end`}
          >
            {!isOwn && (
              <div className="w-[12px] h-[12px] bg-[rgba(204,248,255,0.15)] rounded animate-pulse" />
            )}
            
            <div className={`${width} px-[20px] py-[20px] bg-[rgba(204,248,255,0.1)] rounded-[20px] animate-pulse`}>
              <div className="space-y-2">
                <div className="h-4 bg-[rgba(204,248,255,0.15)] rounded animate-pulse" />
                <div className="h-4 bg-[rgba(204,248,255,0.15)] rounded animate-pulse w-3/4" />
              </div>
            </div>
            
            {isOwn && (
              <div className="w-[12px] h-[12px] bg-[rgba(204,248,255,0.15)] rounded animate-pulse" />
            )}
          </div>
        )
      })}
    </div>
  )
})

MessageSkeleton.displayName = 'MessageSkeleton'

