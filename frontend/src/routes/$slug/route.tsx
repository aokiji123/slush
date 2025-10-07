import {
  Outlet,
  createFileRoute,
  useLocation,
  useNavigate,
} from '@tanstack/react-router'
import {
  FaApple,
  FaPlaystation,
  FaStar,
  FaWindows,
  FaXbox,
} from 'react-icons/fa'
import { Search } from '@/components'
import { ComplaintIcon, FavoriteIcon, RepostIcon } from '@/icons'

export const Route = createFileRoute('/$slug')({
  component: RouteComponent,
})

const glowCoords = [
  {
    top: '450px',
    left: '-200px',
    width: '900px',
    height: '900px',
  },
  {
    top: '-300px',
    right: '-200px',
    width: '900px',
    height: '900px',
  },
  {
    bottom: '-100px',
    right: '0px',
    width: '900px',
    height: '900px',
  },
]

const tabs = [
  {
    name: 'Про гру',
    href: '/cyberpunk-2077',
  },
  {
    name: 'Характеристики',
    href: '/cyberpunk-2077/characteristics',
  },
  {
    name: 'Спільнота',
    href: '/cyberpunk-2077/community',
  },
]

const nicknames = [
  'karl_vava',
  'zuzeyka',
  'NikaNii',
  's1imerock',
  'whysxugly',
  'low_owl',
  'mop_riderEX',
]

const TYPE_PAGE = {
  community : 'community'
}

function RouteComponent() {
  const navigate = useNavigate()
  const location = useLocation()

  const isCommunity = location.pathname.split('/')[2] === TYPE_PAGE.community
  const locationPath = location.pathname.split('/').slice(0,3).join('/')

  const isActiveTab = (tabHref: string) => {
    return (
      locationPath ===
      tabHref.replace('$slug', location.pathname.split('/')[1])
    )
  }

  return (
    <div className="bg-[var(--color-night-background)] relative overflow-hidden">
      <div className="container mx-auto relative z-20">
        <div className="flex items-center justify-center">
          <Search className="my-[16px] w-full" />
        </div>

        <ul className="flex items-center gap-[16px] text-[var(--color-background-25)] cursor-pointer mb-[24px]">
          {tabs.map((tab) => {
            const isActive = isActiveTab(tab.href)
            return (
              <li
                className={`text-[25px] font-bold relative border-b-2 transition-colors ${
                  isActive
                    ? 'text-[var(--color-background-21)] border-[var(--color-background-21)]'
                    : 'border-transparent hover:text-[var(--color-background-21)] hover:border-[var(--color-background-21)]'
                }`}
                key={tab.name}
                onClick={() => {
                  navigate({ to: tab.href })
                }}
              >
                {tab.name}
              </li>
            )
          })}
        </ul>

        {
          isCommunity 
          ? <Outlet />
          : <div className="w-full flex gap-[24px]">
          <div className="w-[75%] flex flex-col gap-[8px] min-w-0 mb-[256px]">
            <p className="text-[32px] font-bold text-[var(--color-background)]">
              Cyberpunk 2077
            </p>
            <Outlet />
          </div>

          <div className="w-[25%] flex flex-col gap-[8px] flex-shrink-0">
            <div className="flex items-center gap-[15px] justify-end h-[48px]">
              <p className="text-[24px] font-bold text-[var(--color-background)]">
                5.0
              </p>
              <div className="flex items-center gap-[8px]">
                {Array.from({ length: 5 }).map((_, index) => {
                  return (
                    <FaStar
                      key={index}
                      size={24}
                      className="text-[var(--color-background-10)]"
                    />
                  )
                })}
              </div>
            </div>

            <div className="flex flex-col gap-[20px]">
              <img
                src="/cyberpunk.png"
                alt="cyberpunk"
                className="w-full h-[145px] rounded-[20px] object-cover"
                loading="lazy"
              />
              <p className="text-[32px] font-bold text-[var(--color-background)]">
                1 099₴
              </p>
              <div className="flex flex-col gap-[12px]">
                <button className="h-[48px] flex items-center justify-center py-[12px] px-[26px] text-[20px] font-normal rounded-[20px] bg-[var(--color-background-21)] text-[var(--color-night-background)] cursor-pointer">
                  <p>Купити</p>
                </button>
                <div className="w-full flex items-center gap-[8px]">
                  <button className="h-[48px] w-full flex items-center justify-center py-[12px] px-[26px] text-[20px] font-normal rounded-[20px] bg-[var(--color-background-16)] text-[var(--color-background)] cursor-pointer">
                    <p>Додати у кошик</p>
                  </button>
                  <button className="h-[48px] w-[48px] flex items-center justify-center p-[12px] text-[20px] font-normal rounded-[20px] bg-[var(--color-background-16)] cursor-pointer">
                    <FavoriteIcon className="w-[24px] h-[24px] text-[var(--color-background)]" />
                  </button>
                </div>
                <div className="flex items-center gap-[12px] w-full">
                  <button className="flex items-center justify-center p-[12px] text-[20px] font-normal rounded-[20px] cursor-pointer w-[40%] gap-[12px]">
                    <RepostIcon className="w-[24px] h-[24px] text-[var(--color-background)]" />
                    <span className="text-[var(--color-background-21)]">
                      Репост
                    </span>
                  </button>
                  <button className="flex items-center justify-center p-[12px] text-[20px] font-normal rounded-[20px] cursor-pointer w-[60%] gap-[12px]">
                    <ComplaintIcon className="w-[24px] h-[24px] text-[var(--color-background)]" />
                    <span className="text-[var(--color-background-19)]">
                      Поскаржитись
                    </span>
                  </button>
                </div>
              </div>
              <div className="flex flex-col gap-[16px] text-[var(--color-background)]">
                <div className="flex items-center justify-between">
                  <p className="text-[16px] font-bold">Дата виходу</p>
                  <p className="text-[16px] font-normal">10.12.2020</p>
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-[16px] font-bold">Розробник</p>
                  <p className="text-[16px] font-normal">CD PROJECT RED</p>
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-[16px] font-bold">Видавець</p>
                  <p className="text-[16px] font-normal">Zubaric Inc</p>
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-[16px] font-bold">Платформи</p>
                  <div className="flex items-center gap-[12px]">
                    <FaWindows size={24} />
                    <FaApple size={24} />
                    <FaPlaystation size={24} />
                    <FaXbox size={24} />
                  </div>
                </div>
              </div>

              <div className="rounded-[20px] bg-[var(--color-background-15)] p-[20px] flex flex-col gap-[20px] text-[var(--color-background)]">
                <p className="text-[20px] font-bold">
                  Друзів бажають цю гру: <span className="font-light">2</span>
                </p>
                <div className="w-[155px] flex flex-col gap-[8px]">
                  <div className="relative bg-[var(--color-background-8)] pl-[48px] pr-[12px] h-[36px] rounded-[20px] flex items-center justify-end w-fit cursor-pointer">
                    <img
                      src="/avatar.png"
                      alt="avatar"
                      className="w-[36px] h-[36px] object-cover rounded-full absolute top-0 left-0"
                      loading="lazy"
                    />
                    <p className="text-right text-[16px] font-medium">
                      ChostRogue
                    </p>
                  </div>
                  <div className="relative bg-[var(--color-background-8)] pl-[48px] pr-[12px] h-[36px] rounded-[20px] flex items-center justify-end w-fit cursor-pointer">
                    <img
                      src="/avatar.png"
                      alt="avatar"
                      className="w-[36px] h-[36px] object-cover rounded-full absolute top-0 left-0"
                      loading="lazy"
                    />
                    <p className="text-right text-[16px] font-medium">
                      sanya_KAL
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-[20px] bg-[var(--color-background-15)] p-[20px] flex flex-col gap-[20px] text-[var(--color-background)]">
                <p className="text-[20px] font-bold">
                  Друзів мають цю гру: <span className="font-light">12</span>
                </p>
                <div className="flex gap-[8px] flex-wrap">
                  {nicknames.map((nickname, index) => {
                    return (
                      <div
                        key={index}
                        className="relative bg-[var(--color-background-8)] pl-[48px] pr-[12px] h-[36px] rounded-[20px] flex items-center justify-end w-fit cursor-pointer"
                      >
                        <img
                          src="/avatar.png"
                          alt="avatar"
                          className="w-[36px] h-[36px] object-cover rounded-full absolute top-0 left-0"
                          loading="lazy"
                        />
                        <p className="text-right text-[16px] font-medium">
                          {nickname}
                        </p>
                      </div>
                    )
                  })}
                  <div className="w-[36px] h-[36px] flex items-center justify-center bg-[var(--color-background-18)] rounded-full text-[16px] font-extralight text-[var(--color-background-25)] cursor-pointer">
                    +5
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        }


      </div>

      {glowCoords.map((glow) => (
        <img
          key={JSON.stringify(glow)}
          src="/glow.png"
          className="absolute z-10 opacity-50"
          loading="lazy"
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
