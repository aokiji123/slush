import { useLocation, useNavigate } from '@tanstack/react-router'
import { IoFilter } from 'react-icons/io5'
import {
  CartIcon,
  CartFilledIcon,
  FavoriteIcon,
  FavoriteFilledIcon,
  GridIcon,
  GridRowIcon,
  SearchIcon,
} from '@/icons'
import { useTranslation } from 'react-i18next'
import { useState } from 'react'
import { useDebounce } from '@/hooks/useDebounce'
import { SearchModal } from './SearchModal'
import { useCartStore } from '@/lib/cartStore'

type SearchProps = {
  className?: string
  viewMode?: 'grid' | 'row'
  onViewModeChange?: (mode: 'grid' | 'row') => void
  searchText?: string
  onSearchTextChange?: (text: string) => void
}

export const Search = ({
  className,
  viewMode = 'grid',
  onViewModeChange,
  searchText: externalSearchText,
  onSearchTextChange,
}: SearchProps) => {
  const navigate = useNavigate()
  const location = useLocation()
  const { t } = useTranslation('common')
  const [internalSearchText, setInternalSearchText] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const cartCount = useCartStore((state) => state.getCartCount())
  
  // Use external search text if provided, otherwise use internal state
  const searchText = externalSearchText !== undefined ? externalSearchText : internalSearchText
  const setSearchText = onSearchTextChange || setInternalSearchText
  const debouncedSearchText = useDebounce(searchText, 300)

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSearchText('')
  }

  return (
    <div className={`flex items-center gap-[8px] w-full ${className}`}>
      <div
        className="bg-[var(--color-background-16)] h-[52px] flex-1 rounded-[20px] flex sm:gap-[8px] gap-[0px] items-center justify-between"
        style={{
          padding: '4px 26px 4px 4px',
        }}
      >
        <div className="search-input-container w-[190px] sm:w-[320px] lg:w-[590px] h-[44px] bg-[var(--overlay-dark)] rounded-[16px] flex items-center justify-between py-[10px] px-[16px] relative z-[101]">
          <input
            type="text"
            placeholder={t('search.placeholder')}
            value={searchText}
            onChange={(e) => {
              const newValue = e.target.value
              setSearchText(newValue)
              // Keep modal open if it was already open, only open it when typing starts
              if (!isModalOpen && newValue.length > 0) {
                setIsModalOpen(true)
              }
              // Only close if explicitly cleared (empty and was previously not empty)
              if (newValue.length === 0 && isModalOpen) {
                setIsModalOpen(false)
              }
            }}
            className="bg-transparent text-white text-[16px] h-[44px] w-full rounded-[20px] outline-none placeholder:text-[#CCF8FFA6] placeholder:text-[16px] relative z-[102]"
          />
          <SearchIcon className="sm:block hidden absolute right-[10px] top-1/2 -translate-y-1/2 w-[24px] h-[24px]" />
        </div>
        {location.pathname !== '/library' ? (
          <div className="flex items-center sm:gap-[26px] gap-[16px]">
            <p
              className={`text-[]14px sm:text-[16px] font-bold cursor-pointer hover:text-[var(--color-background-23)] ${
                location.pathname === '/catalog'
                  ? 'text-[var(--color-background-23)]'
                  : 'text-white'
              }`}
              onClick={() => {
                navigate({ to: '/catalog' })
              }}
            >
              {t('navigation.catalog')}
            </p>
            <p
              className={`text-[14px] sm:text-[16px] font-bold cursor-pointer hover:text-[var(--color-background-23)] ${
                location.pathname === '/new'
                  ? 'text-[var(--color-background-23)]'
                  : 'text-white'
              }`}
              onClick={() => {
                navigate({ to: '/new' })
              }}
            >
              {t('navigation.new')}
            </p>
          </div>
        ) : (
          <div className="pl-[24px] flex items-center justify-between w-full text-white">
            <div className="flex items-center gap-[8px]">
              <IoFilter size={24} />
              <p className="text-[16px]">{t('filters.title')}</p>
            </div>
            <div className="flex items-center gap-[12px]">
              <p className="text-[16px] mr-1">{t('filters.view')}</p>
              <div onClick={() => onViewModeChange?.('grid')}>
                <GridIcon
                  className={`cursor-pointer hover:text-[var(--color-background-23)] ${
                    viewMode === 'grid'
                      ? 'text-[var(--color-background-23)]'
                      : ''
                  }`}
                />
              </div>
              <div onClick={() => onViewModeChange?.('row')}>
                <GridRowIcon
                  className={`cursor-pointer hover:text-[var(--color-background-23)] ${
                    viewMode === 'row'
                      ? 'text-[var(--color-background-23)]'
                      : ''
                  }`}
                />
              </div>
            </div>
          </div>
        )}
      </div>
      {location.pathname !== '/library' && (
        <div className="sm:flex hidden items-center gap-[8px]">
          <div
            className={`w-[52px] h-[52px] flex items-center justify-center rounded-[20px] cursor-pointer transition-colors ${
              location.pathname === '/wishlist'
                ? 'bg-[#F1FDFF]'
                : 'bg-[var(--color-background-16)]'
            }`}
            onClick={() => {
              navigate({ to: '/wishlist' })
            }}
          >
            {location.pathname === '/wishlist' ? (
              <FavoriteFilledIcon className="w-[24px] h-[24px] text-[var(--color-background-16)]" />
            ) : (
              <FavoriteIcon className="w-[24px] h-[24px] text-white" />
            )}
          </div>
          <div
            className={`w-[52px] h-[52px] flex items-center justify-center rounded-[20px] cursor-pointer relative ${
              location.pathname === '/cart'
                ? 'bg-white'
                : 'bg-[var(--color-background-16)]'
            }`}
            onClick={() => {
              navigate({ to: '/cart' })
            }}
          >
            {location.pathname === '/cart' ? (
              <CartFilledIcon className="w-[24px] h-[24px] text-[var(--color-background-16)]" />
            ) : (
              <CartIcon className="w-[24px] h-[24px] text-white" />
            )}
            {cartCount > 0 && (
              <div className="absolute -top-1 -right-1 bg-[var(--color-background-21)] text-[var(--color-night-background)] rounded-full w-[20px] h-[20px] flex items-center justify-center text-[12px] font-bold">
                {cartCount > 99 ? '99+' : cartCount}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Search Modal */}
      <SearchModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        searchText={debouncedSearchText}
      />
    </div>
  )
}
