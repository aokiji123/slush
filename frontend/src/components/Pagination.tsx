import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'

type PaginationProps = {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  className?: string
}

export const Pagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange, 
  className = '' 
}: PaginationProps) => {
  if (totalPages <= 1) return null

  const getVisiblePages = () => {
    const delta = 2
    const range = []
    const rangeWithDots = []

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i)
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...')
    } else {
      rangeWithDots.push(1)
    }

    rangeWithDots.push(...range)

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages)
    } else {
      rangeWithDots.push(totalPages)
    }

    return rangeWithDots
  }

  const visiblePages = getVisiblePages()

  return (
    <div className={`flex items-center justify-center gap-[8px] ${className}`}>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center justify-center w-[40px] h-[40px] rounded-[8px] bg-[var(--color-background-14)] text-[var(--color-background)] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[var(--color-background-16)] transition-colors"
        aria-label="Previous page"
      >
        <FaChevronLeft size={16} />
      </button>

      {visiblePages.map((page, index) => (
        <button
          key={index}
          onClick={() => typeof page === 'number' && onPageChange(page)}
          disabled={page === '...'}
          className={`flex items-center justify-center w-[40px] h-[40px] rounded-[8px] text-[16px] font-medium transition-colors ${
            page === currentPage
              ? 'bg-[var(--color-background-21)] text-white'
              : page === '...'
              ? 'cursor-default text-[var(--color-background-25)]'
              : 'bg-[var(--color-background-14)] text-[var(--color-background)] hover:bg-[var(--color-background-16)]'
          }`}
          aria-label={page === '...' ? 'More pages' : `Go to page ${page}`}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex items-center justify-center w-[40px] h-[40px] rounded-[8px] bg-[var(--color-background-14)] text-[var(--color-background)] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[var(--color-background-16)] transition-colors"
        aria-label="Next page"
      >
        <FaChevronRight size={16} />
      </button>
    </div>
  )
}
