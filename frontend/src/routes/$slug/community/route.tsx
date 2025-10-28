import {
  createFileRoute,
  Outlet,
  useLocation,
  useNavigate,
  useParams,
} from '@tanstack/react-router'
import './style.scss'
import { useState, type ChangeEvent, useRef, useEffect } from 'react'
import { CommunityPostCard } from '@/components/CommunityPostCard'
import { useGamePosts } from '@/api/queries/useCommunity'
import { useGameById } from '@/api/queries/useGame'
import { useAuthState } from '@/api/queries/useAuth'
import { PostType, type PostFilters } from '@/types/community'

const postTypeOptions = [
  { label: 'Усі розділи', value: undefined },
  { label: 'Форум', value: PostType.Discussion },
  { label: 'Скріншоти', value: PostType.Screenshot },
  { label: 'Відео', value: PostType.Video },
  { label: 'Гайди', value: PostType.Guide },
  { label: 'Новини', value: PostType.News },
]

const sortOptions = [
  { value: 'popular', label: 'Спочатку популярні' },
  { value: 'newest', label: 'Спочатку нові' },
  { value: 'rating', label: 'За оцінкою' },
  { value: 'comments', label: 'За кількістю коментарів' },
]

export const Route = createFileRoute('/$slug/community')({
  component: RouteComponent,
})
// Нужно редактировать компоненту GamePostCustomBig под очень большое количество даных в посте
// так же в posts.json сделать 2 больших поста и добавить им уникальный ключ по которому и будет разбивка на GamePostCustomBig и GamePost
// GamePostCustomBig

function RouteComponent() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuthState()

  const isNextPage = location.pathname.split('/')[3]

  const { slug } = useParams({ from: '/$slug/community' })
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedPostType, setSelectedPostType] = useState<
    PostType | undefined
  >(undefined)
  const [selectedSort, setSelectedSort] = useState<
    'popular' | 'newest' | 'rating' | 'comments'
  >('popular')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Get game data
  const { data: game, isLoading: gameLoading } = useGameById(slug)

  // Prepare filters for API
  const filters: PostFilters = {
    type: selectedPostType,
    sortBy: selectedSort,
    search: searchQuery || undefined,
  }

  // Get posts data
  const {
    data: posts,
    isLoading: postsLoading,
    error: postsError,
  } = useGamePosts(game?.data?.id ?? '', filters)

  // Ensure posts is always an array
  const postsData = posts || []

  // Handle clicks outside dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handlePostTypeChange = (postType: PostType | undefined) => {
    setSelectedPostType(postType)
    setSearchQuery('')
  }

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const handleSortChange = (
    sortValue: 'popular' | 'newest' | 'rating' | 'comments',
  ) => {
    setSelectedSort(sortValue)
    setIsDropdownOpen(false)
  }

  const handleCreatePost = () => {
    navigate({
      to: '/$slug/community/createPost',
      params: { slug },
    })
  }

  if (isNextPage) return <Outlet />

  if (gameLoading) {
    return (
      <div className="w-full flex justify-center items-center h-64">
        <div className="text-[#f1fdff]">Завантаження...</div>
      </div>
    )
  }

  if (!game?.data) {
    return (
      <div className="w-full flex justify-center items-center h-64">
        <div className="text-[#f1fdff]">Гра не знайдена</div>
      </div>
    )
  }
  return (
    <div className="w-full flex flex-col md:flex-row gap-[24px] px-4 md:px-0">
      <div className="w-full md:w-[75%] lg:w-[75%] flex flex-col gap-[8px] min-w-0 mb-[64px] md:mb-[256px] justify-start">
        <p className="text-[20px] md:text-[24px] lg:text-[32px] font-bold text-[#f1fdff] font-manrope">
          {game.data.name}
        </p>
        <div className="w-full flex items-center justify-start mb-[14px]">
          <span className="text-[14px] md:text-[16px] text-[#f1fdff] mr-[8px]">
            10 000
          </span>
          <span className="text-[14px] md:text-[16px] text-[#f1fdff] opacity-60 mr-[12px] md:mr-[32px]">
            підписників
          </span>
          <span className="text-[14px] md:text-[16px] text-[#f1fdff] mr-[6px]">
            5 267
          </span>
          <div className="w-[6px] h-[6px] md:w-[8px] md:h-[8px] bg-[#24e5c2] rounded-[100px]"></div>
        </div>

        <div className="w-full flex flex-col gap-[16px] md:gap-[24px]">
          {postsLoading ? (
            <div className="flex justify-center items-center h-32">
              <div className="text-[#f1fdff]">Завантаження постів...</div>
            </div>
          ) : postsError ? (
            <div className="flex justify-center items-center h-32">
              <div className="text-red-400">Помилка завантаження постів</div>
            </div>
          ) : postsData.length > 0 ? (
            postsData.map((post) => (
              <CommunityPostCard key={post.id} post={post} />
            ))
          ) : (
            <div className="flex justify-center items-center h-32">
              <div className="text-[#f1fdff] opacity-60">
                Постів не знайдено
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="w-full md:w-[25%] lg:w-[25%] flex flex-col gap-[24px] md:gap-[42px] mb-[64px] md:mb-[256px] md:min-w-[280px] lg:min-w-[338px]">
        {user && (
          <div className="flex flex-col sm:flex-row gap-[12px] mt-[12px] items-stretch sm:items-center">
            <button
              onClick={handleCreatePost}
              className="max-h-[48px] flex items-center justify-center rounded-[20px] gap-[12px] p-[16px] pl-[25px] pr-[25px] bg-[#24e5c2] hover:bg-[#1fd1a8] transition-colors"
            >
              <svg
                viewBox="0 0 16 16"
                width="16.000000"
                height="16.000000"
                fill="none"
              >
                <path
                  id="Vector"
                  d="M8 16C7.41463 16 7.02439 15.6098 7.02439 15.0244L7.02439 8.97561L0.97561 8.97561C0.390244 8.97561 0 8.58537 0 8C0 7.41463 0.390244 7.02439 0.97561 7.02439L7.02439 7.02439L7.02439 0.97561C7.02439 0.390244 7.41463 0 8 0C8.58537 0 8.97561 0.390244 8.97561 0.97561L8.97561 7.02439L15.0244 7.02439C15.6098 7.02439 16 7.41463 16 8C16 8.58537 15.6098 8.97561 15.0244 8.97561L8.97561 8.97561L8.97561 15.0244C8.97561 15.6098 8.58537 16 8 16Z"
                  fill="#00141f"
                  fillRule="nonzero"
                />
              </svg>
              <p className="text-[#00141f] text-[16px] md:text-[20px] font-medium whitespace-nowrap">
                Створити пост
              </p>
            </button>

            <div className="flex gap-[12px] sm:flex-row">
              <div className="w-full sm:w-[48px] sm:h-[48px] bg-[#046075] rounded-[100px] flex items-center justify-center h-[48px]">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="w-6 h-6"
                >
                  <path
                    d="M4.87664 6.74052C5.37664 5.54052 6.17664 4.44052 7.27664 3.84052C7.77664 3.64052 7.97664 3.04052 7.67664 2.54052C7.37664 2.04052 6.77664 1.94052 6.27664 2.14052C4.77664 3.04052 3.67664 4.44052 3.07664 6.04052C2.87664 6.54052 3.07664 7.14052 3.57664 7.34052C4.07664 7.54052 4.67664 7.34052 4.87664 6.74052Z"
                    fill="#F1FDFF"
                  />
                  <path
                    d="M13.8774 19.4412C13.3774 19.8412 12.6774 20.0412 11.9774 20.0412C11.2774 20.0412 10.5774 19.8412 10.0774 19.4412C9.67739 19.1412 8.97739 19.1412 8.67739 19.6412C8.37739 20.0412 8.37739 20.7412 8.87739 21.0412C9.67739 21.6412 10.7774 22.0412 11.9774 22.0412C13.1774 22.0412 14.2774 21.6412 15.0774 20.9412C15.4774 20.6412 15.5774 19.9412 15.2774 19.5412C14.8774 19.1412 14.2774 19.0412 13.8774 19.4412Z"
                    fill="#F1FDFF"
                  />
                  <path
                    d="M19.3758 11.2412C19.3758 6.94121 16.1758 3.24121 11.9758 3.24121C7.87577 3.24121 4.67577 6.84121 4.67577 11.0412V13.0412C4.67577 14.2412 4.27577 15.1412 3.77577 15.8412C3.37577 16.3412 3.47577 16.9412 3.57577 17.3412C3.77577 17.7412 4.17577 18.3412 4.97577 18.3412H18.9758C19.7758 18.3412 20.1758 17.7412 20.3758 17.3412C20.5758 16.9412 20.5758 16.3412 20.2758 15.8412C19.7758 15.1412 19.3758 14.1412 19.3758 13.0412V11.2412ZM6.67577 11.1412C6.67577 7.84121 9.07577 5.24121 11.9758 5.24121C14.8758 5.24121 17.3758 7.84121 17.3758 11.2412V13.1412C17.3758 14.4412 17.7758 15.6412 18.2758 16.4412H5.77577C6.27577 15.5412 6.67577 14.4412 6.67577 13.1412"
                    fill="#F1FDFF"
                  />
                  <path
                    d="M20.8762 6.04095C20.2762 4.34095 19.0762 3.04095 17.5762 2.14095C17.0762 1.84095 16.4763 2.04095 16.1763 2.54095C15.9763 3.04095 16.1763 3.64095 16.6763 3.94095C17.7763 4.54095 18.6762 5.54095 19.0762 6.74095C19.2762 7.24095 19.8762 7.54095 20.3762 7.34095C20.8762 7.14095 21.0762 6.54095 20.8762 6.04095Z"
                    fill="#F1FDFF"
                  />
                </svg>
              </div>

              <div className="w-full sm:w-[48px] sm:h-[48px] bg-[#046075] rounded-[100px] flex items-center justify-center h-[48px]">
                <svg
                  width="18"
                  height="4"
                  viewBox="0 0 18 4"
                  fill="none"
                  className="w-4 h-2"
                >
                  <path
                    d="M4 2C4 3.10457 3.10457 4 2 4C0.895431 4 0 3.10457 0 2C0 0.895431 0.895431 0 2 0C3.10457 0 4 0.895431 4 2Z"
                    fill="#F1FDFF"
                  />
                  <path
                    d="M9 4C10.1046 4 11 3.10457 11 2C11 0.895431 10.1046 0 9 0C7.89543 0 7 0.895431 7 2C7 3.10457 7.89543 4 9 4Z"
                    fill="#F1FDFF"
                  />
                  <path
                    d="M16 4C17.1046 4 18 3.10457 18 2C18 0.895431 17.1046 0 16 0C14.8954 0 14 0.895431 14 2C14 3.10457 14.8954 4 16 4Z"
                    fill="#F1FDFF"
                  />
                </svg>
              </div>
            </div>
          </div>
        )}
        <div className="w-full flex flex-col p-[16px] md:p-[20px] bg-[#004252] rounded-[16px] md:rounded-[20px]">
          <div className="flex flex-col sm:flex-row sm:items-center gap-[8px] sm:gap-[6px] relative mb-4">
            <p className="text-[rgba(204,248,255,0.65)] text-[14px] md:text-[16px]">
              Сортування:
            </p>
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-[10px] bg-transparent text-[#f1fdff] text-[14px] md:text-[16px] cursor-pointer"
              >
                <span>
                  {sortOptions.find((opt) => opt.value === selectedSort)?.label}
                </span>
                <svg
                  width="12"
                  height="7"
                  viewBox="0 0 12 7"
                  fill="none"
                  className={`transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                >
                  <path
                    d="M6.01384 6.65464C5.81384 6.65464 5.51384 6.55464 5.31384 6.35464L0.313844 1.75464C-0.0861559 1.35464 -0.0861563 0.75464 0.213844 0.35464C0.613844 -0.04536 1.21384 -0.0453604 1.61384 0.25464L5.91384 4.25464L10.2138 0.25464C10.6138 -0.14536 11.2138 -0.04536 11.6138 0.35464C12.0138 0.75464 11.9138 1.35464 11.5138 1.75464L6.51384 6.35464C6.51384 6.55464 6.21384 6.65464 6.01384 6.65464Z"
                    fill="#F1FDFF"
                  />
                </svg>
              </button>

              {isDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 bg-[#004252] border border-[#046075] rounded-[8px] overflow-hidden z-10 min-w-[200px] md:min-w-[280px]">
                  <div className="flex flex-col gap-[2px] p-[10px]">
                    {sortOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => handleSortChange(option.value as any)}
                        className={`flex gap-[10px] items-start px-[12px] py-[6px] rounded-[20px] text-left transition-colors ${
                          option.value === selectedSort
                            ? 'bg-[rgba(55,195,255,0.25)]'
                            : 'hover:bg-[rgba(55,195,255,0.1)]'
                        }`}
                      >
                        <p className="text-[#f1fdff] text-[14px] md:text-[16px] leading-[1.25] tracking-[-0.16px] font-artifakt whitespace-nowrap">
                          {option.label}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <input
            className="w-full bg-[rgba(0,20,31,0.4)] border border-[#046075] rounded-[22px] px-4 py-2.5 text-[#f1fdff] placeholder-[rgba(204,248,255,0.65)] text-[14px] md:text-[16px] mb-4"
            placeholder={`Пошук: ${postTypeOptions.find((opt) => opt.value === selectedPostType)?.label || 'Усі розділи'}`}
            value={searchQuery}
            onChange={handleSearchChange}
          />

          <div className="w-full flex flex-col gap-[6px] md:gap-[8px]">
            {postTypeOptions.map((option) => (
              <button
                key={option.label}
                onClick={() => handlePostTypeChange(option.value)}
                className={`rounded-[12px] p-[8px] md:p-[9px] pl-[12px] pr-[12px] text-[#f1fdff] text-[16px] md:text-[20px] font-bold text-left transition-colors ${
                  option.value === selectedPostType
                    ? 'bg-[rgba(55,195,255,0.25)]'
                    : 'hover:bg-[rgba(55,195,255,0.1)]'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
