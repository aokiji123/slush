interface ErrorStateProps {
  title?: string
  message?: string
  onRetry?: () => void
  retryText?: string
  className?: string
}

export const ErrorState = ({
  title = 'Something went wrong',
  message = 'An error occurred while loading the content. Please try again.',
  onRetry,
  retryText = 'Try Again',
  className = '',
}: ErrorStateProps) => {
  return (
    <div className={`flex flex-col items-center justify-center py-[64px] gap-[16px] ${className}`}>
      <div className="text-center">
        <h3 className="text-[var(--color-background)] text-[18px] font-bold mb-2">
          {title}
        </h3>
        <p className="text-[var(--color-background-25)] text-[14px]">
          {message}
        </p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-[24px] py-[12px] bg-[var(--color-background-21)] text-[var(--color-night-background)] rounded-[8px] font-medium hover:bg-[var(--color-background-23)] transition-colors"
        >
          {retryText}
        </button>
      )}
    </div>
  )
}
