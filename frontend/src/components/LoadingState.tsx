interface LoadingStateProps {
  message?: string
  className?: string
  showSpinner?: boolean
}

export const LoadingState = ({
  message = 'Loading...',
  className = '',
  showSpinner = true,
}: LoadingStateProps) => {
  return (
    <div className={`flex items-center justify-center py-[64px] gap-[16px] ${className}`}>
      {showSpinner && (
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-background-21)]"></div>
      )}
      <div className="text-[var(--color-background)] text-[18px]">
        {message}
      </div>
    </div>
  )
}
