import { forwardRef } from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'destructive' | 'ghost'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  isLoading?: boolean
  children: React.ReactNode
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-[var(--color-background-21)] text-[var(--color-night-background)] hover:bg-[var(--color-background-23)]',
  secondary: 'bg-[var(--color-background-15)] text-[var(--color-background)] hover:bg-[var(--color-background-16)]',
  destructive: 'bg-[#FF4444] text-white hover:bg-[#FF6666]',
  ghost: 'bg-transparent text-[var(--color-background)] hover:bg-[var(--color-background-17)]',
}

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm rounded-[12px]',
  md: 'px-6 py-2 text-base rounded-[16px]',
  lg: 'px-8 py-3 text-lg rounded-[20px]',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', isLoading = false, className = '', children, disabled, ...props }, ref) => {
    const baseStyles = 'font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-background-21)] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'
    
    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
            Loading...
          </div>
        ) : (
          children
        )}
      </button>
    )
  }
)

Button.displayName = 'Button'
