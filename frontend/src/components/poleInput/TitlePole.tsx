import type { ChangeEvent } from "react";
import './style.scss';

interface TitlePoleI {
  classTitle?: string,
  classInput?: string,
  placeholder: string,
  title: string,
  value: string,
  onChange: (a: string) => void,
  limitSymbol: number | null
}

export const TitlePole = ({ classTitle = '', classInput = '', placeholder, title, value, onChange, limitSymbol }: TitlePoleI) => {
  const onHandlerInput = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (limitSymbol && value.length > limitSymbol) return;
    onChange(value)
  }
  return <div className='w-full flex flex-col gap-[8px]'>
    <div className='w-full flex justify-between items-center gap-[8px]'>
      <h2 className={'text-[16px] font-bold text-[var(--color-background)] ' + classTitle} >{title}</h2>
      {limitSymbol && <p className='text-[12px] text-[var(--color-background-25)]'>{value.length}/{limitSymbol}</p>}
    </div>
    <input className={'w-full style-pole-input ' + classInput} placeholder={placeholder} value={value} onChange={onHandlerInput} />
  </div>
}