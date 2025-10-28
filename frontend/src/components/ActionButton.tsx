import { forwardRef } from 'react'
import { formatCount } from '@/utils/formatters'

type ActionButtonVariant = 'like' | 'comment' | 'share' | 'buy' | 'view'

interface ActionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode
  count?: number
  label?: string
  variant?: ActionButtonVariant
  isActive?: boolean
  className?: string
}

const variantStyles: Record<ActionButtonVariant, string> = {
  like: 'text-[#ccf8ffa6] bg-[#37c3ff1f] hover:bg-[#37c3ff40]',
  comment: 'text-[#ccf8ffa6] bg-[#37c3ff1f] hover:bg-[#37c3ff40]',
  share: 'text-[#ccf8ffa6] bg-[#37c3ff1f] hover:bg-[#37c3ff40]',
  buy: 'text-[#ccf8ffa6] bg-[#37c3ff1f] hover:bg-[#37c3ff40]',
  view: 'text-[#ccf8ffa6] bg-[#37c3ff1f] hover:bg-[#37c3ff40]',
}

const activeStyles: Record<ActionButtonVariant, string> = {
  like: 'text-[var(--color-background-10)]',
  comment: 'text-[var(--color-background-10)]',
  share: 'text-[var(--color-background-10)]',
  buy: 'text-[var(--color-background-10)]',
  view: 'text-[var(--color-background-10)]',
}

export const ActionButton = forwardRef<HTMLButtonElement, ActionButtonProps>(
  (
    {
      icon,
      count,
      label,
      variant = 'like',
      isActive = false,
      className = '',
      ...props
    },
    ref,
  ) => {
    const baseStyles =
      'flex items-center gap-[8px] py-[4px] px-[8px] cursor-pointer rounded-[8px] transition-colors'
    const variantStyle = variantStyles[variant]
    const activeStyle = isActive ? activeStyles[variant] : ''

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variantStyle} ${activeStyle} ${className}`}
        {...props}
      >
        {icon}
        {count !== undefined && (
          <p className="text-[14px] md:text-[16px]">{formatCount(count)}</p>
        )}
        {label && <p className="text-[14px] md:text-[16px]">{label}</p>}
      </button>
    )
  },
)

ActionButton.displayName = 'ActionButton'
