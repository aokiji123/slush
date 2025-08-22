import { GamesByCategory, HomeProducts } from '@/components'

const specialOffers = [
  {
    id: 1,
    name: 'Cyberpunk 2077',
    slug: 'cyberpunk-2077',
    image: '/cyberpunk.png',
    price: 1099,
  },
  {
    id: 2,
    name: 'Cyberpunk 2077',
    slug: 'cyberpunk-2077',
    image: '/cyberpunk.png',
    price: 1099,
    salePrice: 699,
  },
  {
    id: 3,
    name: 'Cyberpunk 2077',
    slug: 'cyberpunk-2077',
    image: '/cyberpunk.png',
    price: 1099,
  },
]

const recommendedGames = [
  {
    id: 1,
    name: 'Ghost of Tsushima',
    slug: 'ghost-of-tsushima',
    image: '/ghost-of-tsushima.png',
    price: 1699,
    salePrice: 1099,
  },
  {
    id: 2,
    name: 'Ghost of Tsushima',
    slug: 'ghost-of-tsushima',
    image: '/ghost-of-tsushima.png',
    price: 1699,
  },
  {
    id: 3,
    name: 'Ghost of Tsushima',
    slug: 'ghost-of-tsushima',
    image: '/ghost-of-tsushima.png',
    price: 1699,
  },
  {
    id: 4,
    name: 'Ghost of Tsushima',
    slug: 'ghost-of-tsushima',
    image: '/ghost-of-tsushima.png',
    price: 1699,
    salePrice: 1099,
  },
]

const under100 = [
  {
    id: 1,
    name: 'Placid Plastic Duck Simulator',
    slug: 'placid-plastic-duck-simulator',
    image: '/duck-simulator.png',
    price: 60,
  },
  {
    id: 2,
    name: 'Placid Plastic Duck Simulator',
    slug: 'placid-plastic-duck-simulator',
    image: '/duck-simulator.png',
    price: 60,
    salePrice: 30,
  },
  {
    id: 3,
    name: 'Placid Plastic Duck Simulator',
    slug: 'placid-plastic-duck-simulator',
    image: '/duck-simulator.png',
    price: 60,
  },
  {
    id: 4,
    name: 'Placid Plastic Duck Simulator',
    slug: 'placid-plastic-duck-simulator',
    image: '/duck-simulator.png',
    price: 60,
  },
]

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
  return (
    <div className="bg-[var(--color-night-background)] relative">
      <div className="container mx-auto py-[24px] z-10">
        <div className="flex items-center justify-center gap-[16px]">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((_, index) => (
            <div
              key={index}
              className="w-[140px] h-[70px] rounded-lg cursor-pointer"
              style={{
                background: `url(/game-image.png) no-repeat center center`,
                backgroundSize: 'cover',
              }}
            />
          ))}
        </div>

        <HomeProducts
          products={specialOffers}
          grid={3}
          title="Особливі пропозиції"
        />

        <HomeProducts
          products={recommendedGames}
          grid={4}
          title="Рекомендовані вам"
        />

        <HomeProducts products={under100} grid={4} title="До 100₴" />

        <GamesByCategory />
      </div>

      {glowCoords.map((glow) => (
        <img
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
