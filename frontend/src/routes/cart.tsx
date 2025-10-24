import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { MdClose } from 'react-icons/md'
import { Search } from '@/components/Search'
import { useCartStore } from '@/lib/cartStore'
import { useAddToWishlist, useWishlist, useRemoveFromWishlist } from '@/api/queries/useWishlist'
import { usePurchaseGame } from '@/api/queries/usePurchase'
import { useWalletBalance } from '@/api/queries/useWallet'

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
  const purchaseGameMutation = usePurchaseGame()
  const { data: walletBalance } = useWalletBalance()
  const { data: wishlistData } = useWishlist()
  const removeFromWishlistMutation = useRemoveFromWishlist()

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

  const handleCheckout = async () => {
    if (!walletBalance) {
      alert('Unable to load wallet balance. Please try again.')
      return
    }

    const totalPrice = getCartTotal()
    
    // Check if user has sufficient balance
    if (walletBalance.amount < totalPrice) {
      alert(`Insufficient funds. You need ${(totalPrice - walletBalance.amount).toFixed(2)}₴ more.`)
      return
    }

    try {
      // Purchase each game in the cart
      for (const item of items) {
        const result = await purchaseGameMutation.mutateAsync({ 
          gameId: item.game.id,
          title: `Purchase: ${item.game.name}`
        })
        
        // Check if purchase was successful
        if (!result.success) {
          throw new Error(result.message || 'Purchase failed')
        }
      }
      
      // Remove purchased games from wishlist if they were in wishlist
      for (const item of items) {
        const isInWishlist = wishlistData?.data?.some(wishlistGame => wishlistGame.id === item.game.id)
        if (isInWishlist) {
          await removeFromWishlistMutation.mutateAsync({ gameId: item.game.id })
        }
      }
      
      // Clear cart after successful purchase
      clearCart()
      
      // Show success message and redirect
      alert('Purchase successful! Your games have been added to your library.')
      navigate({ to: '/library' })
    } catch (error) {
      console.error('Checkout failed:', error)
      alert(`Checkout failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  const totalPrice = getCartTotal()
  const savings = getCartSavings()
  const hasInsufficientFunds = walletBalance && walletBalance.amount < totalPrice

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
                    {walletBalance && (
                      <div className="flex items-center justify-between w-full">
                        <p className="text-[16px] font-normal">Wallet Balance</p>
                        <p className={`text-[18px] font-bold ${hasInsufficientFunds ? 'text-red-400' : 'text-green-400'}`}>
                          {walletBalance.amount.toFixed(2)}₴
                        </p>
                      </div>
                    )}
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
                    {hasInsufficientFunds && (
                      <div className="flex items-center justify-between w-full">
                        <p className="text-[14px] font-normal text-red-400">
                          Insufficient funds
                        </p>
                        <p className="text-[14px] font-bold text-red-400">
                          Need {(totalPrice - walletBalance.amount).toFixed(2)}₴ more
                        </p>
                      </div>
                    )}
                  </div>
                  <p className="text-[16px] font-normal text-[var(--color-background-25)]">
                    {t('cart.taxNote')}
                  </p>
                </div>
                <div className="flex flex-col gap-[12px] w-full">
                  <button 
                    onClick={handleCheckout}
                    disabled={hasInsufficientFunds || purchaseGameMutation.isPending || !walletBalance}
                    className={`h-[48px] flex items-center justify-center px-[26px] py-[12px] rounded-[20px] text-[20px] font-medium transition-colors ${
                      hasInsufficientFunds || !walletBalance
                        ? 'bg-gray-500 text-gray-300 cursor-not-allowed'
                        : purchaseGameMutation.isPending
                        ? 'bg-yellow-600 text-white cursor-wait'
                        : 'bg-[var(--color-background-21)] text-[var(--color-night-background)] cursor-pointer hover:bg-[var(--color-background-22)]'
                    }`}
                  >
                    {purchaseGameMutation.isPending 
                      ? 'Processing...' 
                      : hasInsufficientFunds 
                      ? 'Insufficient Funds' 
                      : t('cart.proceedToCheckout')
                    }
                  </button>
                  {hasInsufficientFunds ? (
                    <button
                      onClick={() => navigate({ to: '/settings/wallet' })}
                      className="h-[48px] flex items-center justify-center px-[26px] py-[12px] rounded-[20px] bg-green-600 text-white text-[20px] font-medium cursor-pointer hover:bg-green-700 transition-colors"
                    >
                      Add Funds to Wallet
                    </button>
                  ) : (
                    <button
                      onClick={handleContinueShopping}
                      className="h-[48px] flex items-center justify-center px-[26px] py-[12px] rounded-[20px] bg-[var(--color-background-16)] text-[var(--color-background)] text-[20px] font-medium cursor-pointer hover:bg-[var(--color-background-17)] transition-colors"
                    >
                      {t('cart.continueShopping')}
                    </button>
                  )}
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
