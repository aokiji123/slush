import { useState } from 'react'

type CustomCheckboxProps = {
  id: string
  checked?: boolean
  onChange?: (checked: boolean) => void
  className?: string
}

export function CustomCheckbox({
  id,
  checked: controlledChecked,
  onChange,
  className = '',
}: CustomCheckboxProps) {
  const [isChecked, setIsChecked] = useState(controlledChecked ?? false)

  const checkedState =
    controlledChecked !== undefined ? controlledChecked : isChecked

  function handleChange() {
    const newChecked = !checkedState
    if (controlledChecked === undefined) {
      setIsChecked(newChecked)
    }
    onChange?.(newChecked)
  }

  return (
    <div className={`relative ${className}`}>
      <input
        type="checkbox"
        id={id}
        checked={checkedState}
        onChange={handleChange}
        className="sr-only"
      />
      <label
        htmlFor={id}
        className="flex items-center justify-center w-[24px] h-[24px] rounded-[6px] border-1 border-[var(--color-background-21)] cursor-pointer transition-all duration-200 hover:border-opacity-80"
        style={{
          backgroundColor: checkedState
            ? 'var(--color-background-21)'
            : 'transparent',
        }}
      >
        {checkedState && (
          <svg
            className="w-[14px] h-[14px] text-black"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M5 13l4 4L19 7"
            />
          </svg>
        )}
      </label>
    </div>
  )
}
