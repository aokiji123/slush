import type { ChangeEvent } from 'react'
import './style.scss'

interface TextPoleI {
  classTitle?: string
  classInput?: string
  placeholder: string
  title: string
  value: string
  onChange: (a: string) => void
  classContainer?: string
}

export const TextPole = ({
  classTitle = '',
  classInput = '',
  placeholder,
  title,
  value,
  onChange,
  classContainer = '',
}: TextPoleI) => {
  const onHandlerInput = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    onChange(value)
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
      </div>
      <div className="w-full relative">
        <div className="absolute top-[12px] left-[16px] flex gap-[16px] pointer-events-none">
          <svg
            viewBox="0 0 15 19"
            width="15.000000"
            height="19.000000"
            fill="none"
          >
            <path
              id="Vector"
              d="M9.6 19L1.5 19C0.7 19 0 18.3 0 17.5L0 1.5C0 0.7 0.7 0 1.5 0L8.4 0C11.4 0 13.8 2.5 13.8 5.5C13.8 6.8 13.4 8 12.6 8.9C14 9.9 15 11.6 15 13.5C15 16.5 12.6 19 9.6 19ZM3 16L9.6 16C10.9 16 12 14.9 12 13.5C12 12.1 10.9 11 9.6 11L3 11L3 16ZM3 8L8.4 8C9.7 8 10.8 6.9 10.8 5.5C10.8 4.1 9.7 3 8.4 3L3 3L3 8Z"
              fill="rgb(241.196,253.376,255)"
              fillRule="nonzero"
            />
          </svg>
          <svg width="16" height="18" viewBox="0 0 16 18" fill="none">
            <path
              d="M5.8705 18C5.7554 18 5.7554 18 5.8705 18H1.15108C0.460432 18 0 17.55 0 16.875C0 16.2 0.460432 15.75 1.15108 15.75H4.94964L8.7482 2.25H5.64029C4.94964 2.25 4.48921 1.8 4.48921 1.125C4.48921 0.45 4.94964 0 5.64029 0H10.2446H14.8489C15.5396 0 16 0.45 16 1.125C16 1.8 15.5396 2.25 14.8489 2.25H11.0504L7.2518 15.75H10.3597C11.0504 15.75 11.5108 16.2 11.5108 16.875C11.5108 17.55 11.0504 18 10.3597 18H5.8705Z"
              fill="#F1FDFF"
            />
          </svg>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path
              d="M17 18H1C0.4 18 0 17.6 0 17C0 16.4 0.4 16 1 16H17C17.6 16 18 16.4 18 17C18 17.6 17.6 18 17 18ZM9 14.6C5.3 14.6 2.3 11.6 2.3 7.9V2.1V2H1.6C1 2 0.6 1.6 0.6 1C0.6 0.4 1 0 1.6 0H5C5.6 0 6 0.4 6 1C6 1.6 5.6 2 5 2H4.3V2.1V7.8C4.3 10.4 6.4 12.5 9 12.5C11.6 12.5 13.7 10.4 13.7 7.8V2.1V2H13C12.4 2 12 1.6 12 1C12 0.4 12.4 0 13 0H16.4C17 0 17.4 0.4 17.4 1C17.4 1.6 17 2 16.4 2H15.7V2.1V7.8C15.7 11.6 12.7 14.6 9 14.6Z"
              fill="#F1FDFF"
            />
          </svg>
          <svg width="21" height="20" viewBox="0 0 21 20" fill="none">
            <path
              d="M15.6 0H4.4C2 0 0 2 0 4.4V15.7C0 18 2 20 4.4 20H15.7C18.1 20 20.1 18 20.1 15.6V4.4C20 2 18 0 15.6 0ZM2 4.4C2 3.1 3.1 2 4.4 2H15.7C16.9 2 18 3.1 18 4.4V12.7L14.6 9.3C14.2 8.9 13.6 8.9 13.2 9.3L8.8 13.7L7.3 12.2C6.9 11.8 6.3 11.8 5.9 12.2L2 16C2 15.9 2 15.8 2 15.6V4.4ZM15.6 18H4.4C4 18 3.6 17.9 3.2 17.7L6.6 14.3L8.1 15.8C8.5 16.2 9.1 16.2 9.5 15.8L13.9 11.4L17.7 15.2C17.8 15.3 17.9 15.3 18 15.4V15.6C18 16.9 16.9 18 15.6 18Z"
              fill="#F1FDFF"
            />
            <path
              d="M6.10039 8.80039C7.60039 8.80039 8.80039 7.60039 8.80039 6.10039C8.80039 4.60039 7.50039 3.40039 6.10039 3.40039C4.70039 3.40039 3.40039 4.60039 3.40039 6.10039C3.40039 7.60039 4.60039 8.80039 6.10039 8.80039ZM6.10039 5.40039C6.50039 5.40039 6.80039 5.70039 6.80039 6.10039C6.80039 6.50039 6.40039 6.80039 6.10039 6.80039C5.80039 6.80039 5.40039 6.40039 5.40039 6.10039C5.40039 5.80039 5.70039 5.40039 6.10039 5.40039Z"
              fill="#F1FDFF"
            />
          </svg>
        </div>
        <textarea
          className={
            'w-full style-pole-input style-pole-input-big ' + classInput
          }
          placeholder={placeholder}
          value={value}
          onChange={onHandlerInput}
        />
      </div>
    </div>
  )
}
