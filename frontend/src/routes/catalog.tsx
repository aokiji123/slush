import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { FaChevronDown, FaChevronUp } from 'react-icons/fa'
import { IoMdClose } from 'react-icons/io'
import { CustomCheckbox, Search, SortDropdown } from '@/components'
import { GridIcon, GridRowIcon } from '@/icons'
import { Product } from '@/components/Product'

type FilterOption = {
  label: string
  value: string
}

type FilterSection = {
  title: string
  key: string
  options: Array<FilterOption>
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

const filters: Array<FilterSection> = [
  {
    title: 'Жанри',
    key: 'genres',
    options: ['Екшн', 'Пригода', 'RPG', 'Стратегія'].map((label) => ({
      label,
      value: label,
    })),
  },
  {
    title: 'Платформи',
    key: 'platforms',
    options: ['PC', 'PS5', 'Xbox'].map((label) => ({ label, value: label })),
  },
  {
    title: 'Ціна',
    key: 'price',
    options: [
      'Безкоштовно',
      'До 100 гривень',
      'До 300 гривень',
      'До 600 гривень',
      'До 900 гривень',
      'Без обмежень',
      'Знижки',
    ].map((label) => ({ label, value: label })),
  },
  {
    title: 'Тип',
    key: 'types',
    options: ['Ігри', 'Додатки', 'Ігри-підказки'].map((label) => ({
      label,
      value: label,
    })),
  },
  {
    title: 'Особливості',
    key: 'features',
    options: ['Відкритий світ', 'Мультиплеєр', 'Singleplayer'].map((label) => ({
      label,
      value: label,
    })),
  },
  {
    title: 'Івенти',
    key: 'events',
    options: ['Відкритий світ', 'Мультиплеєр', 'Singleplayer'].map((label) => ({
      label,
      value: label,
    })),
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
]

export const Route = createFileRoute('/catalog')({
  validateSearch: (search: Record<string, unknown>) => {
    return {
      title: typeof search.title === 'string' ? search.title : undefined,
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { title } = Route.useSearch()
  return <Catalog title={title} />
}

const Catalog = ({ title }: { title?: string }) => {
  const [linear, setLinear] = useState(false)
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({})
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false)

  function handleSortDropdownOpen() {
    setIsSortDropdownOpen(!isSortDropdownOpen)
  }

  function toggleSection(key: string) {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <div className="bg-[var(--color-night-background)] relative overflow-hidden">
      <div className="container mx-auto relative z-20">
        <div className="flex items-center justify-center">
          <Search className="my-[16px] w-full" />
        </div>

        {title && (
          <h2 className="text-[48px] font-bold text-[var(--color-background)] mt-[32px]">
            {title}
          </h2>
        )}

        <div className="w-full flex gap-[24px] mt-[16px]">
          <div className="w-[25%]">
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
                  className="absolute top-8 left-[100px]"
                />
              )}
            </div>
            <div className="p-[16px] rounded-[20px] flex flex-col gap-[12px] bg-[var(--color-background-8)] mt-[16px]">
              <div className="flex items-center justify-between">
                <p className="text-[20px] text-[var(--color-background)]">
                  Фільтри
                </p>
                <button className="text-[16px] text-[var(--color-background-21)] cursor-pointer">
                  Скинути
                </button>
              </div>

              <div className="relative">
                <input
                  className="w-full h-[44px] border-1 border-[var(--color-background-16)] rounded-[20px] py-[10px] px-[16px] text-[16px] bg-[var(--color-background-14)] text-[var(--color-background)]"
                  placeholder="Пошук тегів..."
                />
                <IoMdClose
                  size={24}
                  className="absolute top-[50%] right-[16px] translate-y-[-50%] text-white cursor-pointer"
                />
              </div>

              {filters.map((filter) => {
                const isOpen = !!openSections[filter.key]
                const panelId = `filter-${filter.key}-options`
                return (
                  <div
                    key={filter.key}
                    className="px-[16px] text-[var(--color-background)] bg-[var(--color-background-14)] rounded-[20px] cursor-pointer"
                  >
                    <div
                      className="flex items-center justify-between gap-[8px] text-[16px] h-[40px]"
                      onClick={() => toggleSection(filter.key)}
                    >
                      <p>{filter.title}</p>
                      <button
                        aria-expanded={isOpen}
                        aria-controls={panelId}
                        className="p-[4px] text-[var(--color-background)] hover:opacity-90 cursor-pointer"
                      >
                        {isOpen ? (
                          <FaChevronUp size={16} />
                        ) : (
                          <FaChevronDown size={16} />
                        )}
                      </button>
                    </div>
                    {isOpen && (
                      <div
                        id={panelId}
                        className="flex flex-col gap-[8px] my-[16px]"
                      >
                        {filter.options.map((opt) => (
                          <div
                            key={opt.value}
                            className="flex items-center gap-[12px]"
                          >
                            <CustomCheckbox
                              id={`${filter.key}-${opt.value}`}
                              shape="circle"
                              size={20}
                              innerInset={1}
                            />
                            <label
                              htmlFor={`${filter.key}-${opt.value}`}
                              className="text-[16px] cursor-pointer"
                            >
                              {opt.label}
                            </label>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
          <div className="w-[75%] pb-[256px]">
            <div className="flex items-center justify-end text-[var(--color-background)]">
              <div className="flex items-center gap-[16px]">
                <p className="text-[var(--color-background-25)]">Вид:</p>
                <div onClick={() => setLinear(false)}>
                  <GridIcon
                    className={`cursor-pointer hover:text-[var(--color-background-23)] ${
                      !linear && 'text-[var(--color-background-23)]'
                    }`}
                  />
                </div>
                <div onClick={() => setLinear(true)}>
                  <GridRowIcon
                    className={`cursor-pointer hover:text-[var(--color-background-23)] ${
                      linear ? 'text-[var(--color-background-23)]' : ''
                    }`}
                  />
                </div>
              </div>
            </div>

            {linear ? (
              <div className="flex flex-col gap-[12px] mt-[16px]">
                {Array.from({ length: 9 }).map((_, index) => (
                  <Product key={index} linear={linear} />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-[24px] mt-[16px]">
                {Array.from({ length: 9 }).map((_, index) => (
                  <Product key={index} linear={linear} />
                ))}
              </div>
            )}
          </div>
        </div>
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
