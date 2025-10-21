export type GameData = {
  id: string
  name: string
  slug: string
  mainImage: string
  images: string[]
  price: number
  discountPercent: number
  salePrice: number
  saleDate: string | null
  rating: number
  genre: string[]
  description: string
  releaseDate: string
  developer: string
  publisher: string
  platforms: string[]
  isDlc: boolean
  baseGameId: string | null
}

export type Game = {
  success: boolean
  message: string
  data: GameData
}

export type GamesListResponse = {
  success: boolean
  message: string
  data: GameData[]
}

export type PagedGamesResponse = {
  success: boolean
  message: string
  data: {
    items: GameData[]
    page: number
    pageSize: number
    totalCount: number
    totalPages: number
  }
}

export type Review = {
  id: string
  gameId: string
  userId: string
  username: string
  userAvatar: string
  content: string
  rating: number
  createdAt: string
  likes: number
  isLikedByCurrentUser: boolean
}

export type CreateReviewRequest = {
  gameId: string
  content: string
  rating: number
}

export type GameCharacteristics = {
  success: boolean
  message: string
  data: {
    gameId: string
    platform: string
    minVersion: string
    minCpu: string
    minRam: string
    minGpu: string
    minDirectX: string
    minMemory: string
    minAudioCard: string
    recommendedVersion: string
    recommendedCpu: string
    recommendedRam: string
    recommendedGpu: string
    recommendedDirectX: string
    recommendedMemory: string
    recommendedAudioCard: string
    controller: string
    additional: string
    langAudio: string[]
    langText: string[]
  }
}
