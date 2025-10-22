import axiosInstance from '.'
import type { GameDto } from './types/game'
import type {
  LibraryDto,
  AddToLibraryRequest,
  PagedResult,
  OwnedGameDto,
  LibraryQueryParams,
  ApiResponse,
} from './types/library'

export async function getMyLibrary(): Promise<ApiResponse<GameDto[]>> {
  const { data } = await axiosInstance.get('/library/me')
  return data
}

export async function getMyLibraryWithQuery(
  params: LibraryQueryParams
): Promise<ApiResponse<PagedResult<GameDto>>> {
  const searchParams = new URLSearchParams()
  
  if (params.page) searchParams.append('page', params.page.toString())
  if (params.limit) searchParams.append('limit', params.limit.toString())
  if (params.sortBy) searchParams.append('sortBy', params.sortBy)
  if (params.sortDirection) searchParams.append('sortDirection', params.sortDirection)
  if (params.search) searchParams.append('search', params.search)
  if (params.genres?.length) searchParams.append('genres', params.genres.join(','))
  if (params.platforms?.length) searchParams.append('platforms', params.platforms.join(','))
  if (params.minPrice !== undefined) searchParams.append('minPrice', params.minPrice.toString())
  if (params.maxPrice !== undefined) searchParams.append('maxPrice', params.maxPrice.toString())
  if (params.onSale !== undefined) searchParams.append('onSale', params.onSale.toString())
  if (params.isDlc !== undefined) searchParams.append('isDlc', params.isDlc.toString())

  const { data } = await axiosInstance.get(`/library/me/query?${searchParams.toString()}`)
  return data
}

export async function addToMyLibrary(request: AddToLibraryRequest): Promise<ApiResponse<boolean>> {
  const { data } = await axiosInstance.post('/library/me', request)
  return data
}

export async function checkGameOwnership(gameId: string): Promise<boolean> {
  try {
    const { data } = await axiosInstance.get(`/library/me/ownership/${gameId}`)
    return data.data || false
  } catch (error) {
    console.error('Failed to check game ownership:', error)
    return false
  }
}

export async function getOwnedGames(page: number = 1, limit: number = 20): Promise<PagedResult<OwnedGameDto>> {
  const { data } = await axiosInstance.get(`/library/owned?page=${page}&limit=${limit}`)
  return data
}
