import { useNavigate } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import type { GameData } from '@/api/types/game'
import { useCartStore } from '@/lib/cartStore'
import { FaCheck } from 'react-icons/fa'
import { memo } from 'react'
import { OptimizedImage } from './OptimizedImage'

type ProductProps = {
  linear: boolean
  game: GameData
}

export const Product = memo(({ linear, game }: ProductProps) => {
  const navigate = useNavigate()
  const { t } = useTranslation('common')
  const { addToCart, isInCart } = useCartStore()
  
  const discountPercent = game.discountPercent || 0
  const hasDiscount = discountPercent > 0
  const isFree = game.price === 0
  const inCart = isInCart(game.id)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!inCart) {
      addToCart(game)
    }
  }

  const handleCardClick = () => {
    navigate({ to: '/$slug', params: { slug: game.slug } })
  }

  return linear ? (
    <div
      className={`bg-[var(--color-background-15)] rounded-[20px] overflow-hidden cursor-pointer h-[88px]`}
      onClick={handleCardClick}
    >
      <div className="w-full flex">
        <OptimizedImage
          src={game.mainImage}
          alt={game.name}
          loading="lazy"
          className={`w-[306px] h-[88px] object-cover`}
        />
        <div className="pl-[20px] p-[32px] w-full text-[var(--color-background)] flex items-center justify-between h-[88px]">
          <p className="text-[20px] font-bold font-manrope">{game.name}</p>
          <div className="flex items-center gap-[12px]">
            <div className="flex items-center gap-[8px]">
              {hasDiscount && (
                <p className="rounded-[20px] px-[8px] py-[4px] bg-[var(--color-background-10)] text-[14px] text-black">
                  -{discountPercent}%
                </p>
              )}
              {hasDiscount && (
                <p className="text-[16px] font-normal">{game.salePrice}₴</p>
              )}
              <p
                className={`text-[16px] font-normal ${
                  hasDiscount
                    ? 'line-through text-[var(--color-background-25)] font-extralight'
                    : ''
                }`}
              >
                {isFree ? t('common.free') : `${game.price}₴`}
              </p>
            </div>
            <button
              onClick={handleAddToCart}
              className={`px-[16px] py-[8px] rounded-[16px] text-[14px] font-medium transition-colors ${
                inCart
                  ? 'bg-[var(--color-background-16)] text-[var(--color-background)] cursor-default'
                  : 'bg-[var(--color-background-21)] text-[var(--color-night-background)] hover:bg-[var(--color-background-22)]'
              }`}
            >
              {inCart ? (
                <div className="flex items-center gap-[4px]">
                  <FaCheck size={12} />
                  <span>{t('product.inCart')}</span>
                </div>
              ) : (
                t('product.addToCart')
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div
      className={`bg-[var(--color-background-15)] rounded-[20px] overflow-hidden cursor-pointer relative group flex flex-col h-full`}
      key={game.id}
      onClick={handleCardClick}
    >
      <OptimizedImage
        src={game.mainImage}
        alt={game.name}
        loading="lazy"
        className={`max-w-[1000px] w-full h-[400px] object-cover flex-shrink-0`}
      />

      <div className="p-[20px] pt-[16px] text-white text-left flex flex-col flex-1">
        <p className="text-[20px] font-bold mb-[8px]">{game.name}</p>
        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-center gap-[8px]">
            {hasDiscount && (
              <p className="rounded-[20px] px-[8px] py-[4px] bg-[var(--color-background-10)] text-[14px] text-black">
                -{discountPercent}%
              </p>
            )}
            {hasDiscount && (
              <p className="text-[16px] font-normal">{game.salePrice}₴</p>
            )}
            <p
              className={`text-[16px] font-normal ${
                hasDiscount
                  ? 'line-through text-[var(--color-background-25)] font-extralight'
                  : ''
              }`}
            >
              {isFree ? t('common.free') : `${game.price}₴`}
            </p>
          </div>
          <button
            onClick={handleAddToCart}
            className={`px-[16px] py-[8px] rounded-[16px] text-[14px] font-medium transition-colors ${
              inCart
                ? 'bg-[var(--color-background-16)] text-[var(--color-background)] cursor-default'
                : 'bg-[var(--color-background-21)] text-[var(--color-night-background)] hover:bg-[var(--color-background-22)]'
            }`}
          >
            {inCart ? (
              <div className="flex items-center gap-[4px]">
                <FaCheck size={12} />
                <span>{t('product.inCart')}</span>
              </div>
            ) : (
              t('product.addToCart')
            )}
          </button>
        </div>
      </div>
    </div>
  )
})
