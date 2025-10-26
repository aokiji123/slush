import { useNavigate } from '@tanstack/react-router'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import { useTranslation } from 'react-i18next'
import { useRef } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation } from 'swiper/modules'
import type { GameData } from '@/api/types/game'
import { OptimizedImage } from './OptimizedImage'
import { GamePriceDisplay } from './GamePriceDisplay'

// @ts-expect-error - Swiper CSS imports are valid
import 'swiper/css'
// @ts-expect-error - Swiper CSS imports are valid
import 'swiper/css/navigation'

type Props = {
  products?: GameData[]
  grid?: number
  title: string
}

export const HomeProducts = ({ products, grid = 3, title }: Props) => {
  const navigate = useNavigate()
  const { t } = useTranslation('common')
  const swiperRef = useRef<any>(null)

  if (!products || products.length === 0) {
    return null
  }

  return (
    <div className="mt-[64px] flex flex-col gap-[16px] relative z-10">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-[8px] text-white">
        <p className="text-[32px] font-manrope">{title}</p>
        <div
          className="flex items-center gap-[8px] text-[20px] cursor-pointer"
          onClick={() => {
            navigate({ to: '/catalog', search: { title } })
          }}
        >
          <p>{t('common.viewMore')}</p>
          <FaChevronRight size={12} />
        </div>
      </div>
      <Swiper
        modules={[Navigation]}
        spaceBetween={24}
        slidesPerView="auto"
        onSwiper={(swiper) => {
          swiperRef.current = swiper
        }}
        className="w-full"
      >
        {products.map((game) => (
          <SwiperSlide
            key={game.id}
            className={`${
              grid === 3
                ? 'w-[250px] sm:w-[300px] lg:w-[33%]'
                : 'w-[280px] sm:w-[320px] lg:w-[25%]'
            }`}
          >
            <div
              className="bg-[var(--color-background-15)] rounded-[20px] overflow-hidden cursor-pointer h-full"
              onClick={() => {
                navigate({
                  to: '/$slug',
                  params: { slug: game.id },
                })
              }}
            >
              <OptimizedImage
                src={game.mainImage}
                alt={game.name}
                loading="lazy"
                className={`w-full object-cover ${
                  grid === 3
                    ? 'h-[200px] sm:h-[240px] w-full'
                    : 'h-[300px] sm:h-[400px] w-full'
                }`}
              />

              <div className="p-[20px] pt-[16px] text-white text-left">
                <p className="text-[20px] font-bold font-manrope line-clamp-1">
                  {game.name}
                </p>
                <GamePriceDisplay
                  price={game.price}
                  salePrice={game.salePrice}
                  discountPercent={game.discountPercent}
                  freeText={t('common.free')}
                  size="sm"
                />
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <div 
        className="absolute bottom-[16px] -left-1 lg:-left-10 top-1/2 -translate-y-1/2 z-10 size-[24px] rounded-full bg-white flex items-center justify-center cursor-pointer"
        onClick={() => swiperRef.current?.slidePrev()}
      >
        <FaChevronLeft className="size-[12px]" />
      </div>
      <div 
        className="absolute bottom-[16px] -right-1 lg:-right-10 top-1/2 -translate-y-1/2 z-10 size-[24px] rounded-full bg-white flex items-center justify-center cursor-pointer"
        onClick={() => swiperRef.current?.slideNext()}
      >
        <FaChevronRight className="size-[12px]" />
      </div>
    </div>
  )
}
