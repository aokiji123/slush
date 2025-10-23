export interface ProfileStatistics {
  gamesCount: number
  dlcCount: number
  wishlistCount: number
  reviewsCount: number
  friendsCount: number
  badgesCount: number
  postsCount: number
  level: number
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
