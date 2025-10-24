interface EmptyStateProps {
  title?: string
  message?: string
  actionText?: string
  onAction?: () => void
  className?: string
  icon?: React.ReactNode
}

export const EmptyState = ({
  title = 'No items found',
  message = 'There are no items to display at the moment.',
  actionText,
  onAction,
  className = '',
  icon,
}: EmptyStateProps) => {
  return (
    <div className={`flex flex-col items-center justify-center py-[64px] gap-[16px] ${className}`}>
      {icon && (
        <div className="text-[var(--color-background-25)] text-6xl mb-4">
          {icon}
        </div>
      )}
      <div className="text-center">
        <h3 className="text-[var(--color-background)] text-[18px] font-bold mb-2">
          {title}
        </h3>
        <p className="text-[var(--color-background-25)] text-[14px]">
          {message}
        </p>
      </div>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="px-[24px] py-[12px] bg-[var(--color-background-21)] text-[var(--color-night-background)] rounded-[8px] font-medium hover:bg-[var(--color-background-23)] transition-colors"
        >
          {actionText}
        </button>
      )}
    </div>
  )
}
