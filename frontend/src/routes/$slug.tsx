import {
  FaApple,
  FaChevronDown,
  FaChevronLeft,
  FaChevronRight,
  FaChevronUp,
  FaPlaystation,
  FaStar,
  FaWindows,
  FaXbox,
} from 'react-icons/fa'
import {
  createFileRoute,
  useLocation,
  useNavigate,
} from '@tanstack/react-router'
import { useState } from 'react'
import { GameSortDropdown, MasonryLayout, Search } from '@/components'
import { GameComment } from '@/components/GameComment'
import { ComplaintIcon, FavoriteIcon, RepostIcon } from '@/icons'

export const Route = createFileRoute('/$slug')({
  component: RouteComponent,
})

const tabs = [
  {
    name: 'Про гру',
    href: '/$id',
  },
  {
    name: 'Характеристики',
    href: '/$id/characteristics',
  },
  {
    name: 'Спільнота',
    href: '/$id/community',
  },
]

const tags = [
  'шутер',
  'екшн',
  'кіберпанк',
  'оголеність',
  'відкритий світ',
  'майбутнє',
  'насильство',
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

const commentsText = [
  'Чудова гра',
  'Імба. 10 з 10. Незважаючи на баги і проблему з економікою (купую за 50к продаю за 1к) це імба, всі любители рпг з відкритим світом і сюжетом мають в це пограти. Дякуєм за українську!',
  'Топчиковий топ. Дякуємо панам та панессам з CDPR за українську локалізацію основної гри та DLC Ілюзія Свободи. Прийдеться проходити гру уже третій раз.',
  'До зустрічі, Найт-Сіті',
]

function RouteComponent() {
  const navigate = useNavigate()
  const location = useLocation()
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false)

  const isActiveTab = (tabHref: string) => {
    return (
      location.pathname ===
      tabHref.replace('$id', location.pathname.split('/')[1])
    )
  }

  return (
    <div className="bg-[var(--color-night-background)] relative">
      <div className="container mx-auto">
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

        <div className="w-full flex gap-[24px]">
          <div className="w-[75%] flex flex-col gap-[8px]">
            <p className="text-[32px] font-bold text-[var(--color-background)]">
              Cyberpunk 2077
            </p>
            <img
              src="/cyberpunk.png"
              alt="cyberpunk"
              className="w-full object-cover h-[435px] rounded-[20px]"
            />
            <div className="w-full relative mb-[24px]">
              <div className="overflow-x-auto w-full pb-[16px]">
                <div className="flex gap-[16px] w-max relative">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((item) => {
                    return (
                      <div
                        key={item}
                        className="w-[180px] h-[90px] flex-shrink-0"
                      >
                        <img
                          src="/cyberpunk-image.png"
                          alt="cyberpunk"
                          className="w-full object-cover h-full rounded-[20px]"
                        />
                      </div>
                    )
                  })}
                </div>
                <div className="w-[24px] h-[24px] flex items-center justify-center bg-white rounded-[20px] cursor-pointer absolute -left-3 top-[35px] z-10">
                  <FaChevronLeft size={16} />
                </div>
                <div className="w-[24px] h-[24px] flex items-center justify-center bg-white rounded-[20px] cursor-pointer absolute -right-3 top-[35px] z-10">
                  <FaChevronRight size={16} />
                </div>
                <div className="h-[8px] w-full bg-[var(--sky-25)] absolute bottom-0 left-0 rounded-[20px] flex items-center px-[2px]">
                  <div className="h-[4px] w-[160px] bg-[var(--color-night-background)] rounded-[20px]"></div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-[8px] mb-[24px]">
              {tags.map((tag) => {
                return (
                  <div className="text-[14px] font-medium min-w-[66px] h-[24px] flex items-center justify-center bg-[var(--color-background-16)] py-[4px] px-[12px] rounded-[20px] text-[var(--color-background-25)]">
                    {tag}
                  </div>
                )
              })}
              <div className="w-[32px] h-[24px] flex items-center justify-center bg-[var(--color-background-16)] rounded-[20px] text-[var(--color-background)] cursor-pointer">
                <FaChevronDown />
              </div>
            </div>

            <div className="flex flex-col items-center gap-[8px] text-[var(--color-background)] mb-[48px]">
              <p className="text-[20px] font-light">
                Cyberpunk 2077 — пригодницький бойовик і рольова гра з відкритим
                світом. Дія відбувається у темному майбутньому Найт-Сіті,
                небезпечного мегаполіса, одержимого владою, гламуром і
                ненаситною модифікацією тіла.
              </p>
              <FaChevronDown size={24} />
            </div>

            <div className="mb-[24px] text-[var(--color-background)] flex flex-col gap-[12px]">
              <p className="text-[32px] font-bold">Комплекти</p>
              <div className="w-full bg-[var(--color-background-15)] min-h-[475px] rounded-[20px] p-[20px] flex flex-col gap-[20px]">
                <p className="text-[24px] font-bold">Cyberpunk 2077</p>
                <div className="p-[16px] rounded-[20px] flex flex-col gap-[12px] bg-[var(--color-background-8)]">
                  <p className="text-[20px] font-normal">
                    Cyberpunk 2077 — пригодницький рольовий екшн у відкритому
                    світі мегаполісу Найт-Сіті, де у ролі кіберпанкового
                    найманця ви боротиметеся за виживання. Гра вдосконалена і
                    має новий безкоштовний вміст. Налаштуйте персонажа й ігровий
                    стиль, виконуючи завдання, нарощуючи репутацію і відкриваючи
                    апгрейди. Будуючи взаємини і здійснюючи вибір, ви формуєте
                    сюжет і світ навколо. Тут народжуються легенди. Якою буде
                    ваша?
                  </p>
                  <div className="text-[20px] font-normal">
                    <p className="text-[var(--color-background-25)]">Вміст:</p>
                    <p className="ml-3">
                      • Cyberpunk{' '}
                      <span className="text-[var(--color-background-25)]">
                        (базова гра)
                      </span>
                    </p>
                    <p className="ml-3">• Крутий контент</p>
                    <p className="ml-3">• Дуже корисний контент</p>
                    <p className="ml-3">• Якийсь цікавий контент</p>
                  </div>
                </div>
                <div className="flex items-center justify-end">
                  <div className="flex items-center gap-[18px]">
                    <p className="text-[20px] font-normal text-[var(--color-background)]">
                      1 099₴
                    </p>
                    <div className="h-[48px] flex items-center justify-center py-[12px] px-[26px] text-[20px] font-medium rounded-[20px] bg-[var(--color-background-21)] text-[var(--color-night-background)]">
                      <p>У кошик</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="w-full bg-[var(--color-background-15)] min-h-[265px] rounded-[20px] p-[20px] flex flex-col gap-[20px]">
                <p className="text-[24px] font-bold">
                  Cyberpunk: Повне видання
                </p>
                <div className="p-[16px] rounded-[20px] flex flex-col gap-[12px] bg-[var(--color-background-8)]">
                  <div className="text-[20px] font-normal">
                    <p className="text-[var(--color-background-25)]">Вміст:</p>
                    <p className="ml-3">
                      • Cyberpunk{' '}
                      <span className="text-[var(--color-background-25)]">
                        (базова гра)
                      </span>
                    </p>
                    <p className="ml-3">• Cyberpunk 2077: Ілюзія свободи</p>
                  </div>
                </div>

                <div className="flex items-center justify-end">
                  <div className="flex items-center gap-[18px]">
                    <div>
                      <div className="flex items-center gap-[16px] h-[24px] justify-end">
                        <p className="px-[8px] py-[4px] rounded-[20px] bg-[var(--color-background-10)] text-[var(--color-night-background)] h-[24px] flex items-center justify-center">
                          {' '}
                          -8%
                        </p>
                        <div className="flex items-center gap-[8px]">
                          <p className="text-[20px] font-bold">999₴</p>
                          <p className="text-[20px] font-normal line-through text-[var(--color-background-25)]">
                            1159₴
                          </p>
                        </div>
                      </div>
                      <p className="text-[14px] font-normal text-[var(--color-background-25)]">
                        Знижка діє до 24.07.2024 10:00
                      </p>
                    </div>
                    <div className="h-[48px] flex items-center justify-center py-[12px] px-[26px] text-[20px] font-medium rounded-[20px] bg-[var(--color-background-21)] text-[var(--color-night-background)]">
                      <p>У кошик</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-[20px]">
                <div className="flex items-center justify-between">
                  <p className="text-[32px] font-bold">Інші DLC</p>
                  <p className="text-[16px] flex items-center gap-[8px]">
                    Усі DLC <FaChevronRight />
                  </p>
                </div>

                <div className="flex flex-col gap-[8px]">
                  <div className="p-[20px] rounded-[20px] bg-[var(--color-background-15)] flex items-center justify-between text-[20px] font-bold">
                    <p>Cyberpunk 2077 Bonus Content</p>
                    <p>Безкоштовно</p>
                  </div>

                  <div className="p-[20px] rounded-[20px] bg-[var(--color-background-15)] flex items-center justify-between text-[20px] font-bold">
                    <p>Cyberpunk 2077 REDmod</p>
                    <p>Безкоштовно</p>
                  </div>

                  <div className="p-[20px] rounded-[20px] bg-[var(--color-background-15)] flex items-center justify-between text-[20px] font-bold">
                    <p>Cyberpunk 2077: Ілюзія свободи</p>
                    <p>549₴</p>
                  </div>
                </div>

                <div className="flex items-center justify-end">
                  <div className="flex items-center gap-[16px]">
                    <p className="text-[20px] font-normal text-[var(--color-background)]">
                      549₴
                    </p>
                    <div className="h-[48px] flex items-center justify-center py-[12px] px-[26px] text-[20px] font-medium rounded-[20px] bg-[var(--color-background-21)] text-[var(--color-night-background)]">
                      <p>Додати в кошик усі DLC</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full mb-[256px] flex flex-col gap-[24px]">
              <div className="flex items-center justify-between">
                <p className="text-[32px] font-bold text-[var(--color-background)]">
                  Рецензії
                </p>
                <div className="h-[48px] flex items-center justify-center py-[8px] px-[20px] text-[16px] font-medium rounded-[20px] bg-[var(--color-background-21)] text-[var(--color-night-background)]">
                  <p>Написати рецензію</p>
                </div>
              </div>

              <div className="flex items-center gap-[10px] relative">
                <p className="text-[16px] font-normal text-[var(--color-background-25)]">
                  Сортування:
                </p>
                <button
                  className="flex items-center gap-[8px] text-[16px] font-normal text-[var(--color-background)] cursor-pointer"
                  onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
                >
                  Спочатку популярні{' '}
                  {isSortDropdownOpen ? <FaChevronUp /> : <FaChevronDown />}
                </button>
                {isSortDropdownOpen && <GameSortDropdown />}
              </div>

              <div className="flex flex-col gap-[32px]">
                <MasonryLayout
                  columns={2}
                  gap="16px"
                  className="text-[var(--color-background)]"
                >
                  <GameComment text={commentsText[0]} stars={5} />
                  <GameComment text={commentsText[1]} stars={4} />
                  <GameComment text={commentsText[2]} stars={4} />
                  <GameComment text={commentsText[3]} stars={3} />
                </MasonryLayout>

                <div className="flex items-center justify-center cursor-pointer">
                  <FaChevronDown
                    size={24}
                    className="text-[var(--color-background)]"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="w-[25%] flex flex-col gap-[8px]">
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
      </div>
    </div>
  )
}
