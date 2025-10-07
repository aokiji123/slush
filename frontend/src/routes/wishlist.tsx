import { createFileRoute } from '@tanstack/react-router'
import { FaChevronDown, FaChevronUp, FaStar } from 'react-icons/fa'
import { useState } from 'react'
import { MdClose } from 'react-icons/md'
import { Search, SidebarFilter, SortDropdown } from '@/components'

export const Route = createFileRoute('/wishlist')({
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

const sortOptions = [
  'Спочатку знижки',
  'За релевантністю',
  'Спочатку популярні',
  'Спочатку нові',
  'За оцінкою',
  'Від дешевих до дорогих',
  'Від дорогих до дешевих',
  'А - Я',
  'Я - А',
]

const product = {
  name: "Baldur's Gate 3",
  image: '/baldurs-gate-3.png',
  genres: ['рпг', 'екшн', 'd&d', 'fantasy', 'відкритий світ'],
  price: 1000,
  salePrice: 900,
  rating: 4.5,
}

function RouteComponent() {
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false)

  function handleSortDropdownOpen() {
    setIsSortDropdownOpen(!isSortDropdownOpen)
  }

  return (
    <div className="bg-[var(--color-night-background)] relative overflow-hidden">
      <div className="container mx-auto relative z-20">
        <div className="flex items-center justify-center">
          <Search className="my-[16px] w-full" />
        </div>

        <h2 className="text-[48px] font-bold text-[var(--color-background)] mt-[32px]">
          Мій список бажаного
        </h2>

        <div className="flex gap-[24px] mt-[16px]">
          <div className="w-[25%]">
            <SidebarFilter noSort />
          </div>

          <div className="w-[75%] pb-[256px]">
            <div className="bg-[var(--color-background-8)] p-[20px] rounded-[20px] flex flex-col gap-[16px]">
              <div className="flex items-center justify-between">
                <input
                  className="w-full max-w-[420px] h-[44px] border-1 border-[var(--color-background-16)] rounded-[20px] py-[10px] px-[16px] text-[16px] bg-[var(--color-background-14)] text-[var(--color-background)]"
                  placeholder="Пошук у Бажаному..."
                />
                <div className="flex items-center gap-[8px] relative">
                  <span className="text-[var(--color-background-25)] text-[16px] font-extralight">
                    Сортування:{' '}
                  </span>
                  <button
                    className="text-[var(--color-background)] text-[16px] flex items-center gap-[4px] cursor-pointer"
                    onClick={handleSortDropdownOpen}
                  >
                    <p>За релевантністю</p>

                    {isSortDropdownOpen ? (
                      <FaChevronUp size={16} />
                    ) : (
                      <FaChevronDown size={16} />
                    )}
                  </button>

                  {isSortDropdownOpen && (
                    <SortDropdown
                      options={sortOptions}
                      className="absolute top-8 left-[100px] min-w-[240px]"
                    />
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-[8px]">
                {Array.from({ length: 7 }).map((_, index) => (
                  <div
                    key={index}
                    className="bg-[var(--color-background-15)] rounded-[20px] p-[16px] flex gap-[20px]"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-[320px] h-[145px] rounded-[12px]"
                    />
                    <div className="flex flex-col gap-[20px] w-full">
                      <div className="flex flex-col gap-[12px]">
                        <div className="flex items-center justify-between">
                          <p className="text-[24px] font-bold text-[var(--color-background)]">
                            Baldur's Gate 3
                          </p>
                          <MdClose
                            className="text-[var(--color-background-19)] cursor-pointer"
                            size={24}
                          />
                        </div>
                        <div className="flex items-center gap-[8px]">
                          {product.genres.map((genre) => (
                            <p
                              key={genre}
                              className="text-[14px] rounded-[20px] py-[4px] px-[12px] font-medium text-[var(--color-background-25)] bg-[var(--color-background-18)]"
                            >
                              {genre}
                            </p>
                          ))}
                          <p className="text-[14px] rounded-[20px] py-[4px] px-[12px] font-light text-[var(--color-background-25)] bg-[var(--color-background-18)]">
                            +3
                          </p>
                        </div>
                      </div>
                      <div className="flex justify-between w-full">
                        <div className="flex items-center gap-[4px] h-[24px] justify-center">
                          <p className="text-[24px] font-medium text-[var(--color-background)]">
                            {product.rating}
                          </p>
                          <FaStar
                            size={24}
                            className="text-[var(--color-background-10)]"
                          />
                        </div>
                        <div>
                          <div className="flex items-center gap-[18px]">
                            <div>
                              <div className="flex items-center gap-[16px] h-[24px] justify-end">
                                <p className="px-[8px] py-[4px] rounded-[20px] bg-[var(--color-background-10)] text-[var(--color-night-background)] h-[24px] flex items-center justify-center">
                                  {' '}
                                  -10%
                                </p>
                                <div className="flex items-center gap-[8px]">
                                  <p className="text-[20px] font-bold text-[var(--color-background)]">
                                    {product.price}₴
                                  </p>
                                  <p className="text-[20px] font-normal line-through text-[var(--color-background-25)]">
                                    {product.salePrice}₴
                                  </p>
                                </div>
                              </div>
                              <p className="text-[14px] font-normal text-[var(--color-background-25)]">
                                Знижка діє до 24.07.2024 10:00
                              </p>
                            </div>
                            <div className="h-[48px] flex items-center justify-center py-[12px] px-[26px] text-[20px] font-medium rounded-[20px] bg-[var(--color-background-21)] text-[var(--color-night-background)]">
                              <p>У кошик</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
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
