import type { ReactNode } from 'react'

interface GallerySectionProps {
  title: string
  count?: number
  children: ReactNode
  className?: string
}

export const GallerySection = ({ title, count, children, className = '' }: GallerySectionProps) => {
  return (
    <div className={`bg-[var(--color-background-8)] rounded-[20px] p-[20px] ${className}`}>
      <div className="flex items-center justify-between mb-[20px]">
        <h2 className="text-[20px] font-bold text-[var(--color-background)] font-manrope">
          {title}
        </h2>
        {count !== undefined && (
          <div className="bg-[var(--color-background-18)] rounded-[20px] px-[12px] py-[4px]">
            <span className="text-[14px] font-bold text-[var(--color-background-25)] opacity-65">
              {count}
            </span>
          </div>
        )}
      </div>
      {children}
    </div>
  )
}
