import React, { useState } from 'react'
import {
  Outlet,
  createFileRoute,
  useLocation,
  useNavigate,
} from '@tanstack/react-router'
import {
  FaApple,
  FaCheck,
  FaPlaystation,
  FaStar,
  FaWindows,
  FaXbox,
} from 'react-icons/fa'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-hot-toast'
import { Search, PurchaseConfirmationModal } from '@/components'
import { FavoriteIcon, FavoriteFilledIcon } from '@/icons'
import { useGameById } from '@/api/queries/useGame'
import {
  useWishlist,
  useAddToWishlist,
  useRemoveFromWishlist,
} from '@/api/queries/useWishlist'
import { usePurchaseGame } from '@/api/queries/usePurchase'
import { useWalletBalance } from '@/api/queries/useWallet'
import { useGameOwnership } from '@/api/queries/useLibrary'
import {
  useFriendsWhoOwnGame,
  useFriendsWhoWishlistGame,
} from '@/api/queries/useFriendship'
import { useCartStore } from '@/lib/cartStore'

export const Route = createFileRoute('/$slug')({
  component: RouteComponent,
})

const glowCoords = [
  {
    top: '450px',
    left: '-200px',
    width: '900px',
    height: '900px',
  },
  {
    top: '-300px',
    right: '-200px',
    width: '900px',
    height: '900px',
  },
  {
    bottom: '-100px',
    right: '0px',
    width: '900px',
    height: '900px',
  },
]

function getTabs(slug: string, t: any) {
  return [
    {
      name: t('game:tabs.about'),
      href: `/${slug}`,
    },
    {
      name: t('game:tabs.characteristics'),
      href: `/${slug}/characteristics`,
    },
    {
      name: t('game:tabs.community'),
      href: `/${slug}/community`,
    },
  ]
}

const TYPE_PAGE = {
  characteristics: 'characteristics',
  community: 'community',
  dlc: 'dlc',
}

function RouteComponent() {
  const navigate = useNavigate()
  const location = useLocation()
  const { slug } = Route.useParams()
  const { t, i18n } = useTranslation('game')

  const { data: game, isLoading, isError } = useGameById(slug)

  const { data: wishlistData } = useWishlist()
  const addToWishlistMutation = useAddToWishlist()
  const removeFromWishlistMutation = useRemoveFromWishlist()

  const purchaseGameMutation = usePurchaseGame()
  const { data: walletBalance } = useWalletBalance()
  const { data: isOwned } = useGameOwnership(game?.data.id || '')

  const { data: friendsWhoWishlist } = useFriendsWhoWishlistGame(
    game?.data.id || '',
  )
  const { data: friendsWhoOwn } = useFriendsWhoOwnGame(game?.data.id || '')

  const { addToCart, isInCart } = useCartStore()
  const gameInCart = game?.data.id ? isInCart(game.data.id) : false

  const isInWishlist =
    wishlistData?.data.some(
      (wishlistGame) => wishlistGame.id === game?.data.id,
    ) || false

  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false)

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

      toast.success(
        'Purchase successful! The game has been added to your library.',
      )
      navigate({ to: '/library' })
    } catch (error) {
      console.error('Purchase failed:', error)
      toast.error(
        `Purchase failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      )
    }
  }

  const handleAddToCart = () => {
    if (!game?.data) return

    addToCart(game.data)
    toast.success('Game added to cart!')
  }

  const currentPage = location.pathname.split('/')[2]
  const locationPath = location.pathname.split('/').slice(0, 3).join('/')
  const tabs = getTabs(slug, t)

  const isActiveTab = (tabHref: string) => {
    return locationPath === tabHref
  }

  if (isLoading) {
    return (
      <div className="bg-[var(--color-night-background)] relative overflow-hidden min-h-screen flex items-center justify-center">
        <p className="text-white text-2xl">{t('common.loading')}</p>
      </div>
    )
  }

  if (isError || !game) {
    return (
      <div className="bg-[var(--color-night-background)] relative overflow-hidden min-h-screen flex items-center justify-center">
        <p className="text-white text-2xl">{t('notFound')}</p>
      </div>
    )
  }

  return (
    <div className="bg-[var(--color-night-background)] relative overflow-hidden px-1">
      {currentPage === TYPE_PAGE.dlc ? (
        <div className="relative z-20">
          <Outlet />
        </div>
      ) : (
        <div className="container mx-auto relative z-20">
          <div className="flex items-center justify-center">
            <Search className="my-[16px] w-full" />
          </div>

          <ul className="flex items-center gap-[16px] text-[var(--color-background-25)] cursor-pointer mb-[24px]">
            {tabs.map((tab) => {
              const isActive = isActiveTab(tab.href)
              return (
                <li
                  key={tab.name}
                  className={`md:text-[25px] text-[18px] font-bold relative border-b-2 transition-colors font-manrope ${
                    isActive
                      ? 'text-[var(--color-background-21)] border-[var(--color-background-21)]'
                      : 'border-transparent hover:text-[var(--color-background-21)] hover:border-[var(--color-background-21)]'
                  }`}
                  onClick={() => {
                    navigate({ to: tab.href })
                  }}
                >
                  {tab.name}
                </li>
              )
            })}
          </ul>

          {currentPage === TYPE_PAGE.community ? (
            <Outlet />
          ) : (
            <div className="w-full flex flex-col lg:flex-row gap-[24px]">
              <div className="w-full lg:w-[75%] flex flex-col gap-[8px] min-w-0 mb-[24px] lg:mb-[256px]">
                <div className="flex flex-col sm:flex-row sm:items-center gap-[8px] sm:gap-[16px]">
                  {game.data.isDlc && (
                    <div className="bg-[#FF6F95] text-[#00141F] px-[12px] py-[4px] rounded-[20px] text-[14px] sm:text-[16px] font-bold self-start">
                      {t('dlc.badge')}
                    </div>
                  )}
                  <p className="text-[24px] sm:text-[28px] lg:text-[32px] font-bold text-[var(--color-background)] font-manrope">
                    {game.data.name}
                  </p>
                </div>
                <Outlet />
              </div>

              {/* Sidebar - only visible on lg screens and larger */}
              <div className="hidden lg:flex lg:w-[25%] flex-col gap-[8px] flex-shrink-0">
                <div className="flex items-center gap-[12px] sm:gap-[15px] justify-start sm:justify-end h-[48px]">
                  <p className="text-[20px] justify-start sm:text-[24px] font-bold text-[var(--color-background)] font-manrope">
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

                <div className="flex flex-col gap-[20px]">
                  {game.data.mainImage && (
                    <img
                      src={game.data.mainImage}
                      alt={game.data.name}
                      className="w-full h-[145px] rounded-[20px] object-cover"
                      loading="lazy"
                    />
                  )}
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
                        {game.data.price
                          ? `${game.data.price}₴`
                          : t('actions.free')}
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
                        disabled={
                          purchaseGameMutation.isPending || !walletBalance
                        }
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
                              : t('actions.buy')}
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
                              <p>{t('actions.inCart')}</p>
                            </div>
                          ) : (
                            <p>{t('actions.addToCart')}</p>
                          )}
                        </button>
                        <button
                          onClick={handleWishlistToggle}
                          disabled={
                            addToWishlistMutation.isPending ||
                            removeFromWishlistMutation.isPending
                          }
                          className={`h-[48px] w-[48px] sm:w-[48px] flex items-center justify-center p-[12px] text-[20px] font-normal rounded-[20px] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${
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
                    {/* <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-[8px] sm:gap-[12px] w-full">
                      <button className="flex items-center justify-center p-[12px] text-[16px] sm:text-[18px] lg:text-[20px] font-normal rounded-[20px] cursor-pointer flex-1 gap-[8px] sm:gap-[12px] hover:bg-[var(--color-background-16)] transition-colors">
                        <RepostIcon className="w-[20px] sm:w-[24px] h-[20px] sm:h-[24px] text-[var(--color-background)]" />
                        <span className="text-[var(--color-background-21)]">
                          {t('actions.repost')}
                        </span>
                      </button>
                      <button className="flex items-center justify-center p-[12px] text-[16px] sm:text-[18px] lg:text-[20px] font-normal rounded-[20px] cursor-pointer flex-1 gap-[8px] sm:gap-[12px] hover:bg-[var(--color-background-16)] transition-colors">
                        <ComplaintIcon className="w-[20px] sm:w-[24px] h-[20px] sm:h-[24px] text-[var(--color-background)]" />
                        <span className="text-[var(--color-background-19)]">
                          {t('actions.report')}
                        </span>
                      </button>
                    </div> */}
                  </div>
                  <div className="flex flex-col gap-[16px] text-[var(--color-background)]">
                    <div className="flex items-center justify-between">
                      <p className="text-[16px] font-bold">
                        {t('sidebar.releaseDate')}
                      </p>
                      <p className="text-[16px] font-normal">
                        {game.data.releaseDate
                          ? new Date(game.data.releaseDate).toLocaleDateString(
                              i18n.language === 'en' ? 'en-US' : 'uk-UA',
                              {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                              },
                            )
                          : 'N/A'}
                      </p>
                    </div>

                    <div className="flex items-center justify-between">
                      <p className="text-[16px] font-bold">
                        {t('sidebar.developer')}
                      </p>
                      <p className="text-[16px] font-normal">
                        {game.data.developer}
                      </p>
                    </div>

                    <div className="flex items-center justify-between">
                      <p className="text-[16px] font-bold">
                        {t('sidebar.publisher')}
                      </p>
                      <p className="text-[16px] font-normal">
                        {game.data.publisher}
                      </p>
                    </div>

                    <div className="flex items-center justify-between">
                      <p className="text-[16px] font-bold">
                        {t('sidebar.platforms')}
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
                                return (
                                  lower === 'xbox' || lower.includes('xbox')
                                )
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
                          ? t('sidebar.friendWantsThis')
                          : t('sidebar.friendsWantThis')
                        : t('sidebar.noFriendsWantThis')}
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
                          {t('sidebar.noFriendsWantThis')}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="rounded-[20px] bg-[var(--color-background-15)] p-[16px] sm:p-[20px] flex flex-col gap-[16px] sm:gap-[20px] text-[var(--color-background)]">
                    <p className="text-[16px] sm:text-[18px] lg:text-[20px] font-bold">
                      {friendsWhoOwn && friendsWhoOwn.length > 0
                        ? friendsWhoOwn.length === 1
                          ? t('sidebar.friendHasThis')
                          : t('sidebar.friendsHaveThis')
                        : t('sidebar.noFriendsHaveThis')}
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
                          {t('sidebar.noFriendsHaveThis')}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {glowCoords.map((glow) => (
        <img
          key={JSON.stringify(glow)}
          src="/glow.png"
          className="absolute z-10 opacity-50"
          loading="lazy"
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
    </div>
  )
}
