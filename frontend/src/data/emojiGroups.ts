// Category labels and mapping from emojibase group names to our app's sections

export type EmojiGroupKey =
  | 'frequently'
  | 'smileys'
  | 'animals'
  | 'food'
  | 'activities'
  | 'objects'
  | 'symbols'

export const GROUP_LABELS: Record<Exclude<EmojiGroupKey, 'frequently'>, string> = {
  smileys: 'Smileys & People',
  animals: 'Animals & Nature',
  food: 'Food & Drink',
  activities: 'Activities',
  objects: 'Objects',
  symbols: 'Symbols',
}

// emojibase uses numeric group IDs (from actual data analysis):
// 0: smileys-emotion, 1: people-body, 2: components (skip skin tones)
// 3: animals-nature, 4: food-drink, 5: travel-places, 6: activities
// 7: objects, 8: symbols, 9: flags (skip)
export function mapEmojibaseGroupToKey(group: number | string): EmojiGroupKey | null {
  const num = typeof group === 'string' ? parseInt(group, 10) : group
  if (num === 0) return 'smileys' // smileys-emotion
  if (num === 1) return 'smileys' // people-body -> smileys & people
  if (num === 2) return null // components (skin tone modifiers) - skip
  if (num === 3) return 'animals' // animals-nature
  if (num === 4) return 'food' // food-drink
  if (num === 5) return 'activities' // travel-places -> activities
  if (num === 6) return 'activities' // activities
  if (num === 7) return 'objects' // objects
  if (num === 8) return 'symbols' // symbols
  if (num === 9) return null // flags - skip per scope
  return null
}

export interface EmojiRecord {
  emoji: string
  name: string
  group: Exclude<EmojiGroupKey, 'frequently'>
  shortcodes?: string[]
}


