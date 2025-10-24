import type { ChangeEvent } from 'react'
import './style.scss'

interface DescriptionPoleI {
  classTitle?: string
  classInput?: string
  placeholder: string
  title: string
  value: string
  onChange: (a: string) => void
  classContainer?: string
  limitSymbol?: number | null
}

export const DescriptionPole = ({
  classTitle = '',
  classInput = '',
  placeholder,
  title,
  value,
  onChange,
  classContainer = '',
  limitSymbol,
}: DescriptionPoleI) => {
  const onHandlerInput = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const inputValue = e.target.value
    onChange(inputValue)
  }
  return (
    <div className={'w-full flex flex-col gap-[8px] ' + classContainer}>
      <div className="w-full flex justify-between items-center gap-[8px]">
        <h2
          className={
            'text-[16px] font-bold text-[var(--color-background)] ' + classTitle
          }
        >
          {title}
        </h2>
        {limitSymbol && (
          <p className="text-[12px] text-[var(--color-background-25)]">
            {value.length}/{limitSymbol}
          </p>
        )}
      </div>
      <div className="w-full relative">
        <textarea
          className={
            'w-full style-pole-input style-pole-input-big-simple ' + classInput
          }
          placeholder={placeholder}
          value={value}
          onChange={onHandlerInput}
        />
      </div>
    </div>
  )
}
