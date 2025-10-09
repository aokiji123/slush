import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { IoFilter } from 'react-icons/io5'
import { FiPlusCircle } from 'react-icons/fi'
import { Search } from '@/components'
import { BsThreeDots } from 'react-icons/bs'
import { FaChevronLeft, FaChevronRight, FaRegStar } from 'react-icons/fa'
import { CommentsIcon, FavoriteIcon } from '@/icons'

export const Route = createFileRoute('/library')({
  component: RouteComponent,
})

const myGames = [
  {
    id: 1,
    name: 'Counter-Strike 2',
    image: '/cs.png',
  },
  {
    id: 2,
    name: "Baldur's Gate 3",
    image: '/baldurs-gate-3.png',
  },
  {
    id: 3,
    name: 'Ghost of Tsushima',
    image: '/ghost-of-tsushima.png',
  },
  {
    id: 4,
    name: 'Destiny 2',
    image: '/destiny-2.png',
  },
  {
    id: 5,
    name: 'Cyberpunk 2077',
    image: '/cyberpunk.png',
  },
  {
    id: 6,
    name: 'The Witcher 3',
    image: '/witcher-3.jpg',
  },
  {
    id: 7,
    name: 'Sekiro: Shadows Die Twice',
    image: '/sekiro.jpg',
  },
  {
    id: 8,
    name: "No Man's Sky",
    image: '/banner-settings.jpg',
  },
]

const glowCoords = [
  {
    id: 1,
    top: '-150px',
    left: '-200px',
    width: '700px',
    height: '700px',
  },
  {
    id: 2,
    top: '400px',
    right: '-300px',
    width: '900px',
    height: '900px',
  },
  {
    id: 3,
    bottom: '-50px',
    left: '-250px',
    width: '900px',
    height: '900px',
  },
]

function RouteComponent() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'row'>('grid')

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed)
  }

  return (
    <div className="bg-[var(--color-night-background)] min-h-screen flex flex-col">
      <div
        className={`${isSidebarCollapsed ? 'w-[64px]' : 'w-[15%] min-w-[200px]'} absolute left-0 top-[90px] h-full bg-[var(--color-background-8)] z-40 text-white transition-all duration-300`}
      >
        <div className="p-[20px] flex flex-col gap-[20px]">
          <div
            className={`flex items-center ${isSidebarCollapsed ? 'justify-center' : 'justify-between'}`}
          >
            {!isSidebarCollapsed && (
              <h2 className="text-[20px] font-bold">Усі ігри</h2>
            )}
            <button
              type="button"
              onClick={toggleSidebar}
              className="cursor-pointer hover:opacity-80 transition-opacity flex items-center justify-center"
            >
              <IoFilter size={24} />
            </button>
          </div>

          {!isSidebarCollapsed && (
            <div className="flex flex-col gap-[20px]">
              {myGames.map((game) => (
                <div key={game.id} className="flex items-center gap-[16px]">
                  <img
                    src={game.image}
                    alt={game.name}
                    className="w-[40px] h-[40px] rounded-[10px] object-cover object-center flex-shrink-0"
                  />
                  <p className="text-[16px] font-bold line-clamp-1">
                    {game.name}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div
        className={`${isSidebarCollapsed ? 'w-full pl-[80px]' : 'w-[85%] ml-[15%]'} z-20 transition-all duration-300`}
      >
        <div
          className={`container mx-auto ${isSidebarCollapsed ? 'pr-[32px]' : 'px-[32px]'}`}
        >
          <Search
            className="my-[16px] w-full"
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />

          <div className="flex flex-col gap-[12px] mb-[48px]">
            <h3 className="text-[24px] font-bold text-white">Новини</h3>

            <div className="relative">
              <div className="absolute bottom-[16px] -left-3 top-1/2 -translate-y-1/2 z-10 size-[24px] rounded-full bg-white flex items-center justify-center cursor-pointer">
                <FaChevronLeft className="size-[12px]" />
              </div>
              <div className="absolute bottom-[16px] -right-3 top-1/2 -translate-y-1/2 z-10 size-[24px] rounded-full bg-white flex items-center justify-center cursor-pointer">
                <FaChevronRight className="size-[12px]" />
              </div>
              <div className="flex gap-[24px] overflow-x-auto">
                {[1, 2, 3].map((_) => (
                  <div className="flex items-center gap-[24px]">
                    <div className="w-[475px] min-h-[450px] rounded-[20px] overflow-hidden">
                      <img
                        src="/cyberpunk-image.png"
                        alt="cyberpunk"
                        className="w-full h-[180px] rounded-none object-cover"
                      />
                      <div className="bg-[var(--color-background-15)] p-[24px] flex flex-col gap-[16px] rounded-[0px_0px_20px_20px]">
                        <div className="flex items-center justify-between">
                          <div className="relative bg-[var(--color-background-8)] pl-[36px] pr-[12px] h-[28px] rounded-[20px] flex items-center justify-end w-fit cursor-pointer text-white">
                            <img
                              src="/avatar.png"
                              alt="avatar"
                              className="w-[28px] h-[28px] object-cover rounded-full absolute top-0 left-0"
                              loading="lazy"
                            />
                            <p className="text-right text-[16px] font-medium">
                              Юзернейм
                            </p>
                          </div>
                          <BsThreeDots
                            size={24}
                            className="cursor-pointer text-white"
                          />
                        </div>
                        <div className="flex flex-col gap-[8px]">
                          <p className="text-[20px] font-bold text-white">
                            Интересный заголовок новости
                          </p>
                          <p className="text-[16px] font-light text-white line-clamp-3">
                            Lorem ipsum dolor sit amet consectetur. Amet nulla
                            in risus commodo in in. Massa risus aliquet ut justo
                            mauris blandit massa dolor vulputate. Pretium sit
                            ullamcorper cursus
                          </p>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-[16px]">
                            <div className="flex items-center gap-[8px] py-[4px] px-[8px] cursor-pointer text-[var(--color-background-25)] bg-[var(--color-background-17)] rounded-[8px]">
                              <FavoriteIcon className="text-[var(--color-background-10)]" />
                              <p>2.5k</p>
                            </div>
                            <div className="flex items-center gap-[8px] py-[4px] px-[8px] cursor-pointer text-[var(--color-background-25)] bg-[var(--color-background-17)] rounded-[8px]">
                              <CommentsIcon />
                              <p>2.5k</p>
                            </div>
                          </div>
                          <p className="text-[16px] font-normal text-[var(--color-background-25)]">
                            21.02.2023
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-[12px] mb-[48px]">
            <h3 className="text-[24px] font-bold text-white">
              Цікаве від Спільноти
            </h3>

            <div className="relative">
              <div className="absolute bottom-[16px] -left-3 top-1/2 -translate-y-1/2 z-10 size-[24px] rounded-full bg-white flex items-center justify-center cursor-pointer">
                <FaChevronLeft className="size-[12px]" />
              </div>
              <div className="absolute bottom-[16px] -right-3 top-1/2 -translate-y-1/2 z-10 size-[24px] rounded-full bg-white flex items-center justify-center cursor-pointer">
                <FaChevronRight className="size-[12px]" />
              </div>
              <div className="flex gap-[24px] overflow-x-auto">
                {[1, 2, 3].map((_) => (
                  <div className="flex items-center gap-[24px]">
                    <div className="w-[475px] min-h-[400px] flex flex-col gap-[16px] rounded-[20px] overflow-hidden bg-[var(--color-background-15)] p-[20px]">
                      <div className="flex items-center justify-between">
                        <div className="relative bg-[var(--color-background-8)] pl-[36px] pr-[12px] h-[28px] rounded-[20px] flex items-center justify-end w-fit cursor-pointer text-white">
                          <img
                            src="/avatar.png"
                            alt="avatar"
                            className="w-[28px] h-[28px] object-cover rounded-full absolute top-0 left-0"
                            loading="lazy"
                          />
                          <p className="text-right text-[16px] font-medium">
                            Юзернейм
                          </p>
                        </div>
                        <BsThreeDots
                          size={24}
                          className="cursor-pointer text-white"
                        />
                      </div>
                      <img
                        src="/cyberpunk-image.png"
                        alt="cyberpunk"
                        className="w-full h-[180px] rounded-[20px]"
                      />
                      <div className="flex flex-col gap-[16px] rounded-[0px_0px_20px_20px]">
                        <div className="flex flex-col gap-[8px]">
                          <p className="text-[20px] font-bold text-white">
                            Интересный заголовок новости
                          </p>
                          <p className="text-[16px] font-light text-white line-clamp-3">
                            Lorem ipsum dolor sit amet consectetur. Amet nulla
                            in risus commodo in in. Massa risus aliquet ut justo
                            mauris blandit massa dolor vulputate. Pretium sit
                            ullamcorper cursus
                          </p>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-[16px]">
                            <div className="flex items-center gap-[8px] py-[4px] px-[8px] cursor-pointer text-[var(--color-background-25)] bg-[var(--color-background-17)] rounded-[8px]">
                              <FavoriteIcon className="text-[var(--color-background-10)]" />
                              <p>2.5k</p>
                            </div>
                            <div className="flex items-center gap-[8px] py-[4px] px-[8px] cursor-pointer text-[var(--color-background-25)] bg-[var(--color-background-17)] rounded-[8px]">
                              <CommentsIcon />
                              <p>2.5k</p>
                            </div>
                          </div>
                          <p className="text-[16px] font-normal text-[var(--color-background-25)]">
                            21.02.2023
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-[10px] w-full mb-[256px]">
            <div className="flex items-center gap-[45px] text-[24px]">
              <p className="text-[var(--color-background-25)] font-bold hover:text-[var(--color-background-21)] border-b-3 border-transparent hover:border-[var(--color-background-21)] cursor-pointer font-manrope">
                Усі ігри
              </p>
              <p className="text-[var(--color-background-25)] font-bold hover:text-[var(--color-background-21)] border-b-3 border-transparent hover:border-[var(--color-background-21)] cursor-pointer font-manrope">
                Обране
              </p>
              <p className="text-[var(--color-background-25)] font-bold hover:text-[var(--color-background-21)] border-b-3 border-transparent hover:border-[var(--color-background-21)] cursor-pointer font-manrope">
                Моя колекція
              </p>
              <div className="cursor-pointer text-[var(--color-background-21)]">
                <FiPlusCircle size={24} />
              </div>
            </div>

            <div
              className={
                viewMode === 'grid'
                  ? 'flex flex-wrap gap-[24px]'
                  : 'flex flex-col gap-[16px]'
              }
            >
              {myGames.map((game) =>
                viewMode === 'grid' ? (
                  <div
                    key={game.id}
                    className="w-[225px] h-[300px] rounded-[20px]"
                  >
                    <img
                      src={game.image}
                      alt={game.name}
                      className="w-full h-full object-cover rounded-[20px]"
                    />
                  </div>
                ) : (
                  <div
                    key={game.id}
                    className="flex items-center h-[120px] gap-[24px] bg-[var(--color-background-15)] rounded-[20px] transition-colors overflow-hidden"
                  >
                    <img
                      src={game.image}
                      alt={game.name}
                      className="w-[320px] h-full object-cover"
                    />
                    <div className="flex flex-col justify-between pr-[24px] gap-[8px] flex-1">
                      <h3 className="text-white text-[20px] font-bold font-manrope">
                        {game.name}
                      </h3>
                      <div className="w-full flex items-center justify-between">
                        <button className="h-[40px] w-[110px] flex items-center justify-center text-[16px] font-normal rounded-[20px] bg-[var(--color-background-21)] text-[var(--color-night-background)] cursor-pointer">
                          Скачати
                        </button>
                        <div className="flex flex-col">
                          <p className="text-[16px] font-normal text-[var(--color-background-25)]">
                            Розмір на диску
                          </p>
                          <p className="text-[20px] font-bold text-white">
                            10 ГБ
                          </p>
                        </div>
                        <div className="flex items-center gap-[8px]">
                          <div className="w-[40px] h-[40px] flex items-center justify-center text-white bg-[var(--color-background-16)] rounded-full">
                            <FaRegStar size={24} />
                          </div>
                          <div className="w-[40px] h-[40px] flex items-center justify-center text-white bg-[var(--color-background-16)] rounded-full">
                            <BsThreeDots size={24} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ),
              )}
            </div>
          </div>
        </div>
      </div>

      {glowCoords.map((glow) => (
        <img
          key={glow.id}
          loading="lazy"
          src="/glow.png"
          alt="glow"
          className="absolute z-0 opacity-50"
          style={{
            top: glow.top,
            left: glow.left,
            right: glow.right,
            bottom: glow.bottom,
            width: glow.width,
            height: glow.height,
          }}
        />
      ))}
    </div>
  )
}
