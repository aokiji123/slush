import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { IoFilter } from 'react-icons/io5'
import { FiPlusCircle } from 'react-icons/fi'
import {
  Search,
  LibraryPostCard,
  LibraryNewsCard,
  OptimizedImage,
  Pagination,
  CollectionModal,
} from '@/components'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import { useMyLibraryQuery } from '@/api/queries/useLibrary'
import { useLibraryPosts } from '@/api/queries/useCommunity'
import { useDebounce } from '@/hooks/useDebounce'
import { PostType } from '@/types/community'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation } from 'swiper/modules'

// @ts-expect-error - Swiper CSS imports are valid
import 'swiper/css'
// @ts-expect-error - Swiper CSS imports are valid
import 'swiper/css/navigation'

export const Route = createFileRoute('/library')({
  component: RouteComponent,
})

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
  const { t } = useTranslation('library')
  const navigate = useNavigate()
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'row'>('grid')
  const [searchText, setSearchText] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [activeFilter, setActiveFilter] = useState<
    'all' | 'favorites' | 'myCollection'
  >('all')
  const [isCollectionModalOpen, setIsCollectionModalOpen] = useState(false)
  const debouncedSearchText = useDebounce(searchText, 300)

  // Swiper refs
  const newsSwiperRef = useRef<any>(null)
  const communitySwiperRef = useRef<any>(null)

  const {
    data: libraryData,
    isLoading,
    isError,
  } = useMyLibraryQuery({
    page: currentPage,
    limit: 20,
  })

  // Fetch news posts from user's library
  const {
    data: newsPosts,
    isLoading: newsLoading,
    isError: newsError,
  } = useLibraryPosts({
    type: PostType.News,
    sortBy: 'recent',
    limit: 10,
  })

  // Fetch popular posts (excluding news) from user's library
  const {
    data: communityPosts,
    isLoading: communityLoading,
    isError: communityError,
  } = useLibraryPosts({
    sortBy: 'popular',
    limit: 10,
  })

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed)
  }

  // Filter out news posts from community highlights
  const filteredCommunityPosts =
    communityPosts?.filter((post) => post.type !== PostType.News) || []

  // Filter games based on active filter and search text
  const filteredGames = (libraryData?.data?.items ?? []).filter((game) => {
    const matchesSearch = game.name
      .toLowerCase()
      .includes(debouncedSearchText.toLowerCase())

    if (activeFilter === 'favorites') {
      return matchesSearch && game.isFavorite === true
    }

    // TODO: Implement collections when backend supports it
    if (activeFilter === 'myCollection') {
      // For now, return all games - will be implemented when backend supports collections
      return matchesSearch
    }

    // 'all' filter - return all games
    return matchesSearch
  })

  // Navigation handlers
  const handlePostClick = (postId: string, gameId: string) => {
    navigate({
      to: '/$slug/community/post/$id',
      params: { slug: gameId, id: postId },
    })
  }

  const handleGameClick = (gameSlug: string) => {
    navigate({ to: '/$slug', params: { slug: gameSlug } })
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
              <h2 className="text-[20px] font-bold">{t('filters.all')}</h2>
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
              {isLoading ? (
                <div className="text-center py-4">
                  <p className="text-[var(--color-background-25)]">
                    {t('common.loading')}
                  </p>
                </div>
              ) : isError ? (
                <div className="text-center py-4">
                  <p className="text-red-400">{t('games.errorLoading')}</p>
                </div>
              ) : filteredGames.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-[var(--color-background-25)]">
                    {searchText
                      ? t('search.noResults')
                      : t('empty.noGamesInLibrary')}
                  </p>
                </div>
              ) : (
                filteredGames.map((game) => (
                  <div
                    key={game.id}
                    className="flex items-center gap-[16px] cursor-pointer hover:bg-[var(--color-background-15)] transition-colors p-2 rounded-[8px]"
                    onClick={() => handleGameClick(game.slug)}
                  >
                    <OptimizedImage
                      src={game.mainImage}
                      alt={game.name}
                      className="w-[40px] h-[40px] rounded-[10px] object-cover object-center flex-shrink-0"
                      loading="lazy"
                    />
                    <p className="text-[16px] font-bold line-clamp-1">
                      {game.name}
                    </p>
                  </div>
                ))
              )}
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
            searchText={searchText}
            onSearchTextChange={setSearchText}
          />

          <div className="flex flex-col gap-[12px] mb-[48px]">
            <h3 className="text-[24px] font-bold text-white">
              {t('empty.news')}
            </h3>

            <div className="relative">
              <Swiper
                modules={[Navigation]}
                spaceBetween={24}
                slidesPerView="auto"
                onSwiper={(swiper) => {
                  newsSwiperRef.current = swiper
                }}
                className="w-full"
              >
                {newsLoading ? (
                  <SwiperSlide className="w-full">
                    <div className="flex items-center justify-center h-[450px]">
                      <p className="text-[var(--color-background-25)]">
                        {t('common.loading')}
                      </p>
                    </div>
                  </SwiperSlide>
                ) : newsError ? (
                  <SwiperSlide className="w-full">
                    <div className="flex items-center justify-center h-[450px]">
                      <p className="text-red-400">{t('common.error')}</p>
                    </div>
                  </SwiperSlide>
                ) : newsPosts && newsPosts.length > 0 ? (
                  newsPosts.map((post) => (
                    <SwiperSlide key={post.id} className="w-[475px]">
                      <LibraryNewsCard
                        post={post}
                        onClick={() => handlePostClick(post.id, post.gameId)}
                      />
                    </SwiperSlide>
                  ))
                ) : (
                  <SwiperSlide className="w-full">
                    <div className="flex items-center justify-center h-[450px]">
                      <p className="text-[var(--color-background-25)]">
                        {t('empty.noNewsPosts')}
                      </p>
                    </div>
                  </SwiperSlide>
                )}
              </Swiper>
              {newsPosts && newsPosts.length > 1 && (
                <>
                  <div
                    className="absolute bottom-[16px] -left-3 top-1/2 -translate-y-1/2 z-10 size-[24px] rounded-full bg-white flex items-center justify-center cursor-pointer shadow-lg"
                    onClick={() => newsSwiperRef.current?.slidePrev()}
                  >
                    <FaChevronLeft className="size-[12px]" />
                  </div>
                  <div
                    className="absolute bottom-[16px] -right-3 top-1/2 -translate-y-1/2 z-10 size-[24px] rounded-full bg-white flex items-center justify-center cursor-pointer shadow-lg"
                    onClick={() => newsSwiperRef.current?.slideNext()}
                  >
                    <FaChevronRight className="size-[12px]" />
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-[12px] mb-[48px]">
            <h3 className="text-[24px] font-bold text-white">
              {t('empty.communityPicks')}
            </h3>

            <div className="relative">
              <Swiper
                modules={[Navigation]}
                spaceBetween={24}
                slidesPerView="auto"
                onSwiper={(swiper) => {
                  communitySwiperRef.current = swiper
                }}
                className="w-full"
              >
                {communityLoading ? (
                  <SwiperSlide className="w-full">
                    <div className="flex items-center justify-center h-[400px]">
                      <p className="text-[var(--color-background-25)]">
                        {t('common.loading')}
                      </p>
                    </div>
                  </SwiperSlide>
                ) : communityError ? (
                  <SwiperSlide className="w-full">
                    <div className="flex items-center justify-center h-[400px]">
                      <p className="text-red-400">{t('common.error')}</p>
                    </div>
                  </SwiperSlide>
                ) : filteredCommunityPosts.length > 0 ? (
                  filteredCommunityPosts.map((post) => (
                    <SwiperSlide key={post.id} className="w-[475px]">
                      <LibraryPostCard
                        post={post}
                        onClick={() => handlePostClick(post.id, post.gameId)}
                      />
                    </SwiperSlide>
                  ))
                ) : (
                  <SwiperSlide className="w-full">
                    <div className="flex items-center justify-center h-[400px]">
                      <p className="text-[var(--color-background-25)]">
                        {t('empty.noCommunityHighlights')}
                      </p>
                    </div>
                  </SwiperSlide>
                )}
              </Swiper>
              {filteredCommunityPosts.length > 1 && (
                <>
                  <div
                    className="absolute bottom-[16px] -left-3 top-1/2 -translate-y-1/2 z-10 size-[24px] rounded-full bg-white flex items-center justify-center cursor-pointer shadow-lg"
                    onClick={() => communitySwiperRef.current?.slidePrev()}
                  >
                    <FaChevronLeft className="size-[12px]" />
                  </div>
                  <div
                    className="absolute bottom-[16px] -right-3 top-1/2 -translate-y-1/2 z-10 size-[24px] rounded-full bg-white flex items-center justify-center cursor-pointer shadow-lg"
                    onClick={() => communitySwiperRef.current?.slideNext()}
                  >
                    <FaChevronRight className="size-[12px]" />
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-[10px] w-full mb-[256px]">
            <div className="flex items-center gap-[45px] text-[24px]">
              <p
                className={`font-bold cursor-pointer font-manrope transition-colors ${
                  activeFilter === 'all'
                    ? 'text-[var(--color-background-21)] border-b-2 border-[var(--color-background-21)]'
                    : 'text-[var(--color-background-25)] hover:text-[var(--color-background-21)]'
                }`}
                onClick={() => setActiveFilter('all')}
              >
                {t('filters.all')}
              </p>
              <p
                className={`font-bold cursor-pointer font-manrope transition-colors ${
                  activeFilter === 'favorites'
                    ? 'text-[var(--color-background-21)] border-b-2 border-[var(--color-background-21)]'
                    : 'text-[var(--color-background-25)] hover:text-[var(--color-background-21)]'
                }`}
                onClick={() => setActiveFilter('favorites')}
              >
                {t('filters.favorites')}
              </p>
              <p
                className={`font-bold cursor-pointer font-manrope transition-colors ${
                  activeFilter === 'myCollection'
                    ? 'text-[var(--color-background-21)] border-b-2 border-[var(--color-background-21)]'
                    : 'text-[var(--color-background-25)] hover:text-[var(--color-background-21)]'
                }`}
                onClick={() => setActiveFilter('myCollection')}
              >
                {t('empty.myCollection')}
              </p>
              <div
                className="cursor-pointer text-[var(--color-background-21)] hover:opacity-80 transition-opacity"
                onClick={() => setIsCollectionModalOpen(true)}
              >
                <FiPlusCircle size={24} />
              </div>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <p className="text-[var(--color-background-25)] text-lg">
                  {t('common.loading')}
                </p>
              </div>
            ) : isError ? (
              <div className="flex items-center justify-center py-8">
                <p className="text-red-400 text-lg">
                  {t('games.errorLoading')}
                </p>
              </div>
            ) : filteredGames.length === 0 ? (
              <div className="flex items-center justify-center py-8">
                <p className="text-[var(--color-background-25)] text-lg">
                  {searchText
                    ? t('search.noResults')
                    : t('empty.noGamesInLibrary')}
                </p>
              </div>
            ) : (
              <div
                className={
                  viewMode === 'grid'
                    ? 'flex flex-wrap gap-[24px]'
                    : 'flex flex-col gap-[16px]'
                }
              >
                {filteredGames.map((game) =>
                  viewMode === 'grid' ? (
                    <div
                      key={game.id}
                      className="w-[225px] h-[300px] rounded-[20px] cursor-pointer hover:opacity-90 transition-opacity"
                      onClick={() => handleGameClick(game.slug)}
                    >
                      <OptimizedImage
                        src={game.mainImage}
                        alt={game.name}
                        className="w-full h-full object-cover rounded-[20px]"
                        loading="lazy"
                      />
                    </div>
                  ) : (
                    <div
                      key={game.id}
                      className="flex items-center h-[120px] gap-[24px] bg-[var(--color-background-15)] rounded-[20px] transition-colors overflow-hidden cursor-pointer hover:bg-[var(--color-background-17)]"
                      onClick={() => handleGameClick(game.slug)}
                    >
                      <OptimizedImage
                        src={game.mainImage}
                        alt={game.name}
                        className="w-[320px] h-full object-cover"
                        loading="lazy"
                      />
                      <div className="flex flex-col justify-between pr-[24px] gap-[8px] flex-1">
                        <h3 className="text-white text-[20px] font-bold font-manrope">
                          {game.name}
                        </h3>
                      </div>
                    </div>
                  ),
                )}
              </div>
            )}

            {libraryData?.data && libraryData.data.totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={libraryData.data.totalPages}
                onPageChange={setCurrentPage}
                className="my-[24px]"
              />
            )}
          </div>
        </div>
      </div>

      {/* {glowCoords.map((glow) => (
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
      ))} */}

      {/* Collection Creation Modal */}
      <CollectionModal
        isOpen={isCollectionModalOpen}
        onClose={() => setIsCollectionModalOpen(false)}
      />
    </div>
  )
}
