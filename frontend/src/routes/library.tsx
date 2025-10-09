import { createFileRoute } from '@tanstack/react-router'
import { IoFilter } from 'react-icons/io5'
import { FiPlusCircle } from 'react-icons/fi'
import { Search } from '@/components'

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
  return (
    <div className="bg-[var(--color-night-background)] min-h-screen flex flex-col">
      <div className="w-[15%] min-w-[200px] absolute left-0 top-[90px] h-full bg-[var(--color-background-8)] z-20 text-white">
        <div className="p-[20px] flex flex-col gap-[20px]">
          <div className="flex items-center justify-between">
            <h2 className="text-[20px] font-bold">Усі ігри</h2>
            <IoFilter size={24} />
          </div>

          <div className="flex flex-col gap-[20px]">
            {myGames.map((game) => (
              <div key={game.id} className="flex items-center gap-[16px]">
                <img
                  src={game.image}
                  alt={game.name}
                  className="w-[40px] h-[40px] rounded-[10px] object-cover object-center"
                />
                <p className="text-[16px] font-bold">{game.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="w-[85%] ml-[15%] z-20">
        <div className="container mx-auto px-[32px]">
          <Search className="my-[16px] w-full" />

          {/* TODO: community area? */}

          <div className="flex flex-col gap-[10px] w-full">
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

            <div className="flex flex-wrap gap-[24px]">
              {myGames.map((game) => (
                <div
                  key={game.id}
                  className="w-[225px] h-[300px] bg-white rounded-[20px]"
                >
                  <img
                    src={game.image}
                    alt={game.name}
                    className="w-full h-full object-cover rounded-[20px]"
                  />
                </div>
              ))}
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
