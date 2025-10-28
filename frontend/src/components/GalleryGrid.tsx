import type { ReactNode } from 'react'

interface GalleryGridProps<T> {
  items: T[]
  renderItem: (item: T, index: number) => ReactNode
  columns?: 1 | 2 | 3 | 4
  gap?: 'sm' | 'md' | 'lg'
  emptyState?: ReactNode
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
