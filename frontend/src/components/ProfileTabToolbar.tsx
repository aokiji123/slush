import { useState } from 'react'
import { FaChevronDown, FaChevronUp, FaFilter } from 'react-icons/fa'
import { useTranslation } from 'react-i18next'

export interface SortOption {
  label: string
  value: string
}

export interface ProfileTabToolbarProps {
  searchText: string
  onSearchChange: (text: string) => void
  searchPlaceholder: string
  sortBy: string
  onSortChange: (sortBy: string) => void
  sortOptions: SortOption[]
  showFilters?: boolean
  onFiltersClick?: () => void
  className?: string
}

export const ProfileTabToolbar = ({
  searchText,
  onSearchChange,
  searchPlaceholder,
  sortBy,
  onSortChange,
  sortOptions,
  showFilters = false,
  onFiltersClick,
  className = ''
}: ProfileTabToolbarProps) => {
  const { t } = useTranslation('common')
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false)

  const handleSortDropdownToggle = () => {
    setIsSortDropdownOpen(!isSortDropdownOpen)
  }

  const handleSortSelect = (value: string) => {
    onSortChange(value)
    setIsSortDropdownOpen(false)
  }

  const currentSortLabel = sortOptions.find(opt => opt.value === sortBy)?.label || t('sorting.relevance')

  return (
    <div className={`flex items-center justify-between gap-[16px] ${className}`}>
      {/* Left Section - Search and Filters */}
      <div className="flex gap-[24px] items-center">
        {/* Search Input */}
        <div className="relative w-[420px]">
          <input
            className="w-full h-[44px] border border-[#046075] rounded-[22px] py-[10px] px-[16px] text-[16px] bg-[rgba(0,20,31,0.4)] text-[#f1fdff] placeholder-[rgba(204,248,255,0.65)] focus:outline-none focus:border-[#24E5C2] transition-colors"
            placeholder={searchPlaceholder}
            value={searchText}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        {/* Filters Button (Optional) */}
        {showFilters && onFiltersClick && (
          <button
            onClick={onFiltersClick}
            className="flex items-center gap-[8px] px-[16px] py-[10px] bg-[rgba(55,195,255,0.12)] border border-[#046075] rounded-[20px] text-[#f1fdff] hover:bg-[rgba(55,195,255,0.25)] transition-colors"
          >
            <FaFilter size={16} />
            <span className="text-[16px] font-artifakt">{t('common.filters')}</span>
          </button>
        )}
      </div>

      {/* Right Section - Sort */}
      <div className="flex gap-[10px] items-center">
        <p className="text-[16px] font-artifakt text-[rgba(204,248,255,0.65)]">
          Сортування:
        </p>
        
        {/* Sort Dropdown */}
        <div className="relative">
          <button
            className="text-[#f1fdff] text-[16px] flex items-center gap-[4px] cursor-pointer px-[12px] py-[8px] bg-[rgba(55,195,255,0.12)] border border-[#046075] rounded-[12px] hover:bg-[rgba(55,195,255,0.25)] transition-colors"
            onClick={handleSortDropdownToggle}
          >
            <span className="font-artifakt">{currentSortLabel}</span>
            {isSortDropdownOpen ? (
              <FaChevronUp size={16} />
            ) : (
              <FaChevronDown size={16} />
            )}
          </button>

          {/* Dropdown Menu */}
          {isSortDropdownOpen && (
            <div className="absolute top-full right-0 mt-[4px] bg-[#002f3d] border border-[#046075] rounded-[12px] shadow-lg z-10 min-w-[200px]">
              {sortOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleSortSelect(option.value)}
                  className="w-full text-left px-[16px] py-[12px] text-[#f1fdff] hover:bg-[#004252] transition-colors first:rounded-t-[12px] last:rounded-b-[12px]"
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
