import { useState } from 'react'
import { FaChevronDown, FaChevronUp } from 'react-icons/fa'
import { IoMdClose } from 'react-icons/io'
import { SortDropdown } from './SortDropdown'
import { CustomCheckbox } from './CustomCheckbox'
import { useTranslation } from 'react-i18next'

type FilterOption = {
  label: string
  value: string
}

type FilterSection = {
  title: string
  key: string
  options: Array<FilterOption>
}

const getSortOptions = (t: any) => [
  t('sorting.relevance'),
  t('sorting.popular'),
  t('sorting.newest'),
  t('sorting.rating'),
  t('sorting.priceLowHigh'),
  t('sorting.priceHighLow'),
  t('sorting.nameAZ'),
  t('sorting.nameZA'),
]

const getFilters = (t: any): Array<FilterSection> => [
  {
    title: t('filters.genres'),
    key: 'genres',
    options: [
      { label: t('filters.genreOptions.action'), value: 'action' },
      { label: t('filters.genreOptions.adventure'), value: 'adventure' },
      { label: t('filters.genreOptions.rpg'), value: 'rpg' },
      { label: t('filters.genreOptions.strategy'), value: 'strategy' },
    ],
  },
  {
    title: t('filters.platforms'),
    key: 'platforms',
    options: [
      { label: t('filters.platformOptions.pc'), value: 'pc' },
      { label: t('filters.platformOptions.ps5'), value: 'ps5' },
      { label: t('filters.platformOptions.xbox'), value: 'xbox' },
    ],
  },
  {
    title: t('filters.price'),
    key: 'price',
    options: [
      { label: t('filters.priceOptions.free'), value: 'free' },
      { label: t('filters.priceOptions.under100'), value: 'under100' },
      { label: t('filters.priceOptions.under300'), value: 'under300' },
      { label: t('filters.priceOptions.under600'), value: 'under600' },
      { label: t('filters.priceOptions.under900'), value: 'under900' },
      { label: t('filters.priceOptions.unlimited'), value: 'unlimited' },
      { label: t('filters.priceOptions.discounts'), value: 'discounts' },
    ],
  },
  {
    title: t('filters.type'),
    key: 'types',
    options: [
      { label: t('filters.typeOptions.games'), value: 'games' },
      { label: t('filters.typeOptions.addons'), value: 'addons' },
      { label: t('filters.typeOptions.hints'), value: 'hints' },
    ],
  },
  {
    title: t('filters.features'),
    key: 'features',
    options: [
      { label: t('filters.featureOptions.openWorld'), value: 'openWorld' },
      { label: t('filters.featureOptions.multiplayer'), value: 'multiplayer' },
      { label: t('filters.featureOptions.singleplayer'), value: 'singleplayer' },
    ],
  },
  {
    title: t('filters.events'),
    key: 'events',
    options: [
      { label: t('filters.featureOptions.openWorld'), value: 'openWorld' },
      { label: t('filters.featureOptions.multiplayer'), value: 'multiplayer' },
      { label: t('filters.featureOptions.singleplayer'), value: 'singleplayer' },
    ],
  },
]

export const SidebarFilter = ({ noSort }: { noSort?: boolean }) => {
  const { t } = useTranslation('common')
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({})
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false)
  const sortOptions = getSortOptions(t)
  const filters = getFilters(t)

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
            {t('sorting.label')}{' '}
          </span>
          <button
            className="text-[var(--color-background)] text-[16px] flex items-center gap-[4px] cursor-pointer"
            onClick={handleSortDropdownOpen}
          >
            <p>{t('sorting.relevance')}</p>

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
          <p className="text-[20px] text-[var(--color-background)] font-manrope">
            {t('filters.title')}
          </p>
          <button className="text-[16px] text-[var(--color-background-21)] cursor-pointer">
            {t('filters.reset')}
          </button>
        </div>

        <div className="relative">
          <input
            className="w-full h-[44px] border-1 border-[var(--color-background-16)] rounded-[20px] py-[10px] px-[16px] text-[16px] bg-[var(--color-background-14)] text-[var(--color-background)]"
            placeholder={t('search.tagsPlaceholder')}
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
