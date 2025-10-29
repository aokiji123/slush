import {
  FaChevronDown,
  FaChevronLeft,
  FaChevronRight,
  FaChevronUp,
  FaCheck,
  FaStar,
  FaApple,
  FaWindows,
  FaPlaystation,
  FaXbox,
} from 'react-icons/fa'
import { createFileRoute, useNavigate, useParams } from '@tanstack/react-router'
import React, { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import {
  MasonryLayout,
  SortDropdown,
  GameComment,
  PurchaseConfirmationModal,
  OptimizedImage,
} from '@/components'
import { ReviewModal } from '@/components/ReviewModal'
import {
  useGameById,
  useGameDlcs,
  useGameReviews,
  useBaseGame,
} from '@/api/queries/useGame'
import { useAuthState } from '@/api/queries/useAuth'
import { useAuthenticatedUser } from '@/api/queries/useUser'
import { useGenreTranslation } from '@/utils/translateGenre'
import { useCartStore } from '@/lib/cartStore'
import { useGameOwnership } from '@/api/queries/useLibrary'
import {
  useFriendsWhoOwnGame,
  useFriendsWhoWishlistGame,
} from '@/api/queries/useFriendship'
import {
  useWishlist,
  useAddToWishlist,
  useRemoveFromWishlist,
} from '@/api/queries/useWishlist'
import { usePurchaseGame } from '@/api/queries/usePurchase'
import { useWalletBalance } from '@/api/queries/useWallet'
import { FavoriteIcon, FavoriteFilledIcon } from '@/icons'
import type { Review } from '@/api/types/game'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation } from 'swiper/modules'
import type { Swiper as SwiperType } from 'swiper'

// @ts-expect-error - Swiper CSS imports are valid
import 'swiper/css'
// @ts-expect-error - Swiper CSS imports are valid
import 'swiper/css/navigation'

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
  const [selectedSort, setSelectedSort] = useState('createdat:desc') // Default to newest
  const navigate = useNavigate()
  const { slug } = useParams({ from: '/$slug' })
  const { data: game, isLoading, isError } = useGameById(slug)
  const { data: baseGame } = useBaseGame(game?.data.isDlc ? game.data.id : null)
  const { data: gameDlcs } = useGameDlcs(
    game?.data.isDlc ? baseGame?.data.slug || slug : slug,
  )

  const otherDlcs = game?.data.isDlc
    ? gameDlcs?.data.filter((dlc) => dlc.id !== game.data.id) || []
    : gameDlcs?.data || []
  const {
    data: reviews,
    isLoading: reviewsLoading,
    refetch: refetchReviews,
  } = useGameReviews(game?.data.id || '', selectedSort)
  const { user: authUser } = useAuthState()
  const { data: authenticatedUser } = useAuthenticatedUser()
  const translateGenre = useGenreTranslation()
  const sortOptions = getSortOptions(t)
  const { addToCart, isInCart } = useCartStore()
  const { data: isOwned } = useGameOwnership(game?.data.id || '')
  const swiperRef = useRef<SwiperType | null>(null)
  const [selectedImage, setSelectedImage] = useState<string>('')
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0)

  const gameInCart = game?.data ? isInCart(game.data.id) : false

  // Purchase and wishlist functionality
  const { data: wishlistData } = useWishlist()
  const addToWishlistMutation = useAddToWishlist()
  const removeFromWishlistMutation = useRemoveFromWishlist()
  const purchaseGameMutation = usePurchaseGame()
  const { data: walletBalance } = useWalletBalance()
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false)

  const { data: friendsWhoWishlist } = useFriendsWhoWishlistGame(
    game?.data.id || '',
  )
  const { data: friendsWhoOwn } = useFriendsWhoOwnGame(game?.data.id || '')

  const isInWishlist =
    wishlistData?.data.some(
      (wishlistGame) => wishlistGame.id === game?.data.id,
    ) || false

  const handleWishlistToggle = () => {
    if (!game?.data.id) return

    if (isInWishlist) {
      removeFromWishlistMutation.mutate({ gameId: game.data.id })
    } else {
      addToWishlistMutation.mutate({ gameId: game.data.id })
    }
  }

  const handleConfirmPurchase = async () => {
    if (!game?.data.id) return

    try {
      const result = await purchaseGameMutation.mutateAsync({
        gameId: game.data.id,
        title: `Purchase: ${game.data.name}`,
      })

      if (!result.success) {
        throw new Error(result.message || 'Purchase failed')
      }

      setIsPurchaseModalOpen(false)
      navigate({ to: '/library' })
    } catch (error) {
      console.error('Purchase failed:', error)
    }
  }

  const allImages = game?.data
    ? [
        game.data.mainImage,
        ...(game.data.images || []).filter(
          (img) => img !== game.data.mainImage && img && img.trim(),
        ),
      ]
    : []

  const validSelectedImage = selectedImage || game?.data.mainImage || ''

  useEffect(() => {
    if (game?.data) {
      setSelectedImage(game.data.mainImage)
      setActiveImageIndex(0)
    }
  }, [game?.data])

  const userId = authenticatedUser?.id || (authUser as any)?.id
  const userReview = reviews?.data.find(
    (review: Review) => review.userId === userId,
  )

  const handleAddToCart = () => {
    if (game?.data && !gameInCart) {
      addToCart(game.data)
    }
  }

  const handleAddAllDlcsToCart = () => {
    if (gameDlcs?.data) {
      gameDlcs.data.forEach((dlc) => {
        if (!isInCart(dlc.id)) {
          addToCart(dlc)
        }
      })
    }
  }

  const handleSlideChange = (swiper: SwiperType) => {
    const activeIndex = swiper.activeIndex
    if (allImages[activeIndex]) {
      setSelectedImage(allImages[activeIndex])
      setActiveImageIndex(activeIndex)
    }
  }

  const handleSlideClick = (index: number) => {
    setSelectedImage(allImages[index])
    setActiveImageIndex(index)
    if (swiperRef.current) {
      swiperRef.current.slideTo(index)
    }
  }

  const handlePrevClick = () => {
    if (allImages.length === 0) return

    // Calculate the previous image index with wraparound
    const newIndex =
      activeImageIndex > 0 ? activeImageIndex - 1 : allImages.length - 1

    // Update selected image immediately
    setSelectedImage(allImages[newIndex])
    setActiveImageIndex(newIndex)

    // Tell swiper to slide to this index
    if (swiperRef.current) {
      swiperRef.current.slideTo(newIndex)
    }
  }

  const handleNextClick = () => {
    if (allImages.length === 0) return

    // Calculate the next image index with wraparound
    const newIndex =
      activeImageIndex < allImages.length - 1 ? activeImageIndex + 1 : 0

    // Update selected image immediately
    setSelectedImage(allImages[newIndex])
    setActiveImageIndex(newIndex)

    // Tell swiper to slide to this index
    if (swiperRef.current) {
      swiperRef.current.slideTo(newIndex)
    }
  }

  const handleSortSelect = (sortValue: string) => {
    // Map frontend sort options to backend values
    const sortMapping: Record<string, string> = {
      [t('common:sorting.popular')]: 'likes:desc',
      [t('common:sorting.rating')]: 'rating:desc',
      [t('game:reviews.sortByComments')]: 'likes:desc',
      [t('common:sorting.newest')]: 'createdat:desc',
      [t('game:reviews.sortByPositive')]: 'rating:desc',
      [t('game:reviews.sortByNegative')]: 'rating:asc',
    }

    const backendSort = sortMapping[sortValue] || 'createdat:desc'
    setSelectedSort(backendSort)
    setIsSortDropdownOpen(false)
  }

  const getCurrentSortLabel = () => {
    // Map backend sort values back to frontend labels
    const reverseMapping: Record<string, string> = {
      'likes:desc': t('common:sorting.popular'),
      'rating:desc': t('common:sorting.rating'),
      'createdat:desc': t('common:sorting.newest'),
      'rating:asc': t('game:reviews.sortByNegative'),
    }

    return reverseMapping[selectedSort] || t('common:sorting.newest')
  }

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
      <style>
        {`
          .swiper-button-disabled {
            opacity: 0.3 !important;
            cursor: not-allowed !important;
          }
        `}
      </style>
      {validSelectedImage && (
        <OptimizedImage
          src={validSelectedImage}
          alt={game.data.name}
          className="w-full object-cover h-[435px] rounded-[20px]"
          loading="lazy"
          placeholder="/game-image.png"
        />
      )}
      {/* Rating - only visible on screens smaller than lg */}
      <div className="lg:hidden flex items-center gap-[12px] sm:gap-[15px] justify-start sm:justify-end h-[48px] mb-[8px]">
        <p className="text-[20px] sm:text-[24px] font-bold text-[var(--color-background)] font-manrope">
          {game.data.rating.toFixed(1) || '0.0'}
        </p>
        <div className="flex items-center gap-[4px] sm:gap-[8px]">
          {Array.from({ length: 5 }).map((_, index) => {
            const isFilled = index < Math.floor(game.data.rating)
            return (
              <FaStar
                key={index}
                size={20}
                className={
                  isFilled
                    ? 'text-[var(--color-background-10)]'
                    : 'text-[var(--color-background-25)]'
                }
              />
            )
          })}
        </div>
      </div>
      <div className="w-full relative mb-[24px]">
        <Swiper
          modules={[Navigation]}
          spaceBetween={16}
          slidesPerView="auto"
          onSwiper={(swiper) => {
            swiperRef.current = swiper
          }}
          onSlideChange={handleSlideChange}
          className="w-full"
        >
          {allImages
            .filter((img) => img && img.trim())
            .map((image, index) => {
              const isSelected = selectedImage === image
              return (
                <SwiperSlide key={index} className="w-[180px] p-1">
                  <div
                    className={`w-[180px] h-[90px] flex-shrink-0 cursor-pointer transition-all duration-200 rounded-[20px] ${
                      isSelected ? 'ring-2 ring-[#0d8a6b]' : 'hover:opacity-80'
                    }`}
                    onClick={() => handleSlideClick(index)}
                  >
                    <img
                      src={image}
                      alt={`${game.data.name} ${index + 1}`}
                      className={`w-full object-cover h-full rounded-[20px] transition-all duration-200 ${
                        isSelected
                          ? 'opacity-100'
                          : 'opacity-90 hover:opacity-100'
                      }`}
                      loading="lazy"
                    />
                  </div>
                </SwiperSlide>
              )
            })}
        </Swiper>

        {allImages.length > 1 && (
          <>
            <div
              className="w-[24px] h-[24px] flex items-center justify-center bg-white rounded-[20px] absolute -left-3 top-[35px] z-10 shadow-lg cursor-pointer"
              onClick={handlePrevClick}
            >
              <FaChevronLeft size={16} />
            </div>
            <div
              className="w-[24px] h-[24px] flex items-center justify-center bg-white rounded-[20px] absolute -right-3 top-[35px] z-10 shadow-lg cursor-pointer"
              onClick={handleNextClick}
            >
              <FaChevronRight size={16} />
            </div>
          </>
        )}
      </div>

      {/* Price and purchase buttons - only visible on small screens */}
      <div className="lg:hidden flex flex-col gap-[20px] mb-[24px]">
        <div className="flex items-center gap-[6px] sm:gap-[8px]">
          {game.data.salePrice && game.data.salePrice > 0 ? (
            <>
              <p className="text-[24px] sm:text-[28px] lg:text-[32px] font-bold text-[var(--color-background)] font-manrope">
                {game.data.salePrice}₴
              </p>
              <p className="text-[18px] sm:text-[20px] lg:text-[24px] font-normal text-[var(--color-background-25)] line-through font-manrope">
                {game.data.price}₴
              </p>
            </>
          ) : (
            <p className="text-[24px] sm:text-[28px] lg:text-[32px] font-bold text-[var(--color-background)] font-manrope">
              {game.data.price ? `${game.data.price}₴` : t('game:actions.free')}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-[12px]">
          {isOwned ? (
            <button
              disabled
              className="h-[48px] flex items-center justify-center py-[12px] px-[26px] text-[20px] font-bold rounded-[20px] bg-[#F1FDFF] text-[var(--color-background-16)] cursor-default"
            >
              <p>Owned</p>
            </button>
          ) : (
            <button
              onClick={() => setIsPurchaseModalOpen(true)}
              disabled={purchaseGameMutation.isPending || !walletBalance}
              className={`h-[48px] flex items-center justify-center py-[12px] px-[26px] text-[20px] font-normal rounded-[20px] transition-colors ${
                purchaseGameMutation.isPending || !walletBalance
                  ? 'bg-gray-500 text-gray-300 cursor-not-allowed'
                  : 'bg-[var(--color-background-21)] text-[var(--color-night-background)] cursor-pointer hover:bg-[var(--color-background-22)]'
              }`}
            >
              <p>
                {purchaseGameMutation.isPending
                  ? 'Processing...'
                  : walletBalance &&
                      walletBalance.amount <
                        (game.data.salePrice > 0
                          ? game.data.salePrice
                          : game.data.price)
                    ? 'Insufficient Funds'
                    : t('game:actions.buy')}
              </p>
            </button>
          )}
          {!isOwned && (
            <div className="w-full flex flex-col sm:flex-row items-stretch sm:items-center gap-[8px]">
              <button
                onClick={handleAddToCart}
                disabled={gameInCart}
                className={`h-[48px] flex-1 flex items-center justify-center py-[12px] px-[20px] sm:px-[26px] text-[16px] sm:text-[18px] lg:text-[20px] font-medium rounded-[20px] transition-colors ${
                  gameInCart
                    ? 'bg-[var(--color-background-16)] text-[var(--color-background)] cursor-default'
                    : 'bg-[var(--color-background-21)] text-[var(--color-night-background)] hover:bg-[var(--color-background-22)] cursor-pointer'
                }`}
              >
                {gameInCart ? (
                  <div className="flex items-center gap-[8px]">
                    <FaCheck size={14} />
                    <p>{t('game:actions.inCart')}</p>
                  </div>
                ) : (
                  <p>{t('game:actions.addToCart')}</p>
                )}
              </button>
              <button
                onClick={handleWishlistToggle}
                disabled={
                  addToWishlistMutation.isPending ||
                  removeFromWishlistMutation.isPending
                }
                className={`h-[48px] w-[48px] flex items-center justify-center p-[12px] text-[20px] font-normal rounded-[20px] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${
                  isInWishlist
                    ? 'bg-[#F1FDFF]'
                    : 'bg-[var(--color-background-16)]'
                }`}
              >
                {isInWishlist ? (
                  <FavoriteFilledIcon className="w-[20px] sm:w-[24px] h-[20px] sm:h-[24px] text-[var(--color-background-16)]" />
                ) : (
                  <FavoriteIcon className="w-[20px] sm:w-[24px] h-[20px] sm:h-[24px] text-[var(--color-background)]" />
                )}
              </button>
            </div>
          )}
        </div>

        {/* Metadata section */}
        <div className="flex flex-col gap-[16px] text-[var(--color-background)]">
          <div className="flex items-center justify-between">
            <p className="text-[16px] font-bold">
              {t('game:sidebar.releaseDate')}
            </p>
            <p className="text-[16px] font-normal">
              {game.data.releaseDate
                ? new Date(game.data.releaseDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })
                : 'N/A'}
            </p>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-[16px] font-bold">
              {t('game:sidebar.developer')}
            </p>
            <p className="text-[16px] font-normal">{game.data.developer}</p>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-[16px] font-bold">
              {t('game:sidebar.publisher')}
            </p>
            <p className="text-[16px] font-normal">{game.data.publisher}</p>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-[16px] font-bold">
              {t('game:sidebar.platforms')}
            </p>
            <div className="flex items-center gap-[12px]">
              {(() => {
                const platforms = game.data.platforms
                const hasPlatforms =
                  Array.isArray(platforms) && platforms.length > 0

                if (!hasPlatforms) {
                  return (
                    <p className="text-[14px] text-[var(--color-background-25)]">
                      N/A
                    </p>
                  )
                }

                return (
                  <>
                    {platforms.some((p) => {
                      const lower = p.toLowerCase()
                      return (
                        lower === 'windows' ||
                        lower === 'pc' ||
                        lower.includes('windows')
                      )
                    }) && <FaWindows size={24} />}
                    {platforms.some((p) => {
                      const lower = p.toLowerCase()
                      return (
                        lower === 'apple' ||
                        lower === 'mac' ||
                        lower === 'macos' ||
                        lower.includes('mac')
                      )
                    }) && <FaApple size={24} />}
                    {platforms.some((p) => {
                      const lower = p.toLowerCase()
                      return (
                        lower === 'playstation' ||
                        lower === 'ps' ||
                        lower.includes('ps') ||
                        lower.includes('playstation')
                      )
                    }) && <FaPlaystation size={24} />}
                    {platforms.some((p) => {
                      const lower = p.toLowerCase()
                      return lower === 'xbox' || lower.includes('xbox')
                    }) && <FaXbox size={24} />}
                  </>
                )
              })()}
            </div>
          </div>
        </div>

        <div className="rounded-[20px] bg-[var(--color-background-15)] p-[16px] sm:p-[20px] flex flex-col gap-[16px] sm:gap-[20px] text-[var(--color-background)]">
          <p className="text-[16px] sm:text-[18px] lg:text-[20px] font-bold">
            {friendsWhoWishlist && friendsWhoWishlist.length > 0
              ? friendsWhoWishlist.length === 1
                ? t('game:sidebar.friendWantsThis')
                : t('game:sidebar.friendsWantThis')
              : t('game:sidebar.noFriendsWantThis')}
          </p>
          <div className="w-full sm:w-[155px] flex flex-col gap-[8px]">
            {friendsWhoWishlist && friendsWhoWishlist.length > 0 ? (
              friendsWhoWishlist.slice(0, 2).map((friend) => (
                <div
                  key={friend.id}
                  className="relative bg-[var(--color-background-8)] pl-[40px] sm:pl-[48px] pr-[12px] h-[32px] sm:h-[36px] rounded-[20px] flex items-center justify-end w-fit cursor-pointer"
                >
                  <img
                    src={friend.avatar || `/avatar.png`}
                    alt="avatar"
                    className="w-[32px] h-[32px] sm:w-[36px] sm:h-[36px] object-cover rounded-full absolute top-0 left-0"
                    loading="lazy"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.src = '/avatar.png'
                    }}
                  />
                  <p className="text-right text-[14px] sm:text-[16px] font-medium">
                    {friend.nickname}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-[14px] text-[var(--color-background-25)]">
                {t('game:sidebar.noFriendsWantThis')}
              </p>
            )}
          </div>
        </div>

        <div className="rounded-[20px] bg-[var(--color-background-15)] p-[16px] sm:p-[20px] flex flex-col gap-[16px] sm:gap-[20px] text-[var(--color-background)]">
          <p className="text-[16px] sm:text-[18px] lg:text-[20px] font-bold">
            {friendsWhoOwn && friendsWhoOwn.length > 0
              ? friendsWhoOwn.length === 1
                ? t('game:sidebar.friendHasThis')
                : t('game:sidebar.friendsHaveThis')
              : t('game:sidebar.noFriendsHaveThis')}
          </p>
          <div className="flex gap-[6px] sm:gap-[8px] flex-wrap">
            {friendsWhoOwn && friendsWhoOwn.length > 0 ? (
              <React.Fragment key="friends-who-own">
                {friendsWhoOwn.slice(0, 7).map((friend) => (
                  <div
                    key={friend.id}
                    className="relative bg-[var(--color-background-8)] pl-[36px] sm:pl-[48px] pr-[8px] sm:pr-[12px] h-[28px] sm:h-[36px] rounded-[20px] flex items-center justify-end w-fit cursor-pointer"
                  >
                    <img
                      src={friend.avatar || `/avatar.png`}
                      alt="avatar"
                      className="w-[28px] h-[28px] sm:w-[36px] sm:h-[36px] object-cover rounded-full absolute top-0 left-0"
                      loading="lazy"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = '/avatar.png'
                      }}
                    />
                    <p className="text-right text-[12px] sm:text-[14px] lg:text-[16px] font-medium">
                      {friend.nickname}
                    </p>
                  </div>
                ))}
                {friendsWhoOwn.length > 7 && (
                  <div className="w-[28px] h-[28px] sm:w-[36px] sm:h-[36px] flex items-center justify-center bg-[var(--color-background-18)] rounded-full text-[12px] sm:text-[14px] lg:text-[16px] font-extralight text-[var(--color-background-25)] cursor-pointer">
                    +{friendsWhoOwn.length - 7}
                  </div>
                )}
              </React.Fragment>
            ) : (
              <p className="text-[14px] text-[var(--color-background-25)]">
                {t('game:sidebar.noFriendsHaveThis')}
              </p>
            )}
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

      {game.data.isDlc && baseGame?.data && (
        <div className="mb-[24px] text-[var(--color-background)] flex flex-col gap-[12px]">
          <div
            className="w-full bg-[var(--color-background-15)] rounded-[20px] p-[20px] flex flex-col gap-[12px] cursor-pointer hover:bg-[var(--color-background-8)] transition-colors"
            onClick={() => navigate({ to: `/${baseGame.data.slug}` })}
          >
            <div className="flex items-center gap-[16px]">
              <div className="bg-[#FF6F95] text-[#00141F] px-[12px] py-[4px] rounded-[20px] text-[16px] font-bold">
                {t('game:dlc.baseGame')}
              </div>
              <p className="text-[24px] font-bold font-manrope">
                {baseGame.data.name}
              </p>
            </div>
            <div className="flex items-center justify-end">
              <div className="flex items-center gap-[20px]">
                <p className="text-[20px] font-bold">
                  {baseGame.data.salePrice > 0
                    ? `${baseGame.data.salePrice}₴`
                    : baseGame.data.price > 0
                      ? `${baseGame.data.price}₴`
                      : t('game:actions.free')}
                </p>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    addToCart(baseGame.data)
                  }}
                  className="bg-[var(--color-background-21)] text-[var(--color-night-background)] px-[36px] py-[13px] rounded-[20px] text-[20px] font-medium hover:bg-[var(--color-background-22)] transition-colors cursor-pointer"
                >
                  {t('game:actions.addToCart')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mb-[24px] text-[var(--color-background)] flex flex-col gap-[12px]">
        <p className="text-[32px] font-bold font-manrope">
          {t('game:bundles.title')}
        </p>
        <div className="w-full bg-[var(--color-background-15)] min-h-[275px] rounded-[20px] p-[20px] flex flex-col gap-[20px]">
          <p className="text-[24px] font-bold font-manrope">{game.data.name}</p>
          <div className="p-[16px] rounded-[20px] flex flex-col gap-[12px] bg-[var(--color-background-8)]">
            <p className="text-[20px] font-normal">{game.data.description}</p>
            <div className="text-[20px] font-normal">
              <p className="text-[var(--color-background-25)]">
                {t('game:bundles.contents')}
              </p>
              <p className="ml-3">
                • {game.data.name}{' '}
                <span className="text-[var(--color-background-25)]">
                  ({t('game:bundles.baseGame')})
                </span>
              </p>
            </div>
          </div>
          <div className="flex items-center justify-center sm:justify-end">
            <div className="flex items-center gap-[18px]">
              {game.data.salePrice > 0 ? (
                <>
                  <div className="flex flex-col sm:flex-row items-center gap-[8px]">
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
                  {game.data.price
                    ? `${game.data.price}₴`
                    : t('game:actions.free')}
                </p>
              )}
              {isOwned ? (
                <button
                  disabled
                  className="h-[48px] flex items-center justify-center py-[12px] px-[26px] text-[20px] font-bold rounded-[20px] bg-[#F1FDFF] text-[var(--color-background-16)] cursor-default"
                >
                  <p>Owned</p>
                </button>
              ) : (
                <button
                  onClick={handleAddToCart}
                  disabled={gameInCart}
                  className={`h-[48px] flex items-center justify-center py-[12px] px-[26px] text-[20px] font-medium rounded-[20px] transition-colors ${
                    gameInCart
                      ? 'bg-[var(--color-background-16)] text-[var(--color-background)] cursor-default'
                      : 'bg-[var(--color-background-21)] text-[var(--color-night-background)] hover:bg-[var(--color-background-22)] cursor-pointer'
                  }`}
                >
                  {gameInCart ? (
                    <div className="flex items-center gap-[8px]">
                      <FaCheck size={16} />
                      <p>{t('game:actions.inCart')}</p>
                    </div>
                  ) : (
                    <p>{t('game:actions.addToCart')}</p>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Show Other DLCs section on DLC page */}
        {game.data.isDlc && otherDlcs.length > 0 && (
          <div className="flex flex-col gap-[20px]">
            <div className="flex items-center justify-between">
              <p className="text-[32px] font-bold font-manrope">
                {t('game:dlc.otherDlc')}
              </p>
              {baseGame?.data.slug && (
                <p
                  className="text-[16px] flex items-center gap-[8px] cursor-pointer text-[var(--color-background)]"
                  onClick={() => navigate({ to: `/${baseGame.data.slug}/dlc` })}
                >
                  {t('game:dlc.allDlc')} <FaChevronRight />
                </p>
              )}
            </div>

            <div className="flex flex-col gap-[8px]">
              {otherDlcs.map((dlc) => (
                <div
                  key={dlc.id}
                  onClick={() => navigate({ to: `/${dlc.slug}` })}
                  className="p-[20px] rounded-[20px] bg-[var(--color-background-15)] flex items-center justify-between text-[20px] font-bold cursor-pointer hover:bg-[var(--color-background-8)] transition-colors"
                >
                  <p className="font-manrope">{dlc.name}</p>
                  <p>{dlc.price ? `${dlc.price}₴` : t('game:actions.free')}</p>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-end">
              <div className="flex items-center gap-[16px]">
                <p className="text-[20px] font-bold text-[var(--color-background)] font-manrope">
                  {otherDlcs.reduce((total, dlc) => total + dlc.price, 0)}₴
                </p>
                <button
                  onClick={() => {
                    otherDlcs.forEach((dlc) => {
                      if (!isInCart(dlc.id)) {
                        addToCart(dlc)
                      }
                    })
                  }}
                  className="bg-[var(--color-background-21)] text-[var(--color-night-background)] px-[26px] py-[12px] rounded-[20px] text-[20px] font-medium hover:bg-[var(--color-background-22)] transition-colors cursor-pointer"
                >
                  <p>{t('game:dlc.addAllDlcToCart')}</p>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Show DLCs section on regular game page */}
        {!game.data.isDlc && gameDlcs && gameDlcs.data.length > 0 && (
          <div className="flex flex-col gap-[20px]">
            <div className="flex items-center justify-between">
              <p className="text-[32px] font-bold font-manrope">
                {t('game:dlc.otherDlc')}
              </p>
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
                  onClick={() => navigate({ to: `/${dlc.slug}` })}
                  className="p-[20px] rounded-[20px] bg-[var(--color-background-15)] flex items-center justify-between text-[20px] font-bold cursor-pointer hover:bg-[var(--color-background-8)] transition-colors"
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
                <button
                  onClick={handleAddAllDlcsToCart}
                  className="h-[48px] flex items-center justify-center py-[12px] px-[26px] text-[20px] font-medium rounded-[20px] bg-[var(--color-background-21)] text-[var(--color-night-background)] hover:bg-[var(--color-background-22)] transition-colors cursor-pointer"
                >
                  <p>{t('game:dlc.addAllDlcToCart')}</p>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="w-full flex flex-col gap-[16px] sm:gap-[24px]">
        <div className="flex items-center justify-between">
          <p className="text-[20px] sm:text-[28px] lg:text-[32px] font-bold text-[var(--color-background)] font-manrope">
            {t('game:reviews.title')}
          </p>
        </div>

        <div className="flex items-center gap-[10px] relative">
          <p className="text-[14px] sm:text-[16px] font-normal text-[var(--color-background-25)]">
            {t('game:reviews.sorting')}
          </p>
          <button
            className="flex items-center gap-[8px] text-[14px] sm:text-[16px] font-normal text-[var(--color-background)] cursor-pointer"
            onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
          >
            {getCurrentSortLabel()}{' '}
            {isSortDropdownOpen ? <FaChevronUp /> : <FaChevronDown />}
          </button>
          {isSortDropdownOpen && (
            <SortDropdown
              className="absolute top-8 left-[100px]"
              options={sortOptions}
              onSelect={handleSortSelect}
            />
          )}
        </div>

        <div className="flex flex-col gap-[24px] sm:gap-[32px]">
          {/* Write Review Button - Only show if user owns the game */}
          {isOwned && (
            <div className="flex justify-end">
              <button
                onClick={() => setIsReviewModalOpen(true)}
                className="h-[40px] sm:h-[48px] flex items-center justify-center py-[8px] px-[16px] sm:px-[20px] text-[14px] sm:text-[16px] font-medium rounded-[20px] bg-[var(--color-background-21)] text-[var(--color-night-background)]"
              >
                {userReview
                  ? t('game:actions.editReview')
                  : t('game:actions.writeReview')}
              </button>
            </div>
          )}

          {/* Single column layout on mobile, MasonryLayout on larger screens */}
          <div className="flex flex-col lg:hidden gap-[16px] text-white">
            {reviewsLoading ? (
              <div className="text-center py-8">
                <p className="text-[var(--color-background-25)]">
                  {t('common.loading')}
                </p>
              </div>
            ) : reviews?.data &&
              Array.isArray(reviews.data) &&
              reviews.data.length > 0 ? (
              reviews.data.map((review: Review, index: number) => (
                <GameComment
                  key={review.id || index}
                  review={review}
                  onLikeToggle={() => refetchReviews()}
                  isCurrentUserReview={review.userId === userId}
                />
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-[var(--color-background-25)]">
                  {t('game.review.noReviews')}
                </p>
              </div>
            )}
          </div>

          {/* MasonryLayout for larger screens */}
          <div className="hidden lg:block">
            <MasonryLayout
              columns={2}
              gap="16px"
              className="text-[var(--color-background)]"
            >
              {reviewsLoading ? (
                <div className="col-span-2 text-center py-8">
                  <p className="text-[var(--color-background-25)]">
                    {t('common.loading')}
                  </p>
                </div>
              ) : reviews?.data &&
                Array.isArray(reviews.data) &&
                reviews.data.length > 0 ? (
                reviews.data.map((review: Review, index: number) => (
                  <GameComment
                    key={review.id || index}
                    review={review}
                    onLikeToggle={() => refetchReviews()}
                    isCurrentUserReview={review.userId === userId}
                  />
                ))
              ) : (
                <div className="col-span-2 text-center py-8">
                  <p className="text-[var(--color-background-25)]">
                    {t('game.review.noReviews')}
                  </p>
                </div>
              )}
            </MasonryLayout>
          </div>

          <div className="flex items-center justify-center cursor-pointer">
            {reviews?.data && reviews.data.length > 0 && (
              <FaChevronDown
                size={24}
                className="text-[var(--color-background)]"
              />
            )}
          </div>
        </div>

        {/* Review Modal */}
        <ReviewModal
          isOpen={isReviewModalOpen}
          onClose={() => setIsReviewModalOpen(false)}
          gameId={game.data.id || ''}
          existingReview={userReview}
          onReviewCreated={() => {
            refetchReviews()
            setIsReviewModalOpen(false)
          }}
        />
      </div>

      {/* Purchase Confirmation Modal */}
      {game?.data && walletBalance && (
        <PurchaseConfirmationModal
          isOpen={isPurchaseModalOpen}
          onClose={() => setIsPurchaseModalOpen(false)}
          game={game.data}
          walletBalance={walletBalance.amount}
          onConfirmPurchase={handleConfirmPurchase}
          isPurchasing={purchaseGameMutation.isPending}
        />
      )}
    </>
  )
}
