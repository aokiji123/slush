import { Component, type ReactNode } from 'react'

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

interface ErrorBoundaryProps {
  /** Child components to wrap */
  children: ReactNode
  /** Custom fallback UI to display when an error occurs */
  fallback?: ReactNode
}

/**
 * Error boundary component that catches JavaScript errors anywhere in the child component tree,
 * logs those errors, and displays a fallback UI instead of the component tree that crashed.
 * 
 * @example
 * ```tsx
 * <ErrorBoundary>
 *   <App />
 * </ErrorBoundary>
 * 
 * <ErrorBoundary fallback={<CustomErrorPage />}>
 *   <RiskyComponent />
 * </ErrorBoundary>
 * ```
 */

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: any) {
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error, errorInfo)
    }
    
    // In production, you might want to send this to an error reporting service
    // Example: errorReportingService.captureException(error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--color-night-background)]">
          <div className="text-center p-8">
            <h2 className="text-2xl font-bold text-[var(--color-background)] mb-4">
              Oops! Something went wrong
            </h2>
            <p className="text-[var(--color-background-25)] mb-6">
              We're sorry, but something unexpected happened. Please try refreshing the page.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-[var(--color-background-21)] text-[var(--color-night-background)] px-6 py-3 rounded-[20px] font-medium hover:bg-[var(--color-background-23)] transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
