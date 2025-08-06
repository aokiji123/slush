import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'

type Props = {
  products: Array<Product>
  grid?: number
  title: string
}

type Product = {
  id: number
  name: string
  price: number
  image: string
  salePrice?: number
}

export const HomeProducts = ({ products, grid = 3, title }: Props) => {
  return (
    <div className="mt-[64px] flex flex-col gap-[16px] relative z-10">
      <div className="flex items-center justify-between gap-[8px] text-white">
        <p className="text-[32px]">{title}</p>
        <div className="flex items-center gap-[8px] text-[20px]">
          <p>Дивитись більше</p>
          <FaChevronRight size={12} />
        </div>
      </div>
      <div className="flex items-center justify-center gap-[24px]">
        {products.map((product) => (
          <div
            className={`bg-[var(--color-background-15)] rounded-[20px] overflow-hidden cursor-pointer ${
              grid === 3 ? 'w-[33%]' : 'w-[25%]'
            }`}
            key={product.id}
          >
            <img
              src={product.image}
              alt={product.name}
              loading="lazy"
              className={`max-w-[1000px] w-full h-full ${
                grid === 3 ? 'max-h-[240px]' : 'max-h-[400px]'
              }`}
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
      <div className="absolute bottom-[16px] -left-10 top-1/2 -translate-y-1/2 z-10 size-[24px] rounded-full bg-white flex items-center justify-center cursor-pointer">
        <FaChevronLeft className="size-[12px]" />
      </div>
      <div className="absolute bottom-[16px] -right-10 top-1/2 -translate-y-1/2 z-10 size-[24px] rounded-full bg-white flex items-center justify-center cursor-pointer">
        <FaChevronRight className="size-[12px]" />
      </div>
    </div>
  )
}
