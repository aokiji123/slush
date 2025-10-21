import {
  useDiscountedGames,
  useFreeGames,
  useGamesWithPriceLessThan,
  useHitsGames,
  useNewGames,
  useRecommendedGames,
} from '@/api/queries/useGame'
import { useTranslation } from 'react-i18next'
import { GamesByCategory, HomeProducts } from '@/components'

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
    top: '900px',
    left: '250px',
    width: '900px',
    height: '900px',
  },
  {
    id: 4,
    bottom: '-50px',
    left: '-250px',
    width: '900px',
    height: '900px',
  },
  {
    id: 5,
    bottom: '-250px',
    right: '-450px',
    width: '900px',
    height: '900px',
  },
]

export const Home = () => {
  const { t } = useTranslation('store')
  const { data: recommendedGames } = useRecommendedGames() // recommended
  const { data: under100 } = useGamesWithPriceLessThan(100) // cheaper than 100
  const { data: freeGames } = useFreeGames() // free
  const { data: hitsGames } = useHitsGames()
  const { data: newGames } = useNewGames() // new
  const { data: discountedGames } = useDiscountedGames() // special offers

  return (
    <div className="bg-[var(--color-night-background)] relative px-2 sm:px-0">
      <div className="container mx-auto py-[24px] z-10">
        {/* <div className="flex items-center gap-[16px] overflow-x-auto scrollbar-hide">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((_, index) => (
            <div
              key={index}
              className="w-[100px] sm:w-[140px] h-[50px] sm:h-[70px] rounded-lg cursor-pointer flex-shrink-0"
              style={{
                background: `url(/game-image.png) no-repeat center center`,
                backgroundSize: 'cover',
              }}
            />
          ))}
        </div> */}

        <HomeProducts
          products={discountedGames?.data}
          grid={3}
          title={t('home.onSale')}
        />

        <HomeProducts
          products={recommendedGames?.data}
          grid={4}
          title={t('home.featuredGames')}
        />

        <HomeProducts products={under100?.data} grid={4} title={t('home.under100')} />

        <GamesByCategory
          hits={hitsGames?.data}
          newReleases={newGames?.data}
          freeGames={freeGames?.data}
        />
      </div>

      {glowCoords.map((glow) => (
        <img
          key={glow.id}
          loading="lazy"
          src="/glow.png"
          alt="glow"
          className="absolute z-0"
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
