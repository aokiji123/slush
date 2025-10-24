import type { ReactNode } from 'react'

interface GalleryGridProps<T> {
  /** Array of items to render */
  items: T[]
  /** Function to render each item */
  renderItem: (item: T, index: number) => ReactNode
  /** Number of columns in the grid */
  columns?: 1 | 2 | 3 | 4
  /** Gap between grid items */
  gap?: 'sm' | 'md' | 'lg'
  /** Empty state to show when no items */
  emptyState?: ReactNode
  /** Additional CSS classes */
  className?: string
}

const columnClasses = {
  1: 'grid-cols-1',
  2: 'grid-cols-2',
  3: 'grid-cols-3',
  4: 'grid-cols-4',
}

const gapClasses = {
  sm: 'gap-2',
  md: 'gap-4',
  lg: 'gap-6',
}

/**
 * A reusable grid layout component for galleries.
 * Provides consistent grid layouts with customizable columns and gaps.
 * 
 * @example
 * ```tsx
 * <GalleryGrid
 *   items={posts}
 *   renderItem={(post) => <PostCard key={post.id} post={post} />}
 *   columns={3}
 *   gap="md"
 * />
 * ```
 */
export const GalleryGrid = <T,>({ 
  items, 
  renderItem, 
  columns = 3, 
  gap = 'md', 
  emptyState,
  className = '' 
}: GalleryGridProps<T>) => {
  const columnClass = columnClasses[columns]
  const gapClass = gapClasses[gap]
  
  if (items.length === 0 && emptyState) {
    return <>{emptyState}</>
  }
  
  return (
    <div className={`grid ${columnClass} ${gapClass} ${className}`}>
      {items.map((item, index) => renderItem(item, index))}
    </div>
  )
}
