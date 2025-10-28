import { createFileRoute, Link } from '@tanstack/react-router'
import { useState, useRef, useEffect } from 'react'
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

function RouteComponent() {
  const { t } = useTranslation('library')
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
    data: libraryData = { data: { items: [], totalPages: 0, totalCount: 0 } },
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
    data: communityPosts = [],
    isLoading: communityLoading,
    isError: communityError,
  } = useLibraryPosts({
    sortBy: 'popular',
    limit: 10,
  })

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed)
  }

  // Close sidebar when screen size increases to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsSidebarCollapsed(true)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const filteredCommunityPosts = communityPosts.filter(
    (post) => post.type !== PostType.News,
  )

  const allGames = libraryData.data.items
  const filteredGames = allGames.filter((game) => {
    const matchesSearch = game.name
      .toLowerCase()
      .includes(debouncedSearchText.toLowerCase())

    if (activeFilter === 'favorites') {
      return matchesSearch && game.isFavorite === true
    }

    if (activeFilter === 'myCollection') {
      return matchesSearch
    }

    // 'all' filter - return all games
    return matchesSearch
  })

  return (
    <div className="bg-[var(--color-night-background)] min-h-screen flex flex-col">
      {/* Sidebar - Hidden on mobile, collapsible on larger screens */}
      <div
        className={`hidden lg:block ${isSidebarCollapsed ? 'w-[64px]' : 'w-[15%] min-w-[200px]'} absolute left-0 top-[90px] h-full bg-[var(--color-background-8)] z-40 text-white transition-all duration-300`}
      >
        <div className="p-[16px] sm:p-[20px] flex flex-col gap-[16px] sm:gap-[20px]">
          <div
            className={`flex items-center ${isSidebarCollapsed ? 'justify-center' : 'justify-between'}`}
          >
            {!isSidebarCollapsed && (
              <h2 className="text-[18px] sm:text-[20px] font-bold">
                {t('filters.all')}
              </h2>
            )}
            <button
              type="button"
              onClick={toggleSidebar}
              className="cursor-pointer hover:opacity-80 transition-opacity flex items-center justify-center"
            >
              <IoFilter size={20} className="sm:w-[24px] sm:h-[24px]" />
            </button>
          </div>

          {!isSidebarCollapsed && (
            <div className="flex flex-col gap-[12px] sm:gap-[16px] lg:gap-[20px]">
              {isLoading ? (
                <div className="text-center py-4">
                  <p className="text-[12px] sm:text-[14px] text-[var(--color-background-25)]">
                    {t('common.loading')}
                  </p>
                </div>
              ) : isError ? (
                <div className="text-center py-4">
                  <p className="text-[12px] sm:text-[14px] text-red-400">
                    {t('games.errorLoading')}
                  </p>
                </div>
              ) : filteredGames.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-[12px] sm:text-[14px] text-[var(--color-background-25)]">
                    {searchText
                      ? t('search.noResults')
                      : t('empty.noGamesInLibrary')}
                  </p>
                </div>
              ) : (
                filteredGames.map((game) => (
                  <Link
                    key={game.id}
                    to="/$slug"
                    params={{ slug: game.slug }}
                    className="flex items-center gap-[12px] sm:gap-[16px] cursor-pointer hover:bg-[var(--color-background-15)] transition-colors p-[8px] sm:p-2 rounded-[6px] sm:rounded-[8px]"
                  >
                    <OptimizedImage
                      src={game.mainImage}
                      alt={game.name}
                      className="w-[32px] h-[32px] sm:w-[40px] sm:h-[40px] rounded-[8px] sm:rounded-[10px] object-cover object-center flex-shrink-0"
                      loading="lazy"
                    />
                    <p className="text-[14px] sm:text-[16px] font-bold line-clamp-1">
                      {game.name}
                    </p>
                  </Link>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      <div
        className={`w-full ${
          isSidebarCollapsed ? 'lg:pl-[80px]' : 'lg:ml-[15%]'
        } ${
          isSidebarCollapsed ? 'lg:w-full' : 'lg:w-[85%]'
        } z-20 transition-all duration-300`}
      >
        <div
          className={`container mx-auto px-4 sm:px-6 lg:px-8 ${
            isSidebarCollapsed ? 'lg:pr-[32px]' : ''
          }`}
        >
          <Search
            className="my-[12px] sm:my-[14px] lg:my-[16px] w-full"
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            searchText={searchText}
            onSearchTextChange={setSearchText}
          />

          <div className="flex flex-col gap-[10px] sm:gap-[12px] mb-[24px] sm:mb-[32px] lg:mb-[48px]">
            <h3 className="text-[18px] sm:text-[20px] lg:text-[24px] font-bold text-white">
              {t('empty.news')}
            </h3>

            <div className="relative">
              <Swiper
                modules={[Navigation]}
                spaceBetween={16}
                slidesPerView="auto"
                breakpoints={{
                  640: { spaceBetween: 20 },
                  1024: { spaceBetween: 24 },
                }}
                onSwiper={(swiper) => {
                  newsSwiperRef.current = swiper
                }}
                className="w-full"
              >
                {newsLoading ? (
                  <SwiperSlide className="w-full">
                    <div className="flex items-center justify-center h-[300px] sm:h-[400px] lg:h-[450px]">
                      <p className="text-[var(--color-background-25)] text-[14px] sm:text-base">
                        {t('common.loading')}
                      </p>
                    </div>
                  </SwiperSlide>
                ) : newsError ? (
                  <SwiperSlide className="w-full">
                    <div className="flex items-center justify-center h-[300px] sm:h-[400px] lg:h-[450px]">
                      <p className="text-red-400 text-[14px] sm:text-base">
                        {t('common.error')}
                      </p>
                    </div>
                  </SwiperSlide>
                ) : newsPosts && newsPosts.length > 0 ? (
                  newsPosts.map((post) => (
                    <SwiperSlide
                      key={post.id}
                      className="w-full sm:w-[400px] lg:w-[475px]"
                    >
                      <Link
                        to="/$slug/community/post/$id"
                        params={{ slug: post.gameId, id: post.id }}
                      >
                        <LibraryNewsCard post={post} onClick={() => {}} />
                      </Link>
                    </SwiperSlide>
                  ))
                ) : (
                  <SwiperSlide className="w-full">
                    <div className="flex items-center justify-center h-[300px] sm:h-[400px] lg:h-[450px]">
                      <p className="text-[var(--color-background-25)] text-[14px] sm:text-base">
                        {t('empty.noNewsPosts')}
                      </p>
                    </div>
                  </SwiperSlide>
                )}
              </Swiper>
              {newsPosts && newsPosts.length > 1 && (
                <>
                  <div
                    className="absolute bottom-[12px] sm:bottom-[16px] -left-2 sm:-left-3 top-1/2 -translate-y-1/2 z-10 size-[20px] sm:size-[24px] rounded-full bg-white flex items-center justify-center cursor-pointer shadow-lg"
                    onClick={() => newsSwiperRef.current?.slidePrev()}
                  >
                    <FaChevronLeft className="size-[10px] sm:size-[12px]" />
                  </div>
                  <div
                    className="absolute bottom-[12px] sm:bottom-[16px] -right-2 sm:-right-3 top-1/2 -translate-y-1/2 z-10 size-[20px] sm:size-[24px] rounded-full bg-white flex items-center justify-center cursor-pointer shadow-lg"
                    onClick={() => newsSwiperRef.current?.slideNext()}
                  >
                    <FaChevronRight className="size-[10px] sm:size-[12px]" />
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-[10px] sm:gap-[12px] mb-[24px] sm:mb-[32px] lg:mb-[48px]">
            <h3 className="text-[18px] sm:text-[20px] lg:text-[24px] font-bold text-white">
              {t('empty.communityPicks')}
            </h3>

            <div className="relative">
              <Swiper
                modules={[Navigation]}
                spaceBetween={16}
                slidesPerView="auto"
                breakpoints={{
                  640: { spaceBetween: 20 },
                  1024: { spaceBetween: 24 },
                }}
                onSwiper={(swiper) => {
                  communitySwiperRef.current = swiper
                }}
                className="w-full"
              >
                {communityLoading ? (
                  <SwiperSlide className="w-full">
                    <div className="flex items-center justify-center h-[300px] sm:h-[350px] lg:h-[400px]">
                      <p className="text-[var(--color-background-25)] text-[14px] sm:text-base">
                        {t('common.loading')}
                      </p>
                    </div>
                  </SwiperSlide>
                ) : communityError ? (
                  <SwiperSlide className="w-full">
                    <div className="flex items-center justify-center h-[300px] sm:h-[350px] lg:h-[400px]">
                      <p className="text-red-400 text-[14px] sm:text-base">
                        {t('common.error')}
                      </p>
                    </div>
                  </SwiperSlide>
                ) : filteredCommunityPosts.length > 0 ? (
                  filteredCommunityPosts.map((post) => (
                    <SwiperSlide
                      key={post.id}
                      className="w-full sm:w-[400px] lg:w-[475px]"
                    >
                      <Link
                        to="/$slug/community/post/$id"
                        params={{ slug: post.gameId, id: post.id }}
                      >
                        <LibraryPostCard post={post} onClick={() => {}} />
                      </Link>
                    </SwiperSlide>
                  ))
                ) : (
                  <SwiperSlide className="w-full">
                    <div className="flex items-center justify-center h-[300px] sm:h-[350px] lg:h-[400px]">
                      <p className="text-[var(--color-background-25)] text-[14px] sm:text-base">
                        {t('empty.noCommunityHighlights')}
                      </p>
                    </div>
                  </SwiperSlide>
                )}
              </Swiper>
              {filteredCommunityPosts.length > 1 && (
                <>
                  <div
                    className="absolute bottom-[12px] sm:bottom-[16px] -left-2 sm:-left-3 top-1/2 -translate-y-1/2 z-10 size-[20px] sm:size-[24px] rounded-full bg-white flex items-center justify-center cursor-pointer shadow-lg"
                    onClick={() => communitySwiperRef.current?.slidePrev()}
                  >
                    <FaChevronLeft className="size-[10px] sm:size-[12px]" />
                  </div>
                  <div
                    className="absolute bottom-[12px] sm:bottom-[16px] -right-2 sm:-right-3 top-1/2 -translate-y-1/2 z-10 size-[20px] sm:size-[24px] rounded-full bg-white flex items-center justify-center cursor-pointer shadow-lg"
                    onClick={() => communitySwiperRef.current?.slideNext()}
                  >
                    <FaChevronRight className="size-[10px] sm:size-[12px]" />
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-[10px] w-full mb-[128px] sm:mb-[192px] lg:mb-[256px]">
            <div className="flex items-center gap-[16px] sm:gap-[32px] lg:gap-[45px] text-[18px] sm:text-[20px] lg:text-[24px]">
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
                <FiPlusCircle size={20} className="sm:w-[24px] sm:h-[24px]" />
              </div>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <p className="text-[var(--color-background-25)] text-[14px] sm:text-[16px] lg:text-lg">
                  {t('common.loading')}
                </p>
              </div>
            ) : isError ? (
              <div className="flex items-center justify-center py-8">
                <p className="text-red-400 text-[14px] sm:text-[16px] lg:text-lg">
                  {t('games.errorLoading')}
                </p>
              </div>
            ) : filteredGames.length === 0 ? (
              <div className="flex items-center justify-center py-8">
                <p className="text-[var(--color-background-25)] text-[14px] sm:text-[16px] lg:text-lg">
                  {searchText
                    ? t('search.noResults')
                    : t('empty.noGamesInLibrary')}
                </p>
              </div>
            ) : (
              <div
                className={
                  viewMode === 'grid'
                    ? 'flex flex-wrap gap-[12px] sm:gap-[16px] lg:gap-[24px]'
                    : 'flex flex-col gap-[12px] sm:gap-[16px]'
                }
              >
                {filteredGames.map((game) =>
                  viewMode === 'grid' ? (
                    <Link
                      key={game.id}
                      to="/$slug"
                      params={{ slug: game.slug }}
                      className="w-[calc(50%-6px)] sm:w-[calc(33.33%-11px)] md:w-[calc(25%-18px)] lg:w-[225px] aspect-[3/4] rounded-[16px] sm:rounded-[20px] cursor-pointer hover:opacity-90 transition-opacity block"
                    >
                      <OptimizedImage
                        src={game.mainImage}
                        alt={game.name}
                        className="w-full h-full object-cover rounded-[16px] sm:rounded-[20px]"
                        loading="lazy"
                      />
                    </Link>
                  ) : (
                    <Link
                      key={game.id}
                      to="/$slug"
                      params={{ slug: game.slug }}
                      className="flex items-center h-[100px] sm:h-[120px] gap-[12px] sm:gap-[16px] lg:gap-[24px] bg-[var(--color-background-15)] rounded-[16px] sm:rounded-[20px] transition-colors overflow-hidden cursor-pointer hover:bg-[var(--color-background-17)]"
                    >
                      <OptimizedImage
                        src={game.mainImage}
                        alt={game.name}
                        className="w-[200px] sm:w-[240px] lg:w-[320px] h-full object-cover"
                        loading="lazy"
                      />
                      <div className="flex flex-col justify-between pr-[16px] sm:pr-[20px] lg:pr-[24px] gap-[6px] sm:gap-[8px] flex-1">
                        <h3 className="text-white text-[16px] sm:text-[18px] lg:text-[20px] font-bold font-manrope">
                          {game.name}
                        </h3>
                      </div>
                    </Link>
                  ),
                )}
              </div>
            )}

            {libraryData.data.totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={libraryData.data.totalPages}
                onPageChange={setCurrentPage}
                className="my-[16px] sm:my-[20px] lg:my-[24px]"
              />
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Button - Only shown on mobile when sidebar is collapsed */}
      {isSidebarCollapsed && (
        <div className="lg:hidden fixed bottom-[24px] right-[24px] z-50">
          <button
            type="button"
            onClick={() => setIsSidebarCollapsed(false)}
            className="w-[56px] h-[56px] rounded-full bg-[var(--color-background-21)] text-white flex items-center justify-center shadow-lg hover:bg-[var(--color-background-22)] transition-colors"
          >
            <IoFilter size={24} />
          </button>
        </div>
      )}

      {/* Mobile Sidebar Overlay */}
      {!isSidebarCollapsed && (
        <div
          className="lg:hidden fixed inset-0 bg-opacity-30 z-40"
          onClick={() => setIsSidebarCollapsed(true)}
        />
      )}

      {/* Mobile Sidebar */}
      <div
        className={`lg:hidden fixed top-[90px] left-0 w-[280px] sm:w-[320px] h-full bg-[var(--color-background-8)] z-50 text-white transition-all duration-300 ${
          isSidebarCollapsed ? '-translate-x-full' : 'translate-x-0'
        }`}
      >
        <div className="p-[16px] flex flex-col gap-[16px]">
          <div className="flex items-center justify-between">
            <h2 className="text-[18px] font-bold">{t('filters.all')}</h2>
            <button
              type="button"
              onClick={() => setIsSidebarCollapsed(true)}
              className="cursor-pointer hover:opacity-80 transition-opacity flex items-center justify-center"
            >
              <IoFilter size={20} />
            </button>
          </div>

          {isLoading ? (
            <div className="text-center py-4">
              <p className="text-[12px] text-[var(--color-background-25)]">
                {t('common.loading')}
              </p>
            </div>
          ) : isError ? (
            <div className="text-center py-4">
              <p className="text-[12px] text-red-400">
                {t('games.errorLoading')}
              </p>
            </div>
          ) : filteredGames.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-[12px] text-[var(--color-background-25)]">
                {searchText
                  ? t('search.noResults')
                  : t('empty.noGamesInLibrary')}
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-[12px]">
              {filteredGames.map((game) => (
                <Link
                  key={game.id}
                  to="/$slug"
                  params={{ slug: game.slug }}
                  onClick={() => setIsSidebarCollapsed(true)}
                  className="flex items-center gap-[12px] cursor-pointer hover:bg-[var(--color-background-15)] transition-colors p-2 rounded-[8px]"
                >
                  <OptimizedImage
                    src={game.mainImage}
                    alt={game.name}
                    className="w-[32px] h-[32px] rounded-[8px] object-cover object-center flex-shrink-0"
                    loading="lazy"
                  />
                  <p className="text-[14px] font-bold line-clamp-1">
                    {game.name}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Collection Creation Modal */}
      <CollectionModal
        isOpen={isCollectionModalOpen}
        onClose={() => setIsCollectionModalOpen(false)}
      />
    </div>
  )
}
