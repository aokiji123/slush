import { useEffect, useRef, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { useSearchGames } from '@/api/queries/useGame'
import { IoClose } from 'react-icons/io5'
import type { PagedGamesResponse } from '@/api/types/game'

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
  searchText: string
}

export const SearchModal = ({
  isOpen,
  onClose,
  searchText,
}: SearchModalProps) => {
  const navigate = useNavigate()
  const { t } = useTranslation('common')
  const modalRef = useRef<HTMLDivElement>(null)
  const [selectedIndex, setSelectedIndex] = useState(-1)

  const {
    data: searchResults,
    isLoading,
    isError,
  } = useSearchGames(
    searchText,
    { limit: 10 }, // Show max 10 results in modal
    isOpen && searchText.length > 0,
  ) as {
    data: PagedGamesResponse | undefined
    isLoading: boolean
    isError: boolean
  }

  // Reset selected index when search text changes
  useEffect(() => {
    setSelectedIndex(-1)
  }, [searchText])

  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      return () => document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose])

  // Keyboard navigation for search results
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen || !searchResults?.data.items) return

      const itemsCount = searchResults.data.items.length

      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex((prev) => (prev < itemsCount - 1 ? prev + 1 : prev))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1))
      } else if (e.key === 'Enter' && selectedIndex >= 0) {
        e.preventDefault()
        handleGameClick(searchResults.data.items[selectedIndex].slug)
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, selectedIndex, searchResults])

  // Close modal on outside click - but exclude the search input
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      // Don't close if clicking on the search input or its container
      if (
        modalRef.current &&
        !modalRef.current.contains(target) &&
        !target.closest('input[type="text"]') &&
        !target.closest('.search-input-container')
      ) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const handleGameClick = (gameSlug: string) => {
    navigate({ to: `/${gameSlug}` })
    onClose()
  }

  const handleViewAllClick = () => {
    // Navigate to catalog with search query as title
    navigate({
      to: '/catalog',
      search: { title: searchText },
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-start justify-center pt-20 animate-in fade-in duration-200 pointer-events-none">
      <div
        ref={modalRef}
        className="relative bg-[var(--color-background-15)] rounded-[20px] w-full max-w-2xl mx-4 max-h-[600px] overflow-hidden shadow-2xl animate-in slide-in-from-top-4 duration-300 pointer-events-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[var(--color-background-17)]">
          <h3 className="text-white text-xl font-bold">
            {t('search.results')} "{searchText}"
          </h3>
          <button
            onClick={onClose}
            className="text-[var(--color-background-25)] hover:text-white hover:bg-[var(--color-background-17)] p-2 rounded-[12px] transition-all duration-200"
          >
            <IoClose size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="max-h-[500px] overflow-y-auto scrollbar-hide scroll-smooth">
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-background-23)]"></div>
              <p className="text-[var(--color-background-25)] text-lg mt-4">
                {t('search.searching')}...
              </p>
            </div>
          )}

          {isError && (
            <div className="flex items-center justify-center py-8">
              <p className="text-red-400 text-lg">{t('search.error')}</p>
            </div>
          )}

          {!isLoading && !isError && searchResults?.data.items.length === 0 && (
            <div className="flex items-center justify-center py-8">
              <p className="text-[var(--color-background-25)] text-lg">
                {t('search.noResults')}
              </p>
            </div>
          )}

          {!isLoading && !isError && searchResults?.data.items && (
            <>
              <div className="p-4 space-y-3">
                {searchResults.data.items.map((game, index) => (
                  <div
                    key={game.id}
                    onClick={() => handleGameClick(game.slug)}
                    className={`flex items-center gap-4 p-3 rounded-[16px] hover:bg-[var(--color-background-17)] cursor-pointer transition-all duration-200 hover:scale-[1.02] border ${
                      selectedIndex === index
                        ? 'border-[var(--color-background-23)]/40 bg-[var(--color-background-17)]'
                        : 'border-transparent hover:border-[var(--color-background-23)]/20'
                    }`}
                  >
                    <img
                      src={game.mainImage}
                      alt={game.name}
                      className="w-20 h-20 rounded-[12px] object-cover flex-shrink-0 shadow-md"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-white text-lg font-bold truncate">
                        {game.name}
                      </h4>
                      <p className="text-[var(--color-background-25)] text-sm truncate">
                        {game.developer}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        {game.salePrice > 0 && game.salePrice < game.price ? (
                          <>
                            <span className="text-[var(--color-background-23)] text-lg font-bold">
                              ${game.salePrice}
                            </span>
                            <span className="text-[var(--color-background-25)] line-through">
                              ${game.price}
                            </span>
                            <span className="bg-[var(--color-background-10)] text-black text-xs px-2 py-1 rounded">
                              -{game.discountPercent}%
                            </span>
                          </>
                        ) : (
                          <span className="text-white text-lg font-bold">
                            ${game.price}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* View All Button */}
              {searchResults.data.totalCount > 10 && (
                <div className="p-4 border-t border-[var(--color-background-17)]">
                  <button
                    onClick={handleViewAllClick}
                    className="w-full bg-[var(--color-background-23)] text-white py-3 rounded-[16px] font-bold hover:bg-[var(--color-background-21)] transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                  >
                    {t('search.viewAll')} ({searchResults.data.totalCount}{' '}
                    {t('search.results')})
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
