import { createFileRoute } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { FaChevronDown, FaChevronUp, FaStar, FaCheck } from 'react-icons/fa'
import { useState } from 'react'
import { MdClose } from 'react-icons/md'
import { Search, SidebarFilter, SortDropdown } from '@/components'
import { useGenreTranslation } from '@/utils/translateGenre'
import {
  useWishlistQuery,
  useRemoveFromWishlist,
} from '@/api/queries/useWishlist'
import { useCartStore } from '@/lib/cartStore'
import type { WishlistQueryParams } from '@/api/types/wishlist'
import type { CatalogFilters } from '@/types/catalog'

export const Route = createFileRoute('/wishlist')({
  component: RouteComponent,
})

const glowCoords = [
  {
    id: 1,
    top: '-150px',
    left: '-200px',
    width: '700px',
    height: '700px',
  },
  {
    id: 2,
    top: '400px',
    right: '-300px',
    width: '900px',
    height: '900px',
  },
  {
    id: 3,
    bottom: '-50px',
    left: '-250px',
    width: '900px',
    height: '900px',
  },
]

// Sort options will be created dynamically using translations

function RouteComponent() {
  const { t } = useTranslation('cart')
  const { t: tCommon } = useTranslation('common')
  const translateGenre = useGenreTranslation()
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [sortBy, setSortBy] = useState('DiscountPercent:desc')
  const [filters, setFilters] = useState<CatalogFilters>({
    page: 1,
    limit: 20,
  })

  // Create sort options dynamically using translations
  const sortOptions = [
    { label: tCommon('sorting.discounts'), value: 'DiscountPercent:desc' },
    { label: tCommon('sorting.relevance'), value: 'AddedAtUtc:desc' },
    { label: tCommon('sorting.popular'), value: 'Rating:desc' },
    { label: tCommon('sorting.newest'), value: 'ReleaseDate:desc' },
    { label: tCommon('sorting.priceLowHigh'), value: 'Price:asc' },
    { label: tCommon('sorting.priceHighLow'), value: 'Price:desc' },
    { label: tCommon('sorting.nameAZ'), value: 'Name:asc' },
    { label: tCommon('sorting.nameZA'), value: 'Name:desc' },
  ]

  const removeFromWishlistMutation = useRemoveFromWishlist()
  const { addToCart, isInCart } = useCartStore()

  // Query params for backend (no search - handled client-side)
  const queryParams: WishlistQueryParams = {
    page: filters.page,
    limit: filters.limit,
    sortBy: sortBy,
    genres: filters.genres,
    platforms: filters.platforms,
    minPrice: filters.minPrice,
    maxPrice: filters.maxPrice,
    onSale: filters.onSale,
    isDlc: filters.isDlc,
  }

  const {
    data: wishlistData,
    isLoading,
    isError,
  } = useWishlistQuery(queryParams)

  // Client-side search filtering (wishlist is small, instant filtering)
  const filteredItems =
    wishlistData?.data?.items?.filter((game) => {
      if (!searchText.trim()) return true
      const searchLower = searchText.toLowerCase()
      return (
        game.name?.toLowerCase().includes(searchLower) ||
        game.developer?.toLowerCase().includes(searchLower) ||
        game.publisher?.toLowerCase().includes(searchLower) ||
        game.description?.toLowerCase().includes(searchLower)
      )
    }) || []

  function handleSortDropdownOpen() {
    setIsSortDropdownOpen(!isSortDropdownOpen)
  }

  function handleSortChange(newSortBy: string) {
    setSortBy(newSortBy)
    setIsSortDropdownOpen(false)
  }

  function handleRemoveFromWishlist(gameId: string) {
    removeFromWishlistMutation.mutate({ gameId })
  }

  function handleAddToCart(game: any) {
    if (!isInCart(game.id)) {
      addToCart(game)
    }
  }

  return (
    <div className="bg-[var(--color-night-background)] relative overflow-hidden">
      <div className="container mx-auto relative z-20">
        <div className="flex items-center justify-center">
          <Search className="my-[16px] w-full" />
        </div>

        <h2 className="text-[48px] font-bold text-[var(--color-background)] mt-[32px] font-manrope">
          {t('wishlist.title')}
        </h2>

        <div className="flex flex-col lg:flex-row gap-[24px] mt-[16px]">
          <div className="lg:w-[25%] w-full">
            <SidebarFilter
              noSort
              filters={filters}
              onFiltersChange={setFilters}
              onSortChange={handleSortChange}
            />
          </div>

          <div className="lg:w-[75%] w-full pb-[256px]">
            <div className="bg-[var(--color-background-8)] p-[20px] rounded-[20px] flex flex-col gap-[16px]">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-[16px]">
                <input
                  className="w-full max-w-[420px] h-[44px] border-1 border-[var(--color-background-16)] rounded-[20px] py-[10px] px-[16px] text-[16px] bg-[var(--color-background-14)] text-[var(--color-background)]"
                  placeholder={t('wishlist.searchPlaceholder')}
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                />
                <div className="flex items-center gap-[8px] relative">
                  <span className="text-[var(--color-background-25)] text-[16px] font-extralight">
                    {tCommon('sorting.label')}{' '}
                  </span>
                  <button
                    className="text-[var(--color-background)] text-[16px] flex items-center gap-[4px] cursor-pointer"
                    onClick={handleSortDropdownOpen}
                  >
                    <p>
                      {sortOptions.find((opt) => opt.value === sortBy)?.label ||
                        tCommon('sorting.relevance')}
                    </p>

                    {isSortDropdownOpen ? (
                      <FaChevronUp size={16} />
                    ) : (
                      <FaChevronDown size={16} />
                    )}
                  </button>

                  {isSortDropdownOpen && (
                    <SortDropdown
                      options={sortOptions}
                      className="absolute top-8 left-[100px] min-w-[240px]"
                      onSelect={handleSortChange}
                    />
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-[8px]">
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <p className="text-[var(--color-background-25)] text-lg">
                      Loading wishlist...
                    </p>
                  </div>
                ) : isError ? (
                  <div className="flex items-center justify-center py-8">
                    <p className="text-red-400 text-lg">
                      Error loading wishlist
                    </p>
                  </div>
                ) : !filteredItems.length ? (
                  <div className="flex items-center justify-center py-8">
                    <p className="text-[var(--color-background-25)] text-lg">
                      {searchText
                        ? 'No games found matching your search'
                        : 'Your wishlist is empty'}
                    </p>
                  </div>
                ) : (
                  filteredItems.map((game) => (
                    <div
                      key={game.id}
                      className="bg-[var(--color-background-15)] rounded-[20px] p-[16px] flex flex-col lg:flex-row gap-[20px]"
                    >
                      <img
                        src={game.mainImage}
                        alt={game.name}
                        className="lg:w-[320px] w-full lg:h-[145px] h-[200px] rounded-[12px] object-cover"
                      />
                      <div className="flex flex-col gap-[20px] w-full">
                        <div className="flex flex-col lg:gap-[12px]">
                          <div className="flex items-center justify-between">
                            <p className="text-[24px] font-bold text-[var(--color-background)] font-manrope line-clamp-1">
                              {game.name}
                            </p>
                            <MdClose
                              className="text-[var(--color-background-19)] cursor-pointer hover:text-red-400 transition-colors"
                              size={24}
                              onClick={() => handleRemoveFromWishlist(game.id)}
                            />
                          </div>
                          <div className="flex items-center gap-[8px] flex-wrap">
                            {game.genre.slice(0, 3).map((genre) => (
                              <p
                                key={genre}
                                className="text-[14px] rounded-[20px] py-[4px] px-[12px] font-medium text-[var(--color-background-25)] bg-[var(--color-background-18)]"
                              >
                                {translateGenre(genre)}
                              </p>
                            ))}
                            {game.genre.length > 3 && (
                              <p className="text-[14px] rounded-[20px] py-[4px] px-[12px] font-light text-[var(--color-background-25)] bg-[var(--color-background-18)]">
                                +{game.genre.length - 3}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col items-start lg:flex-row lg:justify-between lg:items-center w-full gap-[16px]">
                          <div className="flex items-center gap-[4px] h-[24px] justify-center">
                            <p className="text-[24px] font-medium text-[var(--color-background)]">
                              {game.rating.toFixed(1)}
                            </p>
                            <FaStar
                              size={24}
                              className="text-[var(--color-background-10)]"
                            />
                          </div>
                          <div>
                            <div className="flex items-center gap-[18px]">
                              <div>
                                <div className="flex items-center gap-[16px] h-[24px] justify-end">
                                  {game.discountPercent > 0 && (
                                    <p className="px-[8px] py-[4px] rounded-[20px] bg-[var(--color-background-10)] text-[var(--color-night-background)] h-[24px] flex items-center justify-center">
                                      -{game.discountPercent}%
                                    </p>
                                  )}
                                  <div className="flex items-center gap-[8px]">
                                    <p className="text-[20px] font-bold text-[var(--color-background)]">
                                      {game.discountPercent > 0
                                        ? game.salePrice
                                        : game.price}
                                      ₴
                                    </p>
                                    {game.discountPercent > 0 && (
                                      <p className="text-[20px] font-normal line-through text-[var(--color-background-25)]">
                                        {game.price}₴
                                      </p>
                                    )}
                                  </div>
                                </div>
                                {game.saleDate && (
                                  <p className="text-[14px] font-normal text-[var(--color-background-25)]">
                                    {t('wishlist.discountValidUntil')}{' '}
                                    {new Date(
                                      game.saleDate,
                                    ).toLocaleDateString()}
                                  </p>
                                )}
                              </div>
                              <button
                                className={`h-[48px] flex items-center justify-center py-[12px] px-[26px] text-[20px] font-medium rounded-[20px] transition-colors ${
                                  isInCart(game.id)
                                    ? 'bg-[var(--color-background-16)] text-[var(--color-background)] cursor-default'
                                    : 'bg-[var(--color-background-21)] text-[var(--color-night-background)] hover:bg-[var(--color-background-22)] cursor-pointer'
                                }`}
                                onClick={() => handleAddToCart(game)}
                                disabled={isInCart(game.id)}
                              >
                                {isInCart(game.id) ? (
                                  <div className="flex items-center gap-[8px]">
                                    <FaCheck size={16} />
                                    <p>{t('wishlist.inCart')}</p>
                                  </div>
                                ) : (
                                  <p>{t('wishlist.addToCart')}</p>
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {glowCoords.map((glow) => (
        <img
          key={glow.id}
          loading="lazy"
          src="/glow.png"
          alt="glow"
          className="absolute z-0 opacity-50"
          style={{
            top: glow.top,
            left: glow.left,
            right: glow.right,
            bottom: glow.bottom,
            width: glow.width,
            height: glow.height,
          }}
        />
      ))}
    </div>
  )
}
