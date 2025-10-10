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
