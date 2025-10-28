import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { GridIcon, GridRowIcon } from '@/icons'
import { Product } from '@/components/Product'
import { Search } from '@/components'
import { ErrorState } from '@/components/ErrorState'
import { LoadingState } from '@/components/LoadingState'
import { EmptyState } from '@/components/EmptyState'
import { useNewGames } from '@/api/queries/useGame'
import type { GameData } from '@/api/types/game'

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

export const Route = createFileRoute('/new')({
  component: RouteComponent,
})

function RouteComponent() {
  const [linear, setLinear] = useState(false)

  const { data: gamesResponse, isLoading, error, refetch } = useNewGames()

  // Get last 20 games
  const allGames: GameData[] = gamesResponse?.data || []
  const games = allGames.slice(-20)

  return (
    <div className="bg-[var(--color-night-background)] relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-0 relative z-20">
        <div className="flex items-center justify-center">
          <Search className="my-[12px] md:my-[16px] w-full" />
        </div>

        <h2 className="text-[32px] sm:text-[40px] lg:text-[48px] font-bold text-[var(--color-background)]">
          Нові ігри
        </h2>

        <div className="w-full pb-[128px] sm:pb-[192px] lg:pb-[256px]">
          <div className="flex items-center justify-end text-[var(--color-background)]">
            <div className="flex items-center gap-[8px] sm:gap-[16px]">
              <p className="text-[var(--color-background-25)] text-[12px] sm:text-[14px]">
                Вид:
              </p>
              <div onClick={() => setLinear(false)}>
                <GridIcon
                  className={`cursor-pointer hover:text-[var(--color-background-23)] ${
                    !linear && 'text-[var(--color-background-23)]'
                  }`}
                />
              </div>
              <div onClick={() => setLinear(true)}>
                <GridRowIcon
                  className={`cursor-pointer hover:text-[var(--color-background-23)] ${
                    linear ? 'text-[var(--color-background-23)]' : ''
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Loading State */}
          {isLoading && <LoadingState message="Завантаження..." />}

          {/* Error State */}
          {error && (
            <ErrorState
              title="Помилка завантаження ігор"
              message="Не вдалося завантажити список ігор. Спробуйте оновити сторінку."
              onRetry={() => refetch()}
              retryText="Спробувати знову"
            />
          )}

          {/* Empty State */}
          {!isLoading && !error && games.length === 0 && (
            <EmptyState
              title="Ігри не знайдено"
              message="Нові ігри з'являться найближчим часом"
            />
          )}

          {/* Games Grid/List */}
          {!isLoading && !error && games.length > 0 && (
            <div className="mt-[12px] sm:mt-[16px] mb-[6px] sm:mb-[8px]">
              <p className="text-[var(--color-background-25)] text-[12px] sm:text-[14px]">
                Останні нові ігри
              </p>
            </div>
          )}

          {!isLoading && !error && games.length > 0 && (
            <>
              {linear ? (
                <div className="flex flex-col gap-[8px] sm:gap-[12px]">
                  {games.map((game) => (
                    <Product key={game.id} game={game} linear={linear} />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[12px] sm:gap-[16px] lg:gap-[24px]">
                  {games.map((game) => (
                    <Product key={game.id} game={game} linear={linear} />
                  ))}
                </div>
              )}
            </>
          )}
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
