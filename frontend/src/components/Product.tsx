import { useNavigate } from '@tanstack/react-router'

const product = {
  id: 1,
  name: 'Cyberpunk 2077',
  slug: 'cyberpunk-2077',
  image: '/cyberpunk.png',
  price: 1099,
  salePrice: 699,
}

export const Product = ({ linear }: { linear: boolean }) => {
  const navigate = useNavigate()

  return linear ? (
    <div
      className={`bg-[var(--color-background-15)] rounded-[20px] overflow-hidden cursor-pointer h-[88px]`}
      onClick={() => navigate({ to: '/$slug', params: { slug: product.slug } })}
    >
      <div className="w-full flex">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className={`w-[306px] h-[88px]`}
        />
        <div className="pl-[20px] p-[32px] w-full text-[var(--color-background)] flex items-center justify-between h-[88px]">
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
              {product.price}₴
            </p>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div
      className={`bg-[var(--color-background-15)] rounded-[20px] overflow-hidden cursor-pointer`}
      key={product.id}
    >
      <img
        src={product.image}
        alt={product.name}
        loading="lazy"
        className={`max-w-[1000px] w-full h-[400px] object-cover`}
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
            {product.price}₴
          </p>
        </div>
      </div>
    </div>
  )
}
