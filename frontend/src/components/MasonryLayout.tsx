import type { ReactNode } from 'react'

type MasonryLayoutProps = {
  children: ReactNode
  columns?: number
  gap?: string
  className?: string
}

export const MasonryLayout = ({
  children,
  columns = 2,
  gap = '16px',
  className = '',
}: MasonryLayoutProps) => {
  return (
    <div
      className={`w-full ${className}`}
      style={{
        columnCount: columns,
        columnGap: gap,
        columnFill: 'balance',
      }}
    >
      {children}
    </div>
  )
}
