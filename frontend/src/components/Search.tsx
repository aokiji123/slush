import { useLocation, useNavigate } from '@tanstack/react-router'
import { IoFilter } from 'react-icons/io5'
import {
  CartIcon,
  FavoriteIcon,
  GridIcon,
  GridRowIcon,
  SearchIcon,
} from '@/icons'

type SearchProps = {
  className?: string
  viewMode?: 'grid' | 'row'
  onViewModeChange?: (mode: 'grid' | 'row') => void
}

export const Search = ({
  className,
  viewMode = 'grid',
  onViewModeChange,
}: SearchProps) => {
  const navigate = useNavigate()
  const location = useLocation()

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
        {location.pathname !== '/library' ? (
          <div className="flex items-center gap-[26px]">
            <p
              className={`text-[16px] font-bold cursor-pointer hover:text-[var(--color-background-23)] ${
                location.pathname === '/catalog'
                  ? 'text-[var(--color-background-23)]'
                  : 'text-white'
              }`}
              onClick={() => {
                navigate({ to: '/catalog' })
              }}
            >
              Каталог
            </p>
            <p
              className={`text-[16px] font-bold cursor-pointer hover:text-[var(--color-background-23)] ${
                location.pathname === '/new'
                  ? 'text-[var(--color-background-23)]'
                  : 'text-white'
              }`}
              onClick={() => {
                navigate({ to: '/new' })
              }}
            >
              Новинки
            </p>
          </div>
        ) : (
          <div className="pl-[24px] flex items-center justify-between w-full text-white">
            <div className="flex items-center gap-[8px]">
              <IoFilter size={24} />
              <p className="text-[16px]">Фільтри</p>
            </div>
            <div className="flex items-center gap-[12px]">
              <p className="text-[16px] mr-1">Вид:</p>
              <div onClick={() => onViewModeChange?.('grid')}>
                <GridIcon
                  className={`cursor-pointer hover:text-[var(--color-background-23)] ${
                    viewMode === 'grid'
                      ? 'text-[var(--color-background-23)]'
                      : ''
                  }`}
                />
              </div>
              <div onClick={() => onViewModeChange?.('row')}>
                <GridRowIcon
                  className={`cursor-pointer hover:text-[var(--color-background-23)] ${
                    viewMode === 'row'
                      ? 'text-[var(--color-background-23)]'
                      : ''
                  }`}
                />
              </div>
            </div>
          </div>
        )}
      </div>
      {location.pathname !== '/library' && (
        <>
          <div
            className={`w-[52px] h-[52px] flex items-center justify-center rounded-[20px] cursor-pointer ${
              location.pathname === '/wishlist'
                ? 'bg-white'
                : 'bg-[var(--color-background-16)]'
            }`}
            onClick={() => {
              navigate({ to: '/wishlist' })
            }}
          >
            <FavoriteIcon
              className={`w-[24px] h-[24px] ${
                location.pathname === '/wishlist'
                  ? 'text-[var(--color-background-24)]'
                  : 'text-white'
              }`}
            />
          </div>
          <div
            className={`w-[52px] h-[52px] flex items-center justify-center rounded-[20px] cursor-pointer ${
              location.pathname === '/cart'
                ? 'bg-white'
                : 'bg-[var(--color-background-16)]'
            }`}
            onClick={() => {
              navigate({ to: '/cart' })
            }}
          >
            <CartIcon
              className={`w-[24px] h-[24px] ${
                location.pathname === '/cart'
                  ? 'text-[var(--color-background-24)]'
                  : 'text-white'
              }`}
            />
          </div>
        </>
      )}
    </div>
  )
}
