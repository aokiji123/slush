import { useRef } from 'react'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Autoplay, EffectFade, Pagination } from 'swiper/modules'
import type { Swiper as SwiperType } from 'swiper'
import { useTranslation } from 'react-i18next'
import { Search } from './Search'
import { useNewGames } from '@/api/queries/useGame'
import { useGenreTranslation } from '@/utils/translateGenre'
import type { GameData } from '@/api/types/game'

// @ts-expect-error - Swiper CSS imports are valid
import 'swiper/css'
// @ts-expect-error - Swiper CSS imports are valid
import 'swiper/css/navigation'
// @ts-expect-error - Swiper CSS imports are valid
import 'swiper/css/effect-fade'
// @ts-expect-error - Swiper CSS imports are valid
import 'swiper/css/pagination'

export const Banner = ({ isDlc }: { isDlc?: boolean }) => {
  const { t } = useTranslation('store')
  const { data: newGames } = useNewGames()
  const translateGenre = useGenreTranslation()
  const swiperRef = useRef<SwiperType | null>(null)

  const games = newGames?.data || []
  const displayGames = games
    .filter((game: GameData) => game.name && !game.isDlc)
    .slice(0, 10)


  const formatPrice = (price: number) => {
    return `${price.toFixed(2)}₴`
  }

  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('uk-UA', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  }

  if (isDlc) {
    return (
      <div
        className="h-[520px] bg-[var(--color-background-15)] relative bg-cover bg-center z-10"
        style={{
          backgroundImage: 'url(/cyberpunk.png)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        }}
      >
        <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-black/60 to-transparent pointer-events-none z-[1]" />
        <div className="container mx-auto h-full flex flex-col items-center justify-center relative z-[2]">
          <Search className="md:px-0 px-[4px] absolute top-[16px] left-1/2 -translate-x-1/2 z-[3]" />
          <div className="flex flex-col items-left absolute bottom-[32px] left-1/2 -translate-x-1/2 max-w-[1460px] w-full z-[3] text-white">
            <p className="text-[20px] font-light opacity-60">
              {t('home.dlcFor')}
            </p>
            <p className="text-[32px] font-bold font-manrope">Cyberpunk 2077</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-[520px] bg-[var(--color-background-15)] relative z-10">
      {/* Search component moved outside Swiper to persist across banner changes */}
      <div className="absolute top-0 left-0 right-0 z-[100]">
        <div className="container mx-auto max-w-[1460px]">
          <div className="w-[500px] sm:w-[600px] lg:w-[800px] xl:w-[1400px] absolute top-[16px] left-1/2 -translate-x-1/2">
            <Search className="md:px-0 px-[4px]" />
          </div>
        </div>
      </div>
      
      <style>
        {`
          .swiper-pagination {
            bottom: 20px !important;
            z-index: 10 !important;
          }
          .swiper-pagination-bullet {
            background: white !important;
            opacity: 0.5 !important;
            width: 10px !important;
            height: 10px !important;
          }
          .swiper-pagination-bullet-active {
            opacity: 1 !important;
          }
        `}
      </style>
      <Swiper
        modules={[Navigation, Autoplay, EffectFade, Pagination]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
          dynamicBullets: true,
        }}
        loop={displayGames.length > 1}
        onSwiper={(swiper) => {
          swiperRef.current = swiper
        }}
        className="h-full"
      >
        {displayGames.map((game: GameData) => (
          <SwiperSlide key={game.id} className="h-full">
            <div
              className="h-full w-full bg-cover bg-center relative"
              style={{
                backgroundImage: `url(${game.mainImage || '/banner.png'})`,
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
              }}
            >
              <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-black/60 to-transparent pointer-events-none z-[1]" />
              <div className="container mx-auto h-full flex flex-col items-center justify-center relative z-[2]">
                <div className="flex justify-between items-center gap-[8px] absolute bottom-[56px] left-1/2 -translate-x-1/2 max-w-[1460px] w-full z-[3]">
                  <div className="flex flex-col sm:pl-0 pl-[16px]">
                    <p className="md:hidden block text-[24px] text-left text-white font-bold font-manrope">
                      {game.name}
                    </p>
                    {game.price > 0 && (
                      <div className="flex items-center gap-[16px]">
                        {game.discountPercent > 0 && (
                          <p className="rounded-[20px] px-[12px] py-[4px] bg-[var(--color-background-10)]">
                            -{game.discountPercent}%
                          </p>
                        )}
                        <div className="flex items-center gap-[8px]">
                          <p className="text-[32px] text-white font-bold font-manrope">
                            {formatPrice(
                              game.salePrice > 0 ? game.salePrice : game.price,
                            )}
                          </p>
                          {game.salePrice > 0 && game.discountPercent > 0 && (
                            <p className="text-[32px] text-[var(--color-background-25)] font-extralight line-through">
                              {formatPrice(game.price)}
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                    {game.price === 0 && (
                      <p className="text-[32px] text-white font-bold font-manrope">
                        {t('home.freeToPlay')}
                      </p>
                    )}
                    {game.saleDate && game.discountPercent > 0 && (
                      <p className="text-[16px] text-[var(--color-background-25)] font-normal text-left md:text-center">
                        {t('home.discountValidUntil')} {formatDate(game.saleDate)}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col gap-[8px] text-right w-full max-w-[470px] sm:pr-0 pr-[16px]">
                    <p className="md:block hidden text-[24px] text-white font-bold font-manrope">
                      {game.name}
                    </p>
                    {game.description && game.description !== 'Action RPG' && (
                      <p className="md:block hidden text-[16px] text-white font-normal line-clamp-2">
                        {game.description}
                      </p>
                    )}
                    {game.genre.length > 0 && (
                      <div className="md:flex hidden items-center gap-[8px] flex-wrap justify-end">
                        {game.genre.slice(0, 3).map((genre) => (
                          <span
                            key={genre}
                            className="text-[12px] rounded-[20px] py-[2px] px-[8px] font-medium text-white bg-[rgba(255,255,255,0.2)]"
                          >
                            {translateGenre(genre)}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {displayGames.length > 1 && (
        <>
          <button
            onClick={() => swiperRef.current?.slidePrev()}
            className="absolute bottom-[16px] left-1 md:-left-0 top-1/2 -translate-y-1/2 z-[999] size-[36px] rounded-full bg-white flex items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors"
            aria-label="Previous slide"
          >
            <FaChevronLeft className="w-[16px] h-[16px] text-black" />
          </button>
          <button
            onClick={() => swiperRef.current?.slideNext()}
            className="absolute bottom-[16px] right-1 md:-right-0 top-1/2 -translate-y-1/2 z-[999] size-[36px] rounded-full bg-white flex items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors"
            aria-label="Next slide"
          >
            <FaChevronRight className="w-[16px] h-[16px] text-black" />
          </button>
        </>
      )}
    </div>
  )
}
