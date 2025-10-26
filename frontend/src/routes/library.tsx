import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { IoFilter } from 'react-icons/io5'
import { FiPlusCircle } from 'react-icons/fi'
import { Search, LibraryPostCard, LibraryNewsCard } from '@/components'
import { BsThreeDots } from 'react-icons/bs'
import { FaChevronLeft, FaChevronRight, FaRegStar } from 'react-icons/fa'
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
  const [currentPage] = useState(1)
  const debouncedSearchText = useDebounce(searchText, 300)

  // Swiper refs
  const newsSwiperRef = useRef<any>(null)
  const communitySwiperRef = useRef<any>(null)

  const { data: libraryData, isLoading, isError } = useMyLibraryQuery({
    page: currentPage,
    limit: 20,
  })

  // Fetch news posts from user's library
  const { data: newsPosts, isLoading: newsLoading, isError: newsError } = useLibraryPosts({
    type: PostType.News,
    sortBy: 'recent',
    limit: 10,
  })

  // Fetch popular posts (excluding news) from user's library
  const { data: communityPosts, isLoading: communityLoading, isError: communityError } = useLibraryPosts({
    sortBy: 'popular',
    limit: 10,
  })

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed)
  }

  // Filter out news posts from community highlights
  const filteredCommunityPosts = communityPosts?.filter(post => post.type !== PostType.News) || []

  // Filter games based on search text
  const filteredGames = libraryData?.data?.items?.filter(game => 
    game.name.toLowerCase().includes(debouncedSearchText.toLowerCase())
  ) || []

  // Navigation handlers
  const handlePostClick = (postId: string, gameId: string) => {
    navigate({ to: '/$slug/community/post/$id', params: { slug: gameId, id: postId } })
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
                  <p className="text-[var(--color-background-25)]">{t('common.loading')}</p>
                </div>
              ) : isError ? (
                <div className="text-center py-4">
                  <p className="text-red-400">{t('games.errorLoading')}</p>
                </div>
              ) : filteredGames.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-[var(--color-background-25)]">
                    {searchText ? t('search.noResults') : t('empty.noGamesInLibrary')}
                  </p>
                </div>
              ) : (
                filteredGames.map((game) => (
                  <div 
                    key={game.id} 
                    className="flex items-center gap-[16px] cursor-pointer hover:bg-[var(--color-background-15)] transition-colors p-2 rounded-[8px]"
                    onClick={() => handleGameClick(game.slug)}
                  >
                    <img
                      src={game.mainImage}
                      alt={game.name}
                      className="w-[40px] h-[40px] rounded-[10px] object-cover object-center flex-shrink-0"
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
            <h3 className="text-[24px] font-bold text-white">{t('empty.news')}</h3>

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
                      <p className="text-[var(--color-background-25)]">{t('common.loading')}</p>
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
                      <p className="text-[var(--color-background-25)]">{t('empty.noNewsPosts')}</p>
                    </div>
                  </SwiperSlide>
                )}
              </Swiper>
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
                      <p className="text-[var(--color-background-25)]">{t('common.loading')}</p>
                    </div>
                  </SwiperSlide>
                ) : communityError ? (
                  <SwiperSlide className="w-full">
                    <div className="flex items-center justify-center h-[400px]">
                      <p className="text-red-400">{t('common.error')}</p>
                    </div>
                  </SwiperSlide>
                ) : filteredCommunityPosts && filteredCommunityPosts.length > 0 ? (
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
                      <p className="text-[var(--color-background-25)]">{t('empty.noCommunityHighlights')}</p>
                    </div>
                  </SwiperSlide>
                )}
              </Swiper>
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
            </div>
          </div>

          <div className="flex flex-col gap-[10px] w-full mb-[256px]">
            <div className="flex items-center gap-[45px] text-[24px]">
              <p className="text-[var(--color-background-25)] font-bold hover:text-[var(--color-background-21)] border-b-3 border-transparent hover:border-[var(--color-background-21)] cursor-pointer font-manrope">
                {t('filters.all')}
              </p>
              <p className="text-[var(--color-background-25)] font-bold hover:text-[var(--color-background-21)] border-b-3 border-transparent hover:border-[var(--color-background-21)] cursor-pointer font-manrope">
                {t('filters.favorites')}
              </p>
              <p className="text-[var(--color-background-25)] font-bold hover:text-[var(--color-background-21)] border-b-3 border-transparent hover:border-[var(--color-background-21)] cursor-pointer font-manrope">
                {t('empty.myCollection')}
              </p>
              <div className="cursor-pointer text-[var(--color-background-21)]">
                <FiPlusCircle size={24} />
              </div>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <p className="text-[var(--color-background-25)] text-lg">{t('common.loading')}</p>
              </div>
            ) : isError ? (
              <div className="flex items-center justify-center py-8">
                <p className="text-red-400 text-lg">{t('games.errorLoading')}</p>
              </div>
            ) : filteredGames.length === 0 ? (
              <div className="flex items-center justify-center py-8">
                <p className="text-[var(--color-background-25)] text-lg">
                  {searchText ? t('search.noResults') : t('empty.noGamesInLibrary')}
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
                      <img
                        src={game.mainImage}
                        alt={game.name}
                        className="w-full h-full object-cover rounded-[20px]"
                      />
                    </div>
                  ) : (
                    <div
                      key={game.id}
                      className="flex items-center h-[120px] gap-[24px] bg-[var(--color-background-15)] rounded-[20px] transition-colors overflow-hidden cursor-pointer hover:bg-[var(--color-background-17)]"
                      onClick={() => handleGameClick(game.slug)}
                    >
                      <img
                        src={game.mainImage}
                        alt={game.name}
                        className="w-[320px] h-full object-cover"
                      />
                      <div className="flex flex-col justify-between pr-[24px] gap-[8px] flex-1">
                        <h3 className="text-white text-[20px] font-bold font-manrope">
                          {game.name}
                        </h3>
                        <div className="w-full flex items-center justify-between">
                          <button className="h-[40px] w-[110px] flex items-center justify-center text-[16px] font-normal rounded-[20px] bg-[var(--color-background-21)] text-[var(--color-night-background)] cursor-pointer">
                            Download
                          </button>
                          <div className="flex flex-col">
                            <p className="text-[16px] font-normal text-[var(--color-background-25)]">
                              Disk Size
                            </p>
                            <p className="text-[20px] font-bold text-white">
                              10 GB
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
