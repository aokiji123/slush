import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { MdClose } from 'react-icons/md'
import { Search } from '@/components/Search'

export const Route = createFileRoute('/cart')({
  component: RouteComponent,
})

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
    bottom: '-50px',
    left: '-250px',
    width: '900px',
    height: '900px',
  },
]

const product = {
  id: 1,
  image: '/baldurs-gate-3.png',
  name: "Baldur's Gate 3",
  slug: 'baldurs-gate-3',
  price: 1000,
  salePrice: 800,
}

function RouteComponent() {
  const navigate = useNavigate()

  return (
    <div className="bg-[var(--color-night-background)] relative overflow-hidden">
      <div className="container mx-auto relative z-20">
        <div className="flex items-center justify-center">
          <Search className="my-[16px] w-full" />
        </div>

        <h2 className="text-[48px] font-bold text-[var(--color-background)] mt-[32px] font-manrope">
          Мій кошик
        </h2>

        <div className="flex gap-[24px] mt-[16px]">
          <div className="w-[75%] pb-[256px]">
            <div className="flex flex-col gap-[12px]">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  className={`bg-[var(--color-background-15)] rounded-[20px] overflow-hidden cursor-pointer h-[128px]`}
                  onClick={() =>
                    navigate({ to: '/$slug', params: { slug: product.slug } })
                  }
                  key={index}
                >
                  <div className="w-full flex">
                    <img
                      src={product.image}
                      alt={product.name}
                      loading="lazy"
                      className={`w-[306px] h-[128px]`}
                    />
                    <div className="pt-[16px] p-[20px] w-full text-[var(--color-background)] flex flex-col justify-between h-[128px]">
                      <div className="flex flex-row items-center justify-between h-full">
                        <p className="text-[20px] font-bold font-manrope">
                          {product.name}
                        </p>
                        <MdClose className="text-[24px] text-[var(--color-background-25)] cursor-pointer" />
                      </div>
                      <div className="flex flex-row items-center justify-between h-full">
                        <button className="text-[16px] text-[var(--color-background-21)] font-normal cursor-pointer">
                          Перемістити до Бажаного
                        </button>
                        <div className="flex items-center gap-[16px]">
                          {product.salePrice && (
                            <p className="rounded-[20px] px-[8px] py-[4px] bg-[var(--color-background-10)] text-[16px] text-black">
                              -25%
                            </p>
                          )}
                          {product.salePrice && (
                            <p className="text-[24px] font-normal font-manrope">
                              {product.salePrice}₴
                            </p>
                          )}
                          <p
                            className={`text-[20px] font-normal ${
                              product.salePrice
                                ? 'line-through text-[var(--color-background-25)] font-extralight'
                                : 'font-manrope'
                            }`}
                          >
                            {product.price}₴
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="w-[25%]">
            <div className="bg-[var(--color-background-8)] rounded-[20px] p-[20px] pt-[24px] flex flex-col gap-[24px]">
              <div className="flex flex-col gap-[16px] text-[var(--color-background)]">
                <div className="flex flex-col gap-[8px]">
                  <div className="flex items-center justify-between w-full">
                    <p className="text-[16px] font-normal">Ви заощадите</p>
                    <p className="text-[20px] font-bold">1000₴</p>
                  </div>
                  <div className="flex items-center justify-between w-full">
                    <p className="text-[20px] font-normal">Усього</p>
                    <p className="text-[24px] font-bold font-manrope">1000₴</p>
                  </div>
                </div>
                <p className="text-[16px] font-normal text-[var(--color-background-25)]">
                  Якщо застосовно, податок із продажу буде розраховано в процесі
                  оплати.
                </p>
              </div>
              <div className="flex flex-col gap-[12px] w-full">
                <button className="h-[48px] flex items-center justify-center px-[26px] py-[12px] rounded-[20px] bg-[var(--color-background-21)] text-[var(--color-night-background)] text-[20px] font-medium cursor-pointer">
                  Перейти до оплати
                </button>
                <button className="h-[48px] flex items-center justify-center px-[26px] py-[12px] rounded-[20px] bg-[var(--color-background-16)] text-[var(--color-background)] text-[20px] font-medium cursor-pointer">
                  Продовжити покупки
                </button>
                <button className="h-[48px] flex items-center justify-center px-[26px] py-[12px] rounded-[20px] text-[var(--color-background-19)] text-[20px] font-medium cursor-pointer">
                  Очистити кошик
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {glowCoords.map((glow) => (
        <img
          key={glow.id}
          loading="lazy"
          src="/glow.png"
          alt="glow"
          className="absolute z-0 opacity-50"
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
