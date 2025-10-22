export type CatalogFilters = {
  search?: string
  genres?: string[]
  platforms?: string[]
  minPrice?: number
  maxPrice?: number
  onSale?: boolean
  isDlc?: boolean
  page?: number
  limit?: number
  sortBy?: string
}

export type CatalogSearchParams = {
  title?: string
  search?: string
  genres?: string
  platforms?: string
  minPrice?: string
  maxPrice?: string
  onSale?: string
  isDlc?: string
  page?: string
  limit?: string
  sortBy?: string
}

export type SortOption = {
  label: string
  value: string
}

export type FilterOption = {
  label: string
  value: string
}

export type FilterSection = {
  title: string
  key: keyof CatalogFilters | 'price'
  options: FilterOption[]
}

export type PriceRange = {
  min?: number
  max?: number
}

export const PRICE_RANGES: Record<string, PriceRange> = {
  free: { min: 0, max: 0 },
  under100: { min: 0, max: 100 },
  under300: { min: 0, max: 300 },
  under600: { min: 0, max: 600 },
  under900: { min: 0, max: 900 },
  unlimited: {},
}

export const SORT_OPTIONS: SortOption[] = [
  { label: 'Relevance', value: '' },
  { label: 'Popular', value: 'Rating:desc' },
  { label: 'Newest', value: 'ReleaseDate:desc' },
  { label: 'Rating', value: 'Rating:desc' },
  { label: 'Price: Low to High', value: 'Price:asc' },
  { label: 'Price: High to Low', value: 'Price:desc' },
  { label: 'Name: A-Z', value: 'Name:asc' },
  { label: 'Name: Z-A', value: 'Name:desc' },
]
