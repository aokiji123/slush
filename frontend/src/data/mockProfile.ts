import type { User } from '@/api/types/user'
import type { Friend } from '@/types/friendship'

export const mockProfile: User & {
  level: number
  isOnline: boolean
  badges: Array<{
    id: string
    name: string
    icon: string
    description: string
  }>
  stats: {
    games: number
    dlc: number
    wishlist: number
  }
  friends: Friend[]
} = {
  id: '1',
  nickname: 'MrZubarik',
  email: 'mr.zubarik@example.com',
  bio: 'У пошуках нових пригод! Кожен новий рівень – це можливість пережити незабутні моменти та здобути новий досвід.',
  lang: 'uk',
  avatar: '/avatar.png',
  banner: '/banner.png',
  balance: 0,
  isOnline: true,
  lastSeenAt: new Date().toISOString(),
  level: 5,
  badges: [
    { id: '1', name: 'Першопрохідець', icon: '🏆', description: 'Завершив 10 ігор' },
    { id: '2', name: 'Колекціонер', icon: '🎮', description: 'Зібрав 100 ігор' },
    { id: '3', name: 'Критик', icon: '⭐', description: 'Написав 50 рецензій' },
    { id: '4', name: 'Гід', icon: '📖', description: 'Створив 5 гайдів' },
    { id: '5', name: 'Соціальний', icon: '👥', description: 'Має 25 друзів' },
  ],
  stats: {
    games: 1234,
    dlc: 121,
    wishlist: 2564,
  },
  friends: [
    {
      id: '1',
      userId: '2',
      nickname: 'GamerPro',
      avatar: '/avatar.png',
      isOnline: true,
      level: 7,
    },
    {
      id: '2',
      userId: '3',
      nickname: 'GameMaster',
      avatar: '/avatar.png',
      isOnline: false,
      level: 4,
    },
    {
      id: '3',
      userId: '4',
      nickname: 'PlayerOne',
      avatar: '/avatar.png',
      isOnline: true,
      level: 6,
    },
    {
      id: '4',
      userId: '5',
      nickname: 'QuestHunter',
      avatar: '/avatar.png',
      isOnline: false,
      level: 3,
    },
    {
      id: '5',
      userId: '6',
      nickname: 'LevelUp',
      avatar: '/avatar.png',
      isOnline: true,
      level: 8,
    },
  ],
}
