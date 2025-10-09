import { Banner, SortDropdown } from '@/components'
import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { FaChevronDown, FaChevronUp, FaStar } from 'react-icons/fa'
import { IoFilter } from 'react-icons/io5'

type DLCItem = {
  id: string
  name: string
  price: string | number
  description?: string
  image?: string
  isFree?: boolean
}

const sortOptions = [
  'За релевантністю',
  'Спочатку популярні',
  'Спочатку нові',
  'За оцінкою',
  'Від дешевих до дорогих',
  'Від дорогих до дешевих',
  'А - Я',
  'Я - А',
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
    bottom: '-50px',
    left: '-250px',
    width: '900px',
    height: '900px',
  },
]

const dlcItems: Array<DLCItem> = [
  {
    id: '1',
    name: 'Cyberpunk 2077 Bonus Content',
    price: 'Безкоштовно',
    description:
      '- Оригінальний саундтрек, Арт-бук із добіркою ігрових малюнків, Цифровий комікс Cyberpunk 2077: Your Voice, Книжкова збірка «Cyberpunk 2020», Шпалери',
    image: '/dlc.png',
  },
  {
    id: '2',
    name: 'Cyberpunk 2077 REDmod',
    price: 'Безкоштовно',
    description:
      'Офіційна підтримка модів для Cyberpunk 2077. Завантажуйте та створюйте власні модифікації для гри.',
    image: '/dlc.png',
  },
  {
    id: '3',
    name: 'Cyberpunk 2077: Ілюзія свободи',
    price: 549,
    description:
      'Повертайся в Найт-Сіті як найманець V для останньої роботи від нової клієнтки та зустрінь зі старими друзями. Ілюзія свободи — це шпигунський трилер з великою місією на Псовій біржі, новим району Найт-Сіті.',
    image: '/dlc.png',
  },
]

export const Route = createFileRoute('/$slug/dlc')({
  component: RouteComponent,
})

function RouteComponent() {
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false)

  function handleSortDropdownOpen() {
    setIsSortDropdownOpen(!isSortDropdownOpen)
  }

  return (
    <div className="w-full z-20">
      <Banner isDlc />

      <div className="container mx-auto mt-[48px]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-[20px] text-white">
            <input
              type="text"
              id="amount"
              placeholder="Пошук..."
              className="w-[400px] h-[44px] border-1 border-[var(--color-background-16)] rounded-[20px] py-[10px] px-[16px] text-[16px] bg-[var(--color-background-14)] text-[var(--color-background)]"
            />
            <div className="flex items-center gap-[8px]">
              <IoFilter size={24} />
              <p className="text-[16px]">Фільтри</p>
            </div>
          </div>
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
                className="absolute top-8 left-[20px] min-w-[240px]"
              />
            )}
          </div>
        </div>
        <div className="mt-[24px] flex flex-wrap gap-[24px] mb-[256px]">
          {dlcItems.map((item) => {
            return (
              <div className="w-[49%] min-h-[440px] rounded-[20px] bg-[var(--color-background-15)] overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-[215px] object-cover"
                />
                <div className="p-[20px] text-white flex flex-col gap-[14px] relative">
                  <div className="flex items-center gap-[8px] absolute top-[20px] right-[20px]">
                    <p className="text-[16px] font-bold">4.5</p>
                    <FaStar
                      className="text-[var(--color-background-10)]"
                      size={22}
                    />
                  </div>
                  <p className="text-[20px] font-bold font-manrope">
                    {item.name}
                  </p>
                  <div className="font-light">
                    <p>До цифрового набору включено:</p>
                    <p className="line-clamp-2">{item.description}</p>
                  </div>
                  <div className="w-full flex items-center justify-end gap-[16px] mt-[16px]">
                    <button className="h-[48px] flex items-center justify-center text-[20px] font-normal rounded-[20px] text-white cursor-pointer">
                      {item.price}
                    </button>
                    <button className="h-[48px] flex items-center justify-center py-[12px] px-[26px] text-[20px] font-normal rounded-[20px] bg-[var(--color-background-21)] text-[var(--color-night-background)] cursor-pointer">
                      У кошик
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
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
