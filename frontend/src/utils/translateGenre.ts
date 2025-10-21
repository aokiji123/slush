/**
 * Hook for handling game genres
 * Note: Genres are already localized by the backend based on the Accept-Language header
 * @returns Function that returns the genre as-is (already translated by backend)
 */
export const useGenreTranslation = () => {
  return (genre: string): string => {
    // Genres are already localized by the backend, so return as-is
    return genre
  }
}
