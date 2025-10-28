import { forwardRef } from 'react'

type CardVariant = 'default' | 'surface' | 'elevated' | 'interactive'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  variant?: CardVariant
  hover?: boolean
  className?: string
}

const variantStyles: Record<CardVariant, string> = {
  default: 'bg-[var(--color-background-15)]',
  surface: 'bg-[var(--color-background-8)]',
  elevated: 'bg-[var(--color-background-15)] shadow-lg',
  interactive: 'bg-[#002f3d] hover:bg-[#003a4a] cursor-pointer transition-colors',
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ children, variant = 'default', hover = false, className = '', ...props }, ref) => {
    const baseStyles = 'rounded-[20px] overflow-hidden'
    const variantStyle = variantStyles[variant]
    const hoverStyle = hover ? 'hover:shadow-lg transition-shadow duration-200' : ''
    
    return (
      <div
        ref={ref}
        className={`${baseStyles} ${variantStyle} ${hoverStyle} ${className}`}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Card.displayName = 'Card'
