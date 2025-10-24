import type { ReactNode } from 'react'

type JustifyContent = 'start' | 'center' | 'end' | 'between' | 'around'

interface CardActionsProps {
  /** Action buttons or other content */
  children: ReactNode
  /** Additional CSS classes */
  className?: string
  /** How to justify the content */
  justify?: JustifyContent
}

const justifyClasses: Record<JustifyContent, string> = {
  start: 'justify-start',
  center: 'justify-center',
  end: 'justify-end',
  between: 'justify-between',
  around: 'justify-around',
}

/**
 * A container component for action buttons in cards.
 * Provides consistent spacing and layout for action groups.
 * 
 * @example
 * ```tsx
 * <CardActions justify="between">
 *   <ActionButton icon={<LikeIcon />} count={123} variant="like" />
 *   <ActionButton icon={<CommentIcon />} count={45} variant="comment" />
 *   <ActionButton icon={<ShareIcon />} variant="share" />
 * </CardActions>
 * ```
 */
export const CardActions = ({ 
  children, 
  className = '', 
  justify = 'start' 
}: CardActionsProps) => {
  const justifyClass = justifyClasses[justify]
  
  return (
    <div className={`flex items-center gap-3 ${justifyClass} ${className}`}>
      {children}
    </div>
  )
}
