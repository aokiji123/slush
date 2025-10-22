import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { MdClose } from 'react-icons/md'
import { Search } from '@/components/Search'
import { useCartStore } from '@/lib/cartStore'
import { useAddToWishlist } from '@/api/queries/useWishlist'

export const Route = createFileRoute('/cart')({
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

function RouteComponent() {
  const navigate = useNavigate()
  const { t } = useTranslation('cart')
  const { items, removeFromCart, clearCart, getCartTotal, getCartSavings } = useCartStore()
  const addToWishlistMutation = useAddToWishlist()

  const handleMoveToWishlist = (gameId: string) => {
    addToWishlistMutation.mutate(
      { gameId },
      {
        onSuccess: () => {
          removeFromCart(gameId)
        },
      }
    )
  }

  const handleContinueShopping = () => {
    navigate({ to: '/catalog' })
  }

  const totalPrice = getCartTotal()
  const savings = getCartSavings()

  return (
    <div className="bg-[var(--color-night-background)] relative overflow-hidden">
      <div className="container mx-auto relative z-20">
        <div className="flex items-center justify-center">
          <Search className="my-[16px] w-full" />
        </div>

        <h2 className="text-[48px] font-bold text-[var(--color-background)] mt-[32px] font-manrope">
          {t('cart.title')}
        </h2>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-[128px] gap-[24px]">
            <p className="text-[var(--color-background)] text-[24px] font-medium">
              {t('cart.empty')}
            </p>
            <button
              onClick={handleContinueShopping}
              className="h-[48px] flex items-center justify-center px-[26px] py-[12px] rounded-[20px] bg-[var(--color-background-21)] text-[var(--color-night-background)] text-[20px] font-medium cursor-pointer"
            >
              {t('cart.continueShopping')}
            </button>
          </div>
        ) : (
          <div className="flex gap-[24px] mt-[16px]">
            <div className="w-[75%] pb-[256px]">
              <div className="flex flex-col gap-[12px]">
                {items.map((item) => {
                  const game = item.game
                  const hasDiscount = game.discountPercent > 0
                  const isFree = game.price === 0

                  return (
                    <div
                      key={game.id}
                      className={`bg-[var(--color-background-15)] rounded-[20px] overflow-hidden h-[128px]`}
                    >
                      <div className="w-full flex">
                        <img
                          src={game.mainImage}
                          alt={game.name}
                          loading="lazy"
                          className={`w-[306px] h-[128px] object-cover cursor-pointer`}
                          onClick={() =>
                            navigate({ to: '/$slug', params: { slug: game.slug } })
                          }
                        />
                        <div className="pt-[16px] p-[20px] w-full text-[var(--color-background)] flex flex-col justify-between h-[128px]">
                          <div className="flex flex-row items-center justify-between h-full">
                            <p
                              className="text-[20px] font-bold font-manrope cursor-pointer hover:text-[var(--color-background-23)] transition-colors"
                              onClick={() =>
                                navigate({ to: '/$slug', params: { slug: game.slug } })
                              }
                            >
                              {game.name}
                            </p>
                            <MdClose
                              className="text-[24px] text-[var(--color-background-25)] cursor-pointer hover:text-red-400 transition-colors"
                              onClick={() => removeFromCart(game.id)}
                            />
                          </div>
                          <div className="flex flex-row items-center justify-between h-full">
                            <button
                              className="text-[16px] text-[var(--color-background-21)] font-normal cursor-pointer hover:text-[var(--color-background-23)] transition-colors"
                              onClick={() => handleMoveToWishlist(game.id)}
                            >
                              {t('cart.moveToWishlist')}
                            </button>
                            <div className="flex items-center gap-[16px]">
                              {hasDiscount && (
                                <p className="rounded-[20px] px-[8px] py-[4px] bg-[var(--color-background-10)] text-[16px] text-black">
                                  -{game.discountPercent}%
                                </p>
                              )}
                              {hasDiscount && (
                                <p className="text-[24px] font-normal font-manrope">
                                  {game.salePrice}₴
                                </p>
                              )}
                              <p
                                className={`text-[20px] font-normal ${
                                  hasDiscount
                                    ? 'line-through text-[var(--color-background-25)] font-extralight'
                                    : 'font-manrope'
                                }`}
                              >
                                {isFree ? t('cart.free') : `${game.price}₴`}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
            <div className="w-[25%]">
              <div className="bg-[var(--color-background-8)] rounded-[20px] p-[20px] pt-[24px] flex flex-col gap-[24px] sticky top-[24px]">
                <div className="flex flex-col gap-[16px] text-[var(--color-background)]">
                  <div className="flex flex-col gap-[8px]">
                    {savings > 0 && (
                      <div className="flex items-center justify-between w-full">
                        <p className="text-[16px] font-normal">{t('cart.youSave')}</p>
                        <p className="text-[20px] font-bold">{savings.toFixed(0)}₴</p>
                      </div>
                    )}
                    <div className="flex items-center justify-between w-full">
                      <p className="text-[20px] font-normal">{t('cart.total')}</p>
                      <p className="text-[24px] font-bold font-manrope">
                        {totalPrice.toFixed(0)}₴
                      </p>
                    </div>
                  </div>
                  <p className="text-[16px] font-normal text-[var(--color-background-25)]">
                    {t('cart.taxNote')}
                  </p>
                </div>
                <div className="flex flex-col gap-[12px] w-full">
                  <button className="h-[48px] flex items-center justify-center px-[26px] py-[12px] rounded-[20px] bg-[var(--color-background-21)] text-[var(--color-night-background)] text-[20px] font-medium cursor-pointer hover:bg-[var(--color-background-22)] transition-colors">
                    {t('cart.proceedToCheckout')}
                  </button>
                  <button
                    onClick={handleContinueShopping}
                    className="h-[48px] flex items-center justify-center px-[26px] py-[12px] rounded-[20px] bg-[var(--color-background-16)] text-[var(--color-background)] text-[20px] font-medium cursor-pointer hover:bg-[var(--color-background-17)] transition-colors"
                  >
                    {t('cart.continueShopping')}
                  </button>
                  <button
                    onClick={clearCart}
                    className="h-[48px] flex items-center justify-center px-[26px] py-[12px] rounded-[20px] text-[var(--color-background-19)] text-[20px] font-medium cursor-pointer hover:text-red-400 transition-colors"
                  >
                    {t('cart.clearCart')}
                  </button>
                </div>
              </div>
            </div>
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
