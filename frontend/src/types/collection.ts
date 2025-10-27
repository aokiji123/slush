import type { GameData } from '@/api/types/game'

export interface Collection {
  id: string
  name: string
  description?: string
  gamesCount: number
  createdAt: string
}

export interface CollectionDetails extends Collection {
  games: GameData[]
  updatedAt: string
}

export interface CreateCollectionDto {
  name: string
  description?: string
}

export interface UpdateCollectionDto {
  name: string
  description?: string
}

