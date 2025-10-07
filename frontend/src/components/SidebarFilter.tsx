import { useState } from 'react'
import { FaChevronDown, FaChevronUp } from 'react-icons/fa'
import { IoMdClose } from 'react-icons/io'
import { SortDropdown } from './SortDropdown'
import { CustomCheckbox } from './CustomCheckbox'

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

export const SidebarFilter = ({ noSort }: { noSort?: boolean }) => {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({})
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false)

  function handleSortDropdownOpen() {
    setIsSortDropdownOpen(!isSortDropdownOpen)
  }

  function toggleSection(key: string) {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <>
      {!noSort && (
        <div className="flex items-center gap-[8px] relative mb-[16px]">
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
      )}
      <div className="p-[16px] rounded-[20px] flex flex-col gap-[12px] bg-[var(--color-background-8)]">
        <div className="flex items-center justify-between">
          <p className="text-[20px] text-[var(--color-background)]">Фільтри</p>
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
                <div id={panelId} className="flex flex-col gap-[8px] my-[16px]">
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
    </>
  )
}
