import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import { CartIcon, FavoriteIcon, SearchIcon } from '@/icons'

export const Banner = () => {
  return (
    <div
      className="h-[520px] bg-[var(--color-background-15)] relative bg-cover bg-center z-10"
      style={{ backgroundImage: 'url(/banner.png)' }}
    >
      <div className="container mx-auto h-full flex flex-col items-center justify-center relative">
        <div className="flex items-center gap-[8px] absolute top-[16px] left-1/2 -translate-x-1/2">
          <div
            className="bg-[var(--color-background-16)] h-[52px] w-[1350px] rounded-[20px] flex items-center justify-between"
            style={{
              padding: '4px 26px 4px 4px',
            }}
          >
            <div className="w-[590px] h-[44px] bg-[var(--overlay-dark)] rounded-[20px] flex items-center justify-between py-[10px] px-[16px] relative">
              <input
                type="text"
                placeholder="Пошук у крамниці..."
                className="bg-transparent text-white text-[16px] h-[44px] w-full rounded-[20px] outline-none placeholder:text-[#CCF8FFA6] placeholder:text-[16px]"
              />
              <SearchIcon className="absolute right-[10px] top-1/2 -translate-y-1/2 w-[24px] h-[24px]" />
            </div>
            <div className="flex items-center gap-[26px]">
              <p className="text-[16px] text-white font-bold cursor-pointer">
                Каталог
              </p>
              <p className="text-[16px] text-white font-bold cursor-pointer">
                Новинки
              </p>
            </div>
          </div>
          <div className="w-[52px] h-[52px] flex items-center justify-center bg-[var(--color-background-16)] rounded-[20px] cursor-pointer">
            <FavoriteIcon className="w-[24px] h-[24px]" />
          </div>
          <div className="w-[52px] h-[52px] flex items-center justify-center bg-[var(--color-background-16)] rounded-[20px] cursor-pointer">
            <CartIcon className="w-[24px] h-[24px]" />
          </div>
        </div>
        <div className="flex justify-between items-center gap-[8px] absolute bottom-[56px] left-1/2 -translate-x-1/2 max-w-[1460px] w-full">
          <div className="flex flex-col">
            <div className="flex  items-center gap-[16px]">
              <p className="rounded-[20px] px-[12px] py-[4px] bg-[var(--color-background-10)]">
                -40%
              </p>
              <div className="flex items-center gap-[8px]">
                <p className="text-[32px] text-white font-bold">911₴</p>
                <p className="text-[32px] text-[var(--color-background-25)] font-extralight line-through">
                  1519₴
                </p>
              </div>
            </div>
            <p className="text-[16px] text-[var(--color-background-25)] font-normal">
              Знижка діє до 24.06.2024 10:00
            </p>
          </div>
          <div className="flex flex-col gap-[8px] text-right w-full max-w-[470px]">
            <p className="text-[24px] text-white font-bold">
              Avatar: Frontiers of Pandora
            </p>
            <p className="text-[16px] text-white font-normal">
              Avatar: Frontiers of Pandora™ — це пригодницька гра від першої
              особи, де події розгортаються на західному кордоні.{' '}
            </p>
          </div>
        </div>
        <div className="absolute bottom-[16px] -left-5 top-1/2 -translate-y-1/2 z-10 size-[36px] rounded-full bg-white flex items-center justify-center cursor-pointer">
          <FaChevronLeft className="w-[16px] h-[16px]" />
        </div>
        <div className="absolute bottom-[16px] -right-5 top-1/2 -translate-y-1/2 z-10 size-[36px] rounded-full bg-white flex items-center justify-center cursor-pointer">
          <FaChevronRight className="w-[16px] h-[16px]" />
        </div>
      </div>
    </div>
  )
}
