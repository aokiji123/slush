import {
  Banner,
  SortDropdown,
  LoadingState,
  ErrorState,
  EmptyState,
} from '@/components'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { FaChevronDown, FaChevronUp, FaStar, FaCheck } from 'react-icons/fa'
import { IoFilter } from 'react-icons/io5'
import { useTranslation } from 'react-i18next'
import { useGameDlcs } from '@/api/queries/useGame'
import type { GameData } from '@/api/types/game'
import { useCartStore } from '@/lib/cartStore'

const getSortOptions = (t: any) => [
  t('common:sorting.relevance'),
  t('common:sorting.popular'),
  t('common:sorting.newest'),
  t('common:sorting.rating'),
  t('common:sorting.priceLowHigh'),
  t('common:sorting.priceHighLow'),
  t('common:sorting.nameAZ'),
  t('common:sorting.nameZA'),
]

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

export const Route = createFileRoute('/$slug/dlc')({
  component: RouteComponent,
})

function RouteComponent() {
  const { slug } = Route.useParams()
  const navigate = useNavigate()
  const { t } = useTranslation(['game', 'common'])
  const { addToCart, isInCart } = useCartStore()
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false)
  const sortOptions = getSortOptions(t)

  const { data: dlcsResponse, isLoading, error, refetch } = useGameDlcs(slug)
  const dlcItems: GameData[] = dlcsResponse?.data || []

  function handleSortDropdownOpen() {
    setIsSortDropdownOpen(!isSortDropdownOpen)
  }

  const handleAddToCart = (game: GameData, e: React.MouseEvent) => {
    e.stopPropagation()
    if (!isInCart(game.id)) {
      addToCart(game)
    }
  }

  const handleDlcClick = (gameSlug: string) => {
    navigate({ to: '/$slug', params: { slug: gameSlug } })
  }

  return (
    <div className="w-full z-20">
      <Banner isDlc />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-[24px] sm:mt-[36px] lg:mt-[48px]">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-[16px] sm:gap-[20px]">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-[12px] sm:gap-[20px] w-full lg:w-auto">
            <input
              type="text"
              id="amount"
              placeholder={t('game:dlc.search')}
              className="w-full sm:w-[300px] lg:w-[400px] h-[40px] sm:h-[44px] border-1 border-[var(--color-background-16)] rounded-[16px] sm:rounded-[20px] py-[8px] sm:py-[10px] px-[12px] sm:px-[16px] text-[14px] sm:text-[16px] bg-[var(--color-background-14)] text-[var(--color-background)]"
            />
            <div className="flex items-center gap-[6px] sm:gap-[8px] text-white">
              <IoFilter size={20} className="sm:w-[24px] sm:h-[24px]" />
              <p className="text-[14px] sm:text-[16px]">
                {t('game:dlc.filters')}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-[6px] sm:gap-[8px] relative w-full sm:w-auto">
            <span className="text-[var(--color-background-25)] text-[14px] sm:text-[16px] font-extralight hidden sm:inline">
              {t('game:dlc.sorting')}{' '}
            </span>
            <button
              className="text-[var(--color-background)] text-[14px] sm:text-[16px] flex items-center gap-[4px] cursor-pointer"
              onClick={handleSortDropdownOpen}
            >
              <p className="hidden sm:inline">{t('game:dlc.byRelevance')}</p>
              <p className="sm:hidden">{t('game:dlc.sorting')}</p>

              {isSortDropdownOpen ? (
                <FaChevronUp size={14} className="sm:w-[16px] sm:h-[16px]" />
              ) : (
                <FaChevronDown size={14} className="sm:w-[16px] sm:h-[16px]" />
              )}
            </button>

            {isSortDropdownOpen && (
              <SortDropdown
                options={sortOptions}
                className="absolute top-8 left-0 sm:left-[20px] min-w-[240px] z-10"
              />
            )}
          </div>
        </div>
        {/* Loading State */}
        {isLoading && (
          <div className="mt-[24px] sm:mt-[36px] lg:mt-[48px]">
            <LoadingState message="Завантаження DLC..." />
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="mt-[24px] sm:mt-[36px] lg:mt-[48px]">
            <ErrorState
              title="Помилка завантаження DLC"
              message="Не вдалося завантажити список DLC. Спробуйте оновити сторінку."
              onRetry={() => refetch()}
              retryText="Спробувати знову"
            />
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && dlcItems.length === 0 && (
          <div className="mt-[24px] sm:mt-[36px] lg:mt-[48px]">
            <EmptyState
              title="DLC не знайдено"
              message="Для цієї гри поки що немає доступних DLC"
            />
          </div>
        )}

        {/* DLC Grid */}
        {!isLoading && !error && dlcItems.length > 0 && (
          <div className="mt-[16px] sm:mt-[20px] lg:mt-[24px] flex flex-wrap gap-[12px] sm:gap-[16px] lg:gap-[24px] mb-[128px] sm:mb-[192px] lg:mb-[256px]">
            {dlcItems.map((item) => {
              const hasDiscount =
                item.discountPercent && item.discountPercent > 0
              const inCart = isInCart(item.id)

              return (
                <div
                  key={item.id}
                  onClick={() => handleDlcClick(item.slug)}
                  className="w-full sm:w-[48%] lg:w-[48%] min-h-[320px] sm:min-h-[400px] lg:min-h-[440px] rounded-[16px] sm:rounded-[20px] bg-[var(--color-background-15)] overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                >
                  <img
                    src={item.mainImage}
                    alt={item.name}
                    className="w-full h-[180px] sm:h-[200px] lg:h-[215px] object-cover"
                  />
                  <div className="p-[12px] sm:p-[16px] lg:p-[20px] text-white flex flex-col gap-[10px] sm:gap-[12px] lg:gap-[14px] relative">
                    <div className="flex items-center justify-between">
                      <p className="text-[16px] sm:text-[18px] lg:text-[20px] font-bold font-manrope">
                        {item.name}
                      </p>
                      <div className="flex items-center gap-[6px] sm:gap-[8px]">
                        <p className="text-[14px] sm:text-[16px] font-bold">
                          {item.rating ? item.rating.toFixed(1) : '0.0'}
                        </p>
                        <FaStar
                          className="text-[var(--color-background-10)]"
                          size={18}
                        />
                      </div>
                    </div>
                    {item.description && (
                      <div className="font-light">
                        <p className="line-clamp-2 text-[12px] sm:text-[14px] lg:text-base">
                          {item.description}
                        </p>
                      </div>
                    )}
                    <div className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-[12px] sm:gap-[8px] lg:gap-[16px] mt-[8px] sm:mt-[12px] lg:mt-[16px]">
                      <div className="flex items-center gap-[6px] sm:gap-[8px]">
                        {Number(hasDiscount) > 0 && (
                          <p className="px-[6px] sm:px-[8px] py-[2px] sm:py-[4px] rounded-[16px] sm:rounded-[20px] bg-[var(--color-background-10)] text-[12px] sm:text-[14px] text-black font-medium">
                            -{item.discountPercent}%
                          </p>
                        )}
                        {hasDiscount ? (
                          item.salePrice === 0 ? (
                            <p className="text-[16px] sm:text-[18px] lg:text-[20px] font-bold">
                              {t('common.free')}
                            </p>
                          ) : (
                            <>
                              <p className="text-[16px] sm:text-[18px] lg:text-[20px] font-bold">
                                {item.salePrice}₴
                              </p>
                              <p className="text-[14px] sm:text-[16px] font-normal line-through text-[var(--color-background-25)]">
                                {item.price}₴
                              </p>
                            </>
                          )
                        ) : (
                          <p className="text-[16px] sm:text-[18px] lg:text-[20px] font-bold">
                            {item.price === 0
                              ? t('common.free')
                              : `${item.price}₴`}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={(e) => handleAddToCart(item, e)}
                        className={`h-[40px] sm:h-[44px] lg:h-[48px] flex items-center justify-center py-[8px] sm:py-[10px] lg:py-[12px] px-[16px] sm:px-[20px] lg:px-[26px] text-[14px] sm:text-[16px] lg:text-[20px] font-normal rounded-[14px] sm:rounded-[16px] lg:rounded-[20px] cursor-pointer w-full sm:w-auto ${
                          inCart
                            ? 'bg-[var(--color-background-16)] text-[var(--color-background)]'
                            : 'bg-[var(--color-background-21)] text-[var(--color-night-background)] hover:bg-[var(--color-background-22)]'
                        }`}
                      >
                        {inCart ? (
                          <div className="flex items-center gap-[4px]">
                            <FaCheck
                              size={14}
                              className="sm:w-[16px] sm:h-[16px]"
                            />
                            <span>{t('game:dlc.inCart')}</span>
                          </div>
                        ) : (
                          t('game:dlc.addToCart')
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
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
