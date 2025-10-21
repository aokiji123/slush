import {
  FaChevronDown,
  FaChevronLeft,
  FaChevronRight,
  FaChevronUp,
  FaPlus,
} from 'react-icons/fa'
import { createFileRoute, useNavigate, useParams } from '@tanstack/react-router'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { MasonryLayout, SortDropdown, GameComment } from '@/components'
import { ReviewModal } from '@/components/ReviewModal'
import { useGameById, useGameDlcs, useGameReviews } from '@/api/queries/useGame'
import { useGameOwnership } from '@/api/queries/useLibrary'
import { useGenreTranslation } from '@/utils/translateGenre'
import type { Review } from '@/api/types/game'

export const Route = createFileRoute('/$slug/')({
  component: RouteComponent,
})

const getSortOptions = (t: any) => [
  t('common:sorting.popular'),
  t('common:sorting.rating'),
  t('game:reviews.sortByComments'),
  t('common:sorting.newest'),
  t('game:reviews.sortByPositive'),
  t('game:reviews.sortByNegative'),
]


function RouteComponent() {
  const { t } = useTranslation(['game', 'common'])
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false)
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false)
  const navigate = useNavigate()
  const { slug } = useParams({ from: '/$slug' })
  const { data: game, isLoading, isError } = useGameById(slug)
  const { data: gameDlcs } = useGameDlcs(slug)
  const { data: reviews, isLoading: reviewsLoading, refetch: refetchReviews } = useGameReviews(game?.data?.id || '')
  const { data: ownsGame } = useGameOwnership(game?.data?.id || '')
  const translateGenre = useGenreTranslation()
  const sortOptions = getSortOptions(t)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-white text-2xl">{t('common.loading')}</p>
      </div>
    )
  }

  if (isError || !game) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-white text-2xl">{t('game.notFound')}</p>
      </div>
    )
  }

  return (
    <>
      <img
        src={game.data.mainImage}
        alt={game.data.name}
        className="w-full object-cover h-[435px] rounded-[20px]"
        loading="lazy"
      />
      <div className="w-full relative mb-[24px]">
        <div className="overflow-x-auto w-full pb-[16px]">
          <div className="flex gap-[16px] w-max relative">
            {game.data.images.map((image, index) => {
              return (
                <div key={index} className="w-[180px] h-[90px] flex-shrink-0">
                  <img
                    src={image}
                    alt={`${game.data.name} ${index + 1}`}
                    className="w-full object-cover h-full rounded-[20px]"
                    loading="lazy"
                  />
                </div>
              )
            })}
          </div>
          <div className="w-[24px] h-[24px] flex items-center justify-center bg-white rounded-[20px] cursor-pointer absolute -left-3 top-[35px] z-10">
            <FaChevronLeft size={16} />
          </div>
          <div className="w-[24px] h-[24px] flex items-center justify-center bg-white rounded-[20px] cursor-pointer absolute -right-3 top-[35px] z-10">
            <FaChevronRight size={16} />
          </div>
          <div className="h-[8px] w-full bg-[var(--sky-25)] absolute bottom-0 left-0 rounded-[20px] flex items-center px-[2px]">
            <div className="h-[4px] w-[160px] bg-[var(--color-night-background)] rounded-[20px]"></div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-[8px] mb-[24px]">
        {game.data.genre.map((tag) => {
          return (
            <div
              key={tag}
              className="text-[14px] font-medium min-w-[66px] h-[24px] flex items-center justify-center bg-[var(--color-background-16)] py-[4px] px-[12px] rounded-[20px] text-[var(--color-background-25)]"
            >
              {translateGenre(tag)}
            </div>
          )
        })}
        {game.data.genre.length > 5 && (
          <div className="w-[32px] h-[24px] flex items-center justify-center bg-[var(--color-background-16)] rounded-[20px] text-[var(--color-background)] cursor-pointer">
            <FaChevronDown />
          </div>
        )}
      </div>

      <div className="flex flex-col items-center gap-[8px] text-[var(--color-background)] mb-[48px]">
        <p className="text-[20px] font-light">{game.data.description}</p>
        <FaChevronDown size={24} />
      </div>

      <div className="mb-[24px] text-[var(--color-background)] flex flex-col gap-[12px]">
        <p className="text-[32px] font-bold font-manrope">{t('game:bundles.title')}</p>
        <div className="w-full bg-[var(--color-background-15)] min-h-[275px] rounded-[20px] p-[20px] flex flex-col gap-[20px]">
          <p className="text-[24px] font-bold font-manrope">{game.data.name}</p>
          <div className="p-[16px] rounded-[20px] flex flex-col gap-[12px] bg-[var(--color-background-8)]">
            <p className="text-[20px] font-normal">{game.data.description}</p>
            <div className="text-[20px] font-normal">
              <p className="text-[var(--color-background-25)]">{t('game:bundles.contents')}</p>
              <p className="ml-3">
                • {game.data.name}{' '}
                <span className="text-[var(--color-background-25)]">
                  ({t('game:bundles.baseGame')})
                </span>
              </p>
            </div>
          </div>
          <div className="flex items-center justify-end">
            <div className="flex items-center gap-[18px]">
              {game.data.salePrice > 0 ? (
                <>
                  <div className="flex items-center gap-[8px]">
                    <p className="px-[8px] py-[4px] rounded-[20px] bg-[var(--color-background-10)] text-[var(--color-night-background)]">
                      -{game.data.discountPercent}%
                    </p>
                    <p className="text-[20px] font-bold">
                      {game.data.salePrice}₴
                    </p>
                    <p className="text-[20px] font-normal line-through text-[var(--color-background-25)]">
                      {game.data.price}₴
                    </p>
                  </div>
                </>
              ) : (
                <p className="text-[20px] font-normal text-[var(--color-background)]">
                  {game.data.price ? `${game.data.price}₴` : t('game:actions.free')}
                </p>
              )}
              <div className="h-[48px] flex items-center justify-center py-[12px] px-[26px] text-[20px] font-medium rounded-[20px] bg-[var(--color-background-21)] text-[var(--color-night-background)]">
                <p>{t('game:actions.addToCart')}</p>
              </div>
            </div>
          </div>
        </div>

        {gameDlcs && gameDlcs.data.length > 0 && (
          <div className="flex flex-col gap-[20px]">
            <div className="flex items-center justify-between">
              <p className="text-[32px] font-bold font-manrope">{t('game:dlc.otherDlc')}</p>
              <p
                className="text-[16px] flex items-center gap-[8px] cursor-pointer"
                onClick={() => navigate({ to: `/${slug}/dlc` })}
              >
                {t('game:dlc.allDlc')} <FaChevronRight />
              </p>
            </div>

            <div className="flex flex-col gap-[8px]">
              {gameDlcs.data.map((dlc) => (
                <div
                  key={dlc.id}
                  className="p-[20px] rounded-[20px] bg-[var(--color-background-15)] flex items-center justify-between text-[20px] font-bold"
                >
                  <p className="font-manrope">{dlc.name}</p>
                  <p>{dlc.price ? `${dlc.price}₴` : t('game:actions.free')}</p>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-end">
              <div className="flex items-center gap-[16px]">
                <p className="text-[20px] font-normal text-[var(--color-background)] font-manrope">
                  {gameDlcs.data.reduce((total, dlc) => total + dlc.price, 0)}₴
                </p>
                <div className="h-[48px] flex items-center justify-center py-[12px] px-[26px] text-[20px] font-medium rounded-[20px] bg-[var(--color-background-21)] text-[var(--color-night-background)]">
                  <p>{t('game:dlc.addAllDlcToCart')}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="w-full flex flex-col gap-[24px]">
        <div className="flex items-center justify-between">
          <p className="text-[32px] font-bold text-[var(--color-background)] font-manrope">
            {t('game:reviews.title')}
          </p>
          <div className="h-[48px] flex items-center justify-center py-[8px] px-[20px] text-[16px] font-medium rounded-[20px] bg-[var(--color-background-21)] text-[var(--color-night-background)]">
            <p>{t('game:actions.writeReview')}</p>
          </div>
        </div>

        <div className="flex items-center gap-[10px] relative">
          <p className="text-[16px] font-normal text-[var(--color-background-25)]">
            {t('game:reviews.sorting')}
          </p>
          <button
            className="flex items-center gap-[8px] text-[16px] font-normal text-[var(--color-background)] cursor-pointer"
            onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
          >
            {t('game:reviews.mostPopularFirst')}{' '}
            {isSortDropdownOpen ? <FaChevronUp /> : <FaChevronDown />}
          </button>
          {isSortDropdownOpen && (
            <SortDropdown
              className="absolute top-8 left-[100px]"
              options={sortOptions}
            />
          )}
        </div>

        <div className="flex flex-col gap-[32px]">
          {/* Write Review Button */}
          {ownsGame && (
            <div className="flex justify-end">
              <button
                onClick={() => setIsReviewModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-[var(--color-background-10)] text-[var(--color-background)] rounded-[12px] hover:bg-[var(--color-background-10)]/80 transition-colors"
              >
                <FaPlus size={16} />
                {t('game.review.writeReview')}
              </button>
            </div>
          )}

          <MasonryLayout
            columns={2}
            gap="16px"
            className="text-[var(--color-background)]"
          >
            {reviewsLoading ? (
              <div className="col-span-2 text-center py-8">
                <p className="text-[var(--color-background-25)]">{t('common.loading')}</p>
              </div>
            ) : reviews?.data && Array.isArray(reviews.data) && reviews.data.length > 0 ? (
              reviews.data.map((review: Review, index: number) => (
                <GameComment
                  key={review.id || index}
                  review={review}
                  onLikeToggle={() => refetchReviews()}
                />
              ))
            ) : (
              <div className="col-span-2 text-center py-8">
                <p className="text-[var(--color-background-25)]">{t('game.review.noReviews')}</p>
              </div>
            )}
          </MasonryLayout>

          <div className="flex items-center justify-center cursor-pointer">
            <FaChevronDown
              size={24}
              className="text-[var(--color-background)]"
            />
          </div>
        </div>

        {/* Review Modal */}
        <ReviewModal
          isOpen={isReviewModalOpen}
          onClose={() => setIsReviewModalOpen(false)}
          gameId={game?.data?.id || ''}
          onReviewCreated={() => {
            refetchReviews()
            setIsReviewModalOpen(false)
          }}
        />
      </div>
    </>
  )
}
