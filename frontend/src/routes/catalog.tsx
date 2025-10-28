import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState, useMemo } from 'react'
import { Search, SidebarFilter, Pagination } from '@/components'
import { GridIcon, GridRowIcon } from '@/icons'
import { Product } from '@/components/Product'
import { ErrorState } from '@/components/ErrorState'
import { LoadingState } from '@/components/LoadingState'
import { EmptyState } from '@/components/EmptyState'
import { useSearchGames } from '@/api/queries/useGame'
import type { CatalogFilters, CatalogSearchParams } from '@/types/catalog'
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

export const Route = createFileRoute('/catalog')({
  validateSearch: (search: Record<string, unknown>): CatalogSearchParams => {
    return {
      title: typeof search.title === 'string' ? search.title : undefined,
      search: typeof search.search === 'string' ? search.search : undefined,
      genres: typeof search.genres === 'string' ? search.genres : undefined,
      platforms:
        typeof search.platforms === 'string' ? search.platforms : undefined,
      minPrice:
        typeof search.minPrice === 'string' ? search.minPrice : undefined,
      maxPrice:
        typeof search.maxPrice === 'string' ? search.maxPrice : undefined,
      onSale: typeof search.onSale === 'string' ? search.onSale : undefined,
      isDlc: typeof search.isDlc === 'string' ? search.isDlc : undefined,
      page: typeof search.page === 'string' ? search.page : undefined,
      limit: typeof search.limit === 'string' ? search.limit : undefined,
      sortBy: typeof search.sortBy === 'string' ? search.sortBy : undefined,
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  const searchParams = Route.useSearch()
  return <Catalog searchParams={searchParams} />
}

const Catalog = ({ searchParams }: { searchParams: CatalogSearchParams }) => {
  const navigate = useNavigate()
  const [linear, setLinear] = useState(false)

  // Convert URL search params to filter state
  const filters = useMemo((): CatalogFilters => {
    return {
      search: searchParams.search,
      genres: searchParams.genres?.split(',').filter(Boolean),
      platforms: searchParams.platforms?.split(',').filter(Boolean),
      minPrice: searchParams.minPrice
        ? parseFloat(searchParams.minPrice)
        : undefined,
      maxPrice: searchParams.maxPrice
        ? parseFloat(searchParams.maxPrice)
        : undefined,
      onSale: searchParams.onSale === 'true',
      isDlc: searchParams.isDlc === 'true',
      page: searchParams.page ? parseInt(searchParams.page) : 1,
      limit: searchParams.limit ? parseInt(searchParams.limit) : 20,
      sortBy: searchParams.sortBy,
    }
  }, [searchParams])

  // Always use the search games hook - it can handle both filtered and unfiltered requests
  const {
    data: gamesResponse,
    isLoading,
    error,
    refetch,
  } = useSearchGames(filters.search || '', {
    genres: filters.genres,
    platforms: filters.platforms,
    minPrice: filters.minPrice,
    maxPrice: filters.maxPrice,
    onSale: filters.onSale,
    isDlc: filters.isDlc,
    page: filters.page,
    limit: filters.limit,
    sortBy: filters.sortBy,
  })

  const games: GameData[] = gamesResponse?.data?.items || []
  const totalPages = gamesResponse?.data?.totalPages || 1
  const currentPage = filters.page || 1

  // Update URL when filters change
  const updateFilters = (newFilters: CatalogFilters) => {
    const urlParams: Record<string, string> = {}

    if (newFilters.search) urlParams.search = newFilters.search
    if (newFilters.genres?.length)
      urlParams.genres = newFilters.genres.join(',')
    if (newFilters.platforms?.length)
      urlParams.platforms = newFilters.platforms.join(',')
    if (newFilters.minPrice !== undefined)
      urlParams.minPrice = newFilters.minPrice.toString()
    if (newFilters.maxPrice !== undefined)
      urlParams.maxPrice = newFilters.maxPrice.toString()
    if (newFilters.onSale) urlParams.onSale = 'true'
    if (newFilters.isDlc) urlParams.isDlc = 'true'
    if (newFilters.page && newFilters.page > 1)
      urlParams.page = newFilters.page.toString()
    if (newFilters.limit && newFilters.limit !== 20)
      urlParams.limit = newFilters.limit.toString()
    if (newFilters.sortBy) urlParams.sortBy = newFilters.sortBy

    navigate({
      to: '/catalog',
      search: urlParams,
    })
  }

  const handleSortChange = (sortBy: string) => {
    updateFilters({
      ...filters,
      sortBy: sortBy || undefined,
      page: 1,
    })
  }

  const handlePageChange = (page: number) => {
    updateFilters({
      ...filters,
      page,
    })
  }

  return (
    <div className="bg-[var(--color-night-background)] relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-0 relative z-20">
        <div className="flex items-center justify-center">
          <Search className="my-[12px] md:my-[16px] w-full" />
        </div>

        {searchParams.title && (
          <h2 className="text-[28px] md:text-[36px] lg:text-[48px] font-bold text-[var(--color-background)] mt-[20px] md:mt-[32px]">
            {searchParams.title}
          </h2>
        )}

        <div className="w-full flex flex-col lg:flex-row gap-[16px] md:gap-[24px] mt-[12px] md:mt-[16px]">
          <div className="w-full lg:w-[25%]">
            <SidebarFilter
              filters={filters}
              onFiltersChange={updateFilters}
              onSortChange={handleSortChange}
            />
          </div>
          <div className="w-full lg:w-[75%] pb-[64px] md:pb-[256px]">
            <div className="flex items-center justify-end text-[var(--color-background)]">
              <div className="flex items-center gap-[8px] md:gap-[16px]">
                <p className="text-[12px] md:text-[14px] text-[var(--color-background-25)]">
                  Вид:
                </p>
                <div onClick={() => setLinear(false)}>
                  <GridIcon
                    className={`w-5 h-5 md:w-6 md:h-6 cursor-pointer hover:text-[var(--color-background-23)] transition-colors ${
                      !linear && 'text-[var(--color-background-23)]'
                    }`}
                  />
                </div>
                <div onClick={() => setLinear(true)}>
                  <GridRowIcon
                    className={`w-5 h-5 md:w-6 md:h-6 cursor-pointer hover:text-[var(--color-background-23)] transition-colors ${
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
                message="Спробуйте змінити фільтри або пошуковий запит"
              />
            )}

            {/* Games Grid/List */}
            {!isLoading && !error && games.length > 0 && (
              <>
                {/* Results info */}
                <div className="mt-[12px] md:mt-[16px] mb-[6px] md:mb-[8px]">
                  <p className="text-[var(--color-background-25)] text-[12px] md:text-[14px]">
                    {games.length > 0
                      ? `Знайдено ${games.length} ігор${totalPages > 1 ? ` (сторінка ${currentPage} з ${totalPages})` : ''}`
                      : 'Ігри не знайдено'}
                  </p>
                </div>

                {linear ? (
                  <div className="flex flex-col gap-[8px] md:gap-[12px]">
                    {games.map((game) => (
                      <Product key={game.id} game={game} linear={linear} />
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[16px] md:gap-[24px]">
                    {games.map((game) => (
                      <Product key={game.id} game={game} linear={linear} />
                    ))}
                  </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-[24px] md:mt-[32px]">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={handlePageChange}
                    />
                  </div>
                )}
              </>
            )}
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
