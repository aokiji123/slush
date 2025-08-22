import { useNavigate } from '@tanstack/react-router'
import { CartIcon, FavoriteIcon, SearchIcon } from '@/icons'

type SearchProps = {
  className?: string
}

export const Search = ({ className }: SearchProps) => {
  const navigate = useNavigate()

  return (
    <div className={`flex items-center gap-[8px] w-full ${className}`}>
      <div
        className="bg-[var(--color-background-16)] h-[52px] flex-1 rounded-[20px] flex items-center justify-between"
        style={{
          padding: '4px 26px 4px 4px',
        }}
      >
        <div className="w-[590px] h-[44px] bg-[var(--overlay-dark)] rounded-[16px] flex items-center justify-between py-[10px] px-[16px] relative">
          <input
            type="text"
            placeholder="Пошук у крамниці..."
            className="bg-transparent text-white text-[16px] h-[44px] w-full rounded-[20px] outline-none placeholder:text-[#CCF8FFA6] placeholder:text-[16px]"
          />
          <SearchIcon className="absolute right-[10px] top-1/2 -translate-y-1/2 w-[24px] h-[24px]" />
        </div>
        <div className="flex items-center gap-[26px]">
          <p
            className="text-[16px] text-white font-bold cursor-pointer hover:text-[var(--color-background-23)]"
            onClick={() => {
              navigate({
                to: '/catalog',
              })
            }}
          >
            Каталог
          </p>
          <p className="text-[16px] text-white font-bold cursor-pointer hover:text-[var(--color-background-23)]">
            Новинки
          </p>
        </div>
      </div>
      <div className="w-[52px] h-[52px] flex items-center justify-center bg-[var(--color-background-16)] rounded-[20px] cursor-pointer">
        <FavoriteIcon className="w-[24px] h-[24px] text-[var(--color-background)]" />
      </div>
      <div className="w-[52px] h-[52px] flex items-center justify-center bg-[var(--color-background-16)] rounded-[20px] cursor-pointer">
        <CartIcon className="w-[24px] h-[24px]" />
      </div>
    </div>
  )
}
