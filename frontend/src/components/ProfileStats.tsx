import { OptimizedImage } from './OptimizedImage'

interface ProfileStatsProps {
  games: number
  dlc: number
  wishlist: number
  gameThumbnails: string[]
}

export const ProfileStats = ({ games, dlc, wishlist, gameThumbnails }: ProfileStatsProps) => {
  const stats = [
    { label: 'Ігор', value: games },
    { label: 'DLC', value: dlc },
    { label: 'Бажаних', value: wishlist },
  ]

  return (
    <div className="bg-[var(--color-background-8)] rounded-[20px] p-[20px] mb-[24px]">
      <div className="flex items-center justify-between mb-[20px]">
        <h2 className="text-[20px] font-bold text-[var(--color-background)] font-manrope">
          Колекція ігор
        </h2>
      </div>

      {/* Stats Cards */}
      <div className="flex justify-center gap-[20px] mb-[20px]">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="w-[200px] h-[114px] bg-[var(--color-background-15)] rounded-[20px] flex items-center justify-center"
          >
            <div className="text-center">
              <div className="text-[50px] font-bold text-[var(--color-background)] mb-[4px]">
                {stat.value.toLocaleString()}
              </div>
              <div className="text-[24px] text-[var(--color-background-25)] opacity-65">
                {stat.label}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Game Thumbnails */}
      <div className="flex gap-[8px]">
        {gameThumbnails.slice(0, 4).map((thumbnail) => (
          <div
            key={thumbnail}
            className="w-[257px] h-[124px] bg-[var(--color-background-15)] rounded-[20px] overflow-hidden"
          >
            <OptimizedImage
              src={thumbnail}
              alt="Game thumbnail"
              className="w-full h-full object-cover"
              loading="lazy"
              placeholder="/game-image.png"
            />
          </div>
        ))}
      </div>
    </div>
  )
}
