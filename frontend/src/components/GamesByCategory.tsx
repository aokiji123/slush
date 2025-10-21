import { useNavigate } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { FaChevronRight } from 'react-icons/fa'
import type { GameData } from '@/api/types/game'

type Product = {
  id: string
  name: string
  slug: string
  price: number
  image: string
  salePrice?: number
}

type GamesByCategoryProps = {
  hits?: GameData[]
  newReleases?: GameData[]
  freeGames?: GameData[]
}

export const GamesByCategory = ({
  hits,
  newReleases,
  freeGames,
}: GamesByCategoryProps) => {
  const { t } = useTranslation(['store', 'common'])
  const transformGames = (games?: GameData[]): Product[] => {
    if (!games) return []
    return games.slice(0, 3).map((game) => ({
      id: game.id,
      name: game.name,
      slug: game.slug,
      price: game.price,
      image: game.mainImage,
      salePrice: game.salePrice > 0 ? game.salePrice : undefined,
    }))
  }

  return (
    <div className="mt-[64px] mb-[192px] flex flex-col gap-[16px] relative text-white z-10">
      <div className="flex flex-col lg:flex-row items-center justify-center gap-[16px] md:gap-[24px] w-full">
        <GamesColumn products={transformGames(hits)} title={t('home.topSellers')} />
        <GamesColumn
          products={transformGames(newReleases)}
          title={t('home.newReleases')}
        />
        <GamesColumn products={transformGames(freeGames)} title={t('home.freeGames')} />
      </div>
    </div>
  )
}

const GamesColumn = ({
  products,
  title,
}: {
  products: Array<Product>
  title: string
}) => {
  const navigate = useNavigate()
  const { t } = useTranslation('common')

  return (
    <div className="flex flex-col gap-[16px] md:gap-[24px] w-full lg:w-[33%]">
      <div
        className="flex items-center justify-between gap-[8px] text-[20px] md:text-[24px] cursor-pointer"
        onClick={() => {
          navigate({ to: '/catalog', search: { title } })
        }}
      >
        <p className="font-manrope">{title}</p>
        <FaChevronRight size={16} />
      </div>
      {products.map((product) => (
        <div
          className="bg-[var(--color-background-15)] rounded-[20px] overflow-hidden cursor-pointer"
          key={product.id}
          onClick={() => {
            navigate({ to: '/$slug', params: { slug: product.id } })
          }}
        >
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="w-full h-[180px] sm:h-[200px] md:h-[240px] object-cover"
          />

          <div className="p-[16px] md:p-[20px] md:pt-[16px] text-white text-left">
            <p className="text-[18px] md:text-[20px] font-bold font-manrope line-clamp-1">
              {product.name}
            </p>
            <div className="flex items-center gap-[8px]">
              {product.salePrice && (
                <p className="rounded-[20px] px-[8px] py-[4px] bg-[var(--color-background-10)] text-[14px] text-black">
                  -25%
                </p>
              )}
              {product.salePrice && (
                <p className="text-[16px] font-normal">{product.salePrice}₴</p>
              )}
              <p
                className={`text-[16px] font-normal ${
                  product.salePrice
                    ? 'line-through text-[var(--color-background-25)] font-extralight'
                    : ''
                }`}
              >
                {product.price ? `${product.price}₴` : t('common.free')}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
