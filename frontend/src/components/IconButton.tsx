import { forwardRef } from 'react'

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode
  label: string
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  tooltip?: string
}

const variantStyles = {
  primary: 'bg-[var(--color-background-21)] text-[var(--color-night-background)] hover:bg-[var(--color-background-23)]',
  secondary: 'bg-[var(--color-background-15)] text-[var(--color-background)] hover:bg-[var(--color-background-16)]',
  ghost: 'bg-transparent text-[var(--color-background)] hover:bg-[var(--color-background-17)]',
}

const sizeStyles = {
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-12 h-12',
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ 
    icon, 
    label, 
    variant = 'secondary', 
    size = 'md', 
    tooltip, 
    className = '', 
    ...props 
  }, ref) => {
    return (
      <button
        ref={ref}
        className={`
          ${variantStyles[variant]} 
          ${sizeStyles[size]} 
          flex items-center justify-center 
          rounded-[20px] 
          transition-colors duration-200 
          focus:outline-none focus:ring-2 focus:ring-[var(--color-background-21)] focus:ring-offset-2 
          disabled:opacity-50 disabled:cursor-not-allowed
          ${className}
        `}
        aria-label={label}
        title={tooltip || label}
        {...props}
      >
        {icon}
      </button>
    )
  }
)

IconButton.displayName = 'IconButton'
