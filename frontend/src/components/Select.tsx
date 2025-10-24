import { useEffect, useRef, useState } from 'react'

type SelectOption = {
  value: string
  label: string
  icon?: string
}

type SelectProps = {
  options: Array<SelectOption>
  value?: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export function Select({
  options,
  value,
  onChange,
  placeholder = 'Select option...',
  className = '',
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedOption, setSelectedOption] = useState<SelectOption | null>(
    options.find((option) => option.value === value) || null,
  )
  const selectRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = (option: SelectOption) => {
    setSelectedOption(option)
    onChange(option.value)
    setIsOpen(false)
  }

  return (
    <div className={`relative ${className}`} ref={selectRef}>
      <div
        className="w-full h-[44px] border-1 border-[var(--color-background-16)] rounded-[20px] py-[10px] px-[16px] text-[16px] bg-[var(--color-background-14)] text-[var(--color-background)] cursor-pointer flex items-center justify-between"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-[12px]">
          {selectedOption?.icon && (
            <img
              src={selectedOption.icon}
              alt={`${selectedOption.label} icon`}
              className="w-[20px] h-[15px] object-cover rounded-sm"
            />
          )}
          <span
            className={
              selectedOption ? '' : 'text-[var(--color-background-25)]'
            }
          >
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </div>
        <svg
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-[var(--color-background-14)] border-1 border-[var(--color-background-16)] rounded-[20px] overflow-hidden z-50 shadow-lg">
          {options.map((option, index) => (
            <div
              key={option.value}
              className={`py-[10px] px-[16px] cursor-pointer hover:bg-[var(--color-background-18)] flex items-center gap-[12px] ${
                index !== options.length - 1
                  ? 'border-b border-[var(--color-background-16)]'
                  : ''
              }`}
              onClick={() => handleSelect(option)}
            >
              {option.icon && (
                <img
                  src={option.icon}
                  alt={`${option.label} icon`}
                  className="w-[20px] h-[15px] object-cover rounded-sm"
                />
              )}
              <span className="text-[var(--color-background)]">
                {option.label}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
