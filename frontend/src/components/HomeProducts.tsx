import { useNavigate } from '@tanstack/react-router'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'

type Props = {
  products: Array<Product>
  grid?: number
  title: string
}

type Product = {
  id: number
  name: string
  slug: string
  price: number
  image: string
  salePrice?: number
}

export const HomeProducts = ({ products, grid = 3, title }: Props) => {
  const navigate = useNavigate()

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
          <p>Дивитись більше</p>
          <FaChevronRight size={12} />
        </div>
      </div>
      <div className="flex items-center gap-[8px] md:gap-[24px] overflow-x-auto scrollbar-hide">
        {products.map((product) => (
          <div
            className={`bg-[var(--color-background-15)] rounded-[20px] overflow-hidden cursor-pointer flex-shrink-0 ${
              grid === 3
                ? 'w-[250px] sm:w-[300px] lg:w-[33%]'
                : 'w-[280px] sm:w-[320px] lg:w-[25%]'
            }`}
            key={product.id}
            onClick={() => {
              navigate({
                to: '/$slug',
                params: { slug: product.slug },
              })
            }}
          >
            <img
              src={product.image}
              alt={product.name}
              loading="lazy"
              className={`w-full object-cover ${
                grid === 3 ? 'h-[200px] sm:h-[240px]' : 'h-[300px] sm:h-[400px]'
              }`}
            />

            <div className="p-[20px] pt-[16px] text-white text-left">
              <p className="text-[20px] font-bold font-manrope line-clamp-1">
                {product.name}
              </p>
              <div className="flex items-center gap-[8px]">
                {product.salePrice && (
                  <p className="rounded-[20px] px-[8px] py-[4px] bg-[var(--color-background-10)] text-[14px] text-black">
                    -25%
                  </p>
                )}
                {product.salePrice && (
                  <p className="text-[16px] font-normal">
                    {product.salePrice}₴
                  </p>
                )}
                <p
                  className={`text-[16px] font-normal ${
                    product.salePrice
                      ? 'line-through text-[var(--color-background-25)] font-extralight'
                      : ''
                  }`}
                >
                  {product.price}₴
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="absolute bottom-[16px] -left-1 lg:-left-10 top-1/2 -translate-y-1/2 z-10 size-[24px] rounded-full bg-white flex items-center justify-center cursor-pointer">
        <FaChevronLeft className="size-[12px]" />
      </div>
      <div className="absolute bottom-[16px] -right-1 lg:-right-10 top-1/2 -translate-y-1/2 z-10 size-[24px] rounded-full bg-white flex items-center justify-center cursor-pointer">
        <FaChevronRight className="size-[12px]" />
      </div>
    </div>
  )
}
