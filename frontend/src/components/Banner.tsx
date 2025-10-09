import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import { Search } from './Search'

export const Banner = ({ isDlc }: { isDlc: boolean }) => {
  return (
    <div
      className="h-[520px] bg-[var(--color-background-15)] relative bg-cover bg-center z-10"
      style={{
        backgroundImage: `url(${isDlc ? '/cyberpunk.png' : '/banner.png'})`,
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
      }}
    >
      <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-black/60 to-transparent pointer-events-none z-[1]" />
      <div className="container mx-auto h-full flex flex-col items-center justify-center relative z-[2]">
        <Search className="absolute top-[16px] left-1/2 -translate-x-1/2 z-[3]" />
        {!isDlc ? (
          <>
            <div className="flex justify-between items-center gap-[8px] absolute bottom-[56px] left-1/2 -translate-x-1/2 max-w-[1460px] w-full z-[3]">
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
                  Avatar: Frontiers of Pandora™ — це пригодницька гра від
                  першої особи, де події розгортаються на західному
                  кордоні.{' '}
                </p>
              </div>
            </div>
            <div className="absolute bottom-[16px] -left-5 top-1/2 -translate-y-1/2 z-[3] size-[36px] rounded-full bg-white flex items-center justify-center cursor-pointer">
              <FaChevronLeft className="w-[16px] h-[16px]" />
            </div>
            <div className="absolute bottom-[16px] -right-5 top-1/2 -translate-y-1/2 z-[3] size-[36px] rounded-full bg-white flex items-center justify-center cursor-pointer">
              <FaChevronRight className="w-[16px] h-[16px]" />
            </div>
          </>
        ) : (
          <div className="flex flex-col items-left absolute bottom-[32px] left-1/2 -translate-x-1/2 max-w-[1460px] w-full z-[3] text-white">
            <p className="text-[20px] font-light opacity-60">
              Завантажуваний контент для
            </p>
            <p className="text-[32px] font-bold">Cyberpunk 2077</p>
          </div>
        )}
      </div>
    </div>
  )
}
