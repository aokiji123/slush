import { useNavigate } from '@tanstack/react-router'
import { FaChevronRight } from 'react-icons/fa'

type Product = {
  id: number
  name: string
  slug: string
  price: number
  image: string
  salePrice?: number
}

const bestSellers = [
  {
    id: 1,
    name: "Baldur's Gate 3",
    slug: 'baldurs-gate-3',
    image: '/baldurs-gate-3.png',
    price: 899,
  },
  {
    id: 2,
    name: "Baldur's Gate 3",
    slug: 'baldurs-gate-3',
    image: '/baldurs-gate-3.png',
    price: 899,
    salePrice: 699,
  },
  {
    id: 3,
    name: "Baldur's Gate 3",
    slug: 'baldurs-gate-3',
    image: '/baldurs-gate-3.png',
    price: 899,
  },
]

const newReleases = [
  {
    id: 1,
    name: 'Destiny 2: The Final Shape',
    slug: 'destiny-2',
    image: '/destiny-2.png',
    price: 1299,
  },
  {
    id: 2,
    name: 'Destiny 2: The Final Shape',
    slug: 'destiny-2',
    image: '/destiny-2.png',
    price: 1299,
  },
  {
    id: 3,
    name: 'Destiny 2: The Final Shape',
    slug: 'destiny-2',
    image: '/destiny-2.png',
    price: 1299,
    salePrice: 999,
  },
]

const freeToPlay = [
  {
    id: 1,
    name: 'Counter-Strike 2',
    slug: 'cs-2',
    image: '/cs.png',
    price: 0,
  },
  {
    id: 2,
    name: 'Counter-Strike 2',
    slug: 'cs-2',
    image: '/cs.png',
    price: 0,
  },
  {
    id: 3,
    name: 'Counter-Strike 2',
    slug: 'cs-2',
    image: '/cs.png',
    price: 0,
  },
]

export const GamesByCategory = () => {
  return (
    <div className="mt-[64px] mb-[192px] flex flex-col gap-[16px] relative text-white z-10">
      <div className="flex items-center justify-center gap-[24px] w-full">
        <GamesColumn products={bestSellers} title="Хіти продажу" />
        <GamesColumn products={newReleases} title="Нові релізи" />
        <GamesColumn products={freeToPlay} title="Безкоштовні" />
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

  return (
    <div className="flex flex-col gap-[24px] w-[33%]">
      <div
        className="flex items-center justify-between gap-[8px] text-[24px] cursor-pointer"
        onClick={() => {
          navigate({ to: '/catalog', search: { title } })
        }}
      >
        <p>{title}</p>
        <FaChevronRight size={16} />
      </div>
      {products.map((product) => (
        <div
          className="bg-[var(--color-background-15)] rounded-[20px] overflow-hidden cursor-pointer"
          key={product.id}
          onClick={() => {
            navigate({ to: '/$slug', params: { slug: product.slug } })
          }}
        >
          <img
            src={product.image}
            alt={product.name}
            className="max-w-[1000px] w-full h-full max-h-[240px]"
          />

          <div className="p-[20px] pt-[16px] text-white text-left">
            <p className="text-[20px] font-bold">{product.name}</p>
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
                {product.price ? `${product.price}₴` : 'Безкоштовно'}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
