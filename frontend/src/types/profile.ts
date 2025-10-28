export interface ProfileStatistics {
  gamesCount: number
  dlcCount: number
  wishlistCount: number
  reviewsCount: number
  friendsCount: number
  badgesCount: number
  postsCount: number
  screenshotsCount: number
  videosCount: number
  guidesCount: number
  level: number
  experience: number
  nextLevelExperience: number
}

export interface ProfileComment {
  id: string
  profileUserId: string
  authorId: string
  authorNickname: string
  authorAvatar?: string
  content: string
  createdAt: string
}

export interface CreateProfileComment {
  profileUserId: string
  content: string
}

export interface Badge {
  id: string
  name: string
  description: string
  icon: string
  requiredValue: number
  requirementType: string
  createdAt: string
}

export interface UserBadge {
  id: string
  userId: string
  badgeId: string
  earnedAt: string
  badge: Badge
}

export interface FriendDetails {
  id: string
  nickname: string
  avatar?: string
  isOnline: boolean
  level: number
  lastSeenAt?: string
  friendshipCreatedAt: string
}

export interface ProfileTabToolbarProps {
  searchText: string
  onSearchChange: (text: string) => void
  searchPlaceholder: string
  sortBy: string
  onSortChange: (sortBy: string) => void
  sortOptions: Array<{ label: string; value: string }>
  showFilters?: boolean
  onFiltersClick?: () => void
  className?: string
}

export interface ProfileTabSectionProps {
  title: string
  children: React.ReactNode
  defaultExpanded?: boolean
  icon?: React.ReactNode
  className?: string
}

export interface ProfileGameCardProps {
  game: {
    id: string
    name: string
    mainImage: string
    genre: string[]
    rating: number
    developer?: string
    publisher?: string
    description?: string
  }
  status?: 'inLibrary' | 'inWishlist' | 'shared'
  statusText?: string
  onClick?: () => void
  className?: string
}

export interface ProfileDiscussionCardProps {
  post: {
    id: string
    title: string
    content?: string
    authorNickname: string
    authorAvatar?: string
    createdAt: string
    gameId?: string
    gameMainImage?: string
    likesCount: number
    commentsCount: number
    media?: Array<{ type: string; url: string }>
  }
  onNavigate?: () => void
  className?: string
}

export interface ProfileMediaCardProps {
  post: {
    id: string
    title: string
    createdAt: string
    gameId?: string
    gameMainImage?: string
    likesCount: number
    commentsCount: number
    type: 'screenshot' | 'video'
    media?: Array<{ type: string; url: string }>
  }
  onNavigate?: () => void
  className?: string
}

export interface ProfileGuideCardProps {
  post: {
    id: string
    title: string
    content?: string
    authorNickname: string
    authorAvatar?: string
    createdAt: string
    gameId?: string
    gameMainImage?: string
    likesCount: number
    commentsCount: number
    media?: Array<{ type: string; url: string }>
  }
  onNavigate?: () => void
  className?: string
}

export interface ProfileReviewCardProps {
  review: {
    id: string
    title: string
    content: string
    rating: number
    gameName: string
    gameImage: string
    gameId: string
    authorNickname: string
    authorAvatar?: string
    createdAt: string
    likesCount: number
    commentsCount: number
  }
  onNavigate?: () => void
  className?: string
}
