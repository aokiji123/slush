import { useState } from 'react'

type CustomCheckboxProps = {
  id: string
  checked?: boolean
  onChange?: (checked: boolean) => void
  className?: string
  shape?: 'square' | 'circle'
  size?: number
  colorVar?: string
  innerBorderOnChecked?: boolean
  innerBorderColorVar?: string
  innerBorderWidth?: number
  innerInset?: number
}

export function CustomCheckbox({
  id,
  checked: controlledChecked,
  onChange,
  className = '',
  shape = 'square',
  size = 24,
  colorVar = '--color-background-21',
  innerBorderOnChecked = true,
  innerBorderColorVar = '--color-night-background',
  innerBorderWidth = 2,
  innerInset = 2,
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

  const dimension = `${size}px`
  const borderRadiusClass =
    shape === 'circle' ? 'rounded-full' : 'rounded-[6px]'

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
        className={`relative flex items-center justify-center border-1 cursor-pointer transition-all duration-200 hover:border-opacity-80 ${borderRadiusClass}`}
        style={{
          width: dimension,
          height: dimension,
          borderColor: `var(${colorVar})`,
          backgroundColor: checkedState ? `var(${colorVar})` : 'transparent',
        }}
      >
        {shape === 'square' && checkedState && (
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
        {shape === 'circle' && checkedState && innerBorderOnChecked && (
          <span
            aria-hidden
            style={{
              position: 'absolute',
              inset: innerInset,
              borderRadius: 9999,
              border: `${innerBorderWidth}px solid var(${innerBorderColorVar})`,
            }}
          />
        )}
      </label>
    </div>
  )
}
