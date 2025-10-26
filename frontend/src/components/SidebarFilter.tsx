import { useState } from 'react'
import { FaChevronDown, FaChevronUp } from 'react-icons/fa'
import { IoMdClose } from 'react-icons/io'
import { SortDropdown } from './SortDropdown'
import { CustomCheckbox } from './CustomCheckbox'
import { useTranslation } from 'react-i18next'
import type { CatalogFilters, FilterSection, SortOption } from '@/types/catalog'

type SidebarFilterProps = {
  filters: CatalogFilters
  onFiltersChange: (filters: CatalogFilters) => void
  onSortChange: (sortBy: string) => void
  noSort?: boolean
}

const getSortOptions = (t: any): SortOption[] => [
  { label: t('sorting.relevance'), value: '' },
  { label: t('sorting.popular'), value: 'Rating:desc' },
  { label: t('sorting.newest'), value: 'ReleaseDate:desc' },
  { label: t('sorting.rating'), value: 'Rating:desc' },
  { label: t('sorting.priceLowHigh'), value: 'Price:asc' },
  { label: t('sorting.priceHighLow'), value: 'Price:desc' },
  { label: t('sorting.nameAZ'), value: 'Name:asc' },
  { label: t('sorting.nameZA'), value: 'Name:desc' },
]

const getFilters = (t: any): Array<FilterSection> => [
  {
    title: t('filters.genres'),
    key: 'genres',
    options: [
      { label: t('filters.genreOptions.Action'), value: t('filters.genreOptions.Action') },
      { label: t('filters.genreOptions.Adventure'), value: t('filters.genreOptions.Adventure') },
      { label: t('filters.genreOptions.RPG'), value: t('filters.genreOptions.RPG') },
      { label: t('filters.genreOptions.Strategy'), value: t('filters.genreOptions.Strategy') },
      { label: t('filters.genreOptions.Simulation'), value: t('filters.genreOptions.Simulation') },
      { label: t('filters.genreOptions.Sports'), value: t('filters.genreOptions.Sports') },
      { label: t('filters.genreOptions.Racing'), value: t('filters.genreOptions.Racing') },
      { label: t('filters.genreOptions.Fighting'), value: t('filters.genreOptions.Fighting') },
      { label: t('filters.genreOptions.Shooter'), value: t('filters.genreOptions.Shooter') },
      { label: t('filters.genreOptions.Puzzle'), value: t('filters.genreOptions.Puzzle') },
      { label: t('filters.genreOptions.Horror'), value: t('filters.genreOptions.Horror') },
      { label: t('filters.genreOptions.Platform'), value: t('filters.genreOptions.Platform') },
      { label: t('filters.genreOptions.Stealth'), value: t('filters.genreOptions.Stealth') },
      { label: t('filters.genreOptions.Survival'), value: t('filters.genreOptions.Survival') },
      { label: t('filters.genreOptions.Battle Royale'), value: t('filters.genreOptions.Battle Royale') },
      { label: t('filters.genreOptions.MOBA'), value: t('filters.genreOptions.MOBA') },
      { label: t('filters.genreOptions.MMO'), value: t('filters.genreOptions.MMO') },
      { label: t('filters.genreOptions.Indie'), value: t('filters.genreOptions.Indie') },
      { label: t('filters.genreOptions.Casual'), value: t('filters.genreOptions.Casual') },
      { label: t('filters.genreOptions.Educational'), value: t('filters.genreOptions.Educational') },
    ],
  },
  {
    title: t('filters.platforms'),
    key: 'platforms',
    options: [
      { label: t('filters.platformOptions.pc'), value: 'pc' },
      { label: t('filters.platformOptions.ps5'), value: 'ps5' },
      { label: t('filters.platformOptions.ps4'), value: 'ps4' },
      { label: t('filters.platformOptions.xbox'), value: 'xbox' },
      { label: t('filters.platformOptions.xbox-one'), value: 'xbox-one' },
      { label: t('filters.platformOptions.switch'), value: 'switch' },
      { label: t('filters.platformOptions.mac'), value: 'mac' },
      { label: t('filters.platformOptions.linux'), value: 'linux' },
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
    ],
  },
  {
    title: t('filters.features'),
    key: 'onSale',
    options: [
      { label: t('filters.priceOptions.discounts'), value: 'discounts' },
    ],
  },
  {
    title: t('filters.type'),
    key: 'isDlc',
    options: [
      { label: t('filters.typeOptions.games'), value: 'false' },
      { label: t('filters.typeOptions.addons'), value: 'true' },
    ],
  },
]

export const SidebarFilter = ({ 
  filters, 
  onFiltersChange, 
  onSortChange, 
  noSort = false 
}: SidebarFilterProps) => {
  const { t } = useTranslation('common')
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({})
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false)
  const [searchText, setSearchText] = useState(filters.search || '')
  const [selectedPrice, setSelectedPrice] = useState<string | undefined>(undefined)
  const sortOptions = getSortOptions(t)
  const filterSections = getFilters(t)

  function handleSortDropdownOpen() {
    setIsSortDropdownOpen(!isSortDropdownOpen)
  }

  function toggleSection(key: string) {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  function handleSortChange(sortValue: string) {
    onSortChange(sortValue)
    setIsSortDropdownOpen(false)
  }

  function handleFilterChange(key: keyof CatalogFilters, value: any) {
    onFiltersChange({
      ...filters,
      [key]: value,
      page: 1, // Reset to first page when filters change
    })
  }

  function handleArrayFilterChange(key: 'genres' | 'platforms', value: string, checked: boolean) {
    const currentArray = filters[key] || []
    const newArray = checked
      ? [...currentArray, value]
      : currentArray.filter(item => item !== value)
    
    handleFilterChange(key, newArray.length > 0 ? newArray : undefined)
  }

  function handlePriceFilterChange(priceValue: string) {
    setSelectedPrice(priceValue)
    
    if (priceValue === 'unlimited') {
      handleFilterChange('minPrice', undefined)
      handleFilterChange('maxPrice', undefined)
      return
    }

    // Handle specific price ranges
    const priceRanges: Record<string, { min?: number; max?: number }> = {
      free: { min: 0, max: 0 },
      under100: { min: 0, max: 100 },
      under300: { min: 0, max: 300 },
      under600: { min: 0, max: 600 },
      under900: { min: 0, max: 900 },
    }

    const range = priceRanges[priceValue]
    handleFilterChange('minPrice', range.min)
    handleFilterChange('maxPrice', range.max)
  }

  function handleDiscountToggle(checked: boolean) {
    handleFilterChange('onSale', checked)
  }

  function handleSearchChange(value: string) {
    setSearchText(value)
    handleFilterChange('search', value || undefined)
  }

  function handleResetFilters() {
    onFiltersChange({
      search: undefined,
      genres: undefined,
      platforms: undefined,
      minPrice: undefined,
      maxPrice: undefined,
      onSale: undefined,
      isDlc: undefined,
      page: 1,
      limit: 20,
      sortBy: undefined,
    })
    setSearchText('')
    setSelectedPrice(undefined)
  }

  function isFilterSelected(key: keyof CatalogFilters | 'price', value: any): boolean {
    if (key === 'genres' || key === 'platforms') {
      return filters[key]?.includes(value) || false
    }
    if (key === 'isDlc') {
      return filters[key] === (value === 'true')
    }
    if (key === 'onSale') {
      return filters[key] === true
    }
    if (key === 'price') {
      // Use selectedPrice state to determine which option is selected
      return selectedPrice === value
    }
    return false
  }

  function getCurrentSortLabel() {
    const currentSort = sortOptions.find(option => option.value === filters.sortBy)
    return currentSort?.label || t('sorting.relevance')
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
            <p>{getCurrentSortLabel()}</p>

            {isSortDropdownOpen ? (
              <FaChevronUp size={16} />
            ) : (
              <FaChevronDown size={16} />
            )}
          </button>

          {isSortDropdownOpen && (
            <SortDropdown
              options={sortOptions.map(opt => opt.label)}
              onSelect={(label) => {
                const option = sortOptions.find(opt => opt.label === label)
                if (option) handleSortChange(option.value)
              }}
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
          <button 
            className="text-[16px] text-[var(--color-background-21)] cursor-pointer"
            onClick={handleResetFilters}
          >
            {t('filters.reset')}
          </button>
        </div>

        <div className="relative">
          <input
            className="w-full h-[44px] border-1 border-[var(--color-background-16)] rounded-[20px] py-[10px] px-[16px] text-[16px] bg-[var(--color-background-14)] text-[var(--color-background)]"
            placeholder={t('search.tagsPlaceholder')}
            value={searchText}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
          {searchText && (
            <IoMdClose
              size={24}
              className="absolute top-[50%] right-[16px] translate-y-[-50%] text-white cursor-pointer"
              onClick={() => handleSearchChange('')}
            />
          )}
        </div>

        {filterSections.map((filter) => {
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
                  {filter.options.map((opt) => {
                    const isSelected = isFilterSelected(filter.key, opt.value)
                    
                    return (
                      <div
                        key={opt.value}
                        className="flex items-center gap-[12px]"
                      >
                        <CustomCheckbox
                          id={`${filter.key}-${opt.value}`}
                          shape="circle"
                          size={20}
                          innerInset={1}
                          checked={isSelected}
                          onChange={(checked) => {
                            if (filter.key === 'price') {
                              // For price filters, always select (radio button behavior)
                              handlePriceFilterChange(opt.value)
                            } else if (filter.key === 'genres' || filter.key === 'platforms') {
                              handleArrayFilterChange(filter.key, opt.value, checked)
                            } else if (filter.key === 'isDlc') {
                              handleFilterChange('isDlc', checked ? (opt.value === 'true') : undefined)
                            } else if (filter.key === 'onSale') {
                              handleDiscountToggle(checked)
                            }
                          }}
                        />
                        <label
                          htmlFor={`${filter.key}-${opt.value}`}
                          className="text-[16px] cursor-pointer"
                        >
                          {opt.label}
                        </label>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </>
  )
}
