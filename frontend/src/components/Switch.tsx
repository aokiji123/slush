import { useState } from 'react'

type SwitchProps = {
  checked?: boolean
  onChange?: (checked: boolean) => void
  disabled?: boolean
  className?: string
}

export function Switch({
  checked = false,
  onChange,
  disabled = false,
  className = '',
}: SwitchProps) {
  const [isChecked, setIsChecked] = useState(checked)

  const handleToggle = () => {
    if (disabled) return

    const newChecked = !isChecked
    setIsChecked(newChecked)
    onChange?.(newChecked)
  }

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isChecked}
      disabled={disabled}
      onClick={handleToggle}
      className={`
        relative inline-flex h-[24px] w-[44px] items-center rounded-full
        transition-all duration-200 ease-in-out
        focus:outline-none
        cursor-pointer
        disabled:opacity-50 disabled:cursor-not-allowed
        border border-[var(--color-background-16)] bg-[var(--color-background-14)]
        ${className}
      `}
    >
      <span
        className={`
          inline-block h-[16px] w-[16px] transform rounded-full
          shadow-sm transition-all duration-200 ease-in-out
          ${
            isChecked
              ? 'translate-x-[24px] bg-[#FF6F95]'
              : 'translate-x-[2px] bg-white'
          }
        `}
      />
    </button>
  )
}
