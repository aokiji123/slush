import { useNavigate } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import type { GameData } from '@/api/types/game'

type ProductProps = {
  linear: boolean
  game: GameData
}

export const Product = ({ linear, game }: ProductProps) => {
  const navigate = useNavigate()
  const { t } = useTranslation('common')
  
  const discountPercent = game.discountPercent || 0
  const hasDiscount = discountPercent > 0
  const isFree = game.price === 0

  return linear ? (
    <div
      className={`bg-[var(--color-background-15)] rounded-[20px] overflow-hidden cursor-pointer h-[88px]`}
      onClick={() => navigate({ to: '/$slug', params: { slug: game.slug } })}
    >
      <div className="w-full flex">
        <img
          src={game.mainImage}
          alt={game.name}
          loading="lazy"
          className={`w-[306px] h-[88px] object-cover`}
        />
        <div className="pl-[20px] p-[32px] w-full text-[var(--color-background)] flex items-center justify-between h-[88px]">
          <p className="text-[20px] font-bold font-manrope">{game.name}</p>
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
        </div>
      </div>
    </div>
  ) : (
    <div
      className={`bg-[var(--color-background-15)] rounded-[20px] overflow-hidden cursor-pointer`}
      key={game.id}
      onClick={() => navigate({ to: '/$slug', params: { slug: game.slug } })}
    >
      <img
        src={game.mainImage}
        alt={game.name}
        loading="lazy"
        className={`max-w-[1000px] w-full h-[400px] object-cover`}
      />

      <div className="p-[20px] pt-[16px] text-white text-left">
        <p className="text-[20px] font-bold">{game.name}</p>
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
      </div>
    </div>
  )
}
