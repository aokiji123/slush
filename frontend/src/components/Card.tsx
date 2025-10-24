import { forwardRef } from 'react'

type CardVariant = 'default' | 'surface' | 'elevated' | 'interactive'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Card content */
  children: React.ReactNode
  /** Visual variant of the card */
  variant?: CardVariant
  /** Whether the card should have hover effects */
  hover?: boolean
  /** Additional CSS classes */
  className?: string
}

const variantStyles: Record<CardVariant, string> = {
  default: 'bg-[var(--color-background-15)]',
  surface: 'bg-[var(--color-background-8)]',
  elevated: 'bg-[var(--color-background-15)] shadow-lg',
  interactive: 'bg-[#002f3d] hover:bg-[#003a4a] cursor-pointer transition-colors',
}

/**
 * A reusable card component with consistent styling and variants.
 * Used across galleries, posts, and other content containers.
 * 
 * @example
 * ```tsx
 * <Card variant="interactive" hover onClick={handleClick}>
 *   <h3>Card Title</h3>
 *   <p>Card content</p>
 * </Card>
 * ```
 */
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
