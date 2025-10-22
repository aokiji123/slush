export interface Activity {
  id: string
  type: 'wish' | 'buy' | 'screenshot'
  username: string
  avatar: string
  isOnline: boolean
  gameName: string
  gameImage: string
  gameImages?: string[]
  screenshotCount?: number
  date: string
}

export const mockActivities: Activity[] = [
  {
    id: '1',
    type: 'wish',
    username: 'Олександр',
    avatar: '/avatar.png',
    isOnline: true,
    gameName: 'Якась гра, яка дуже всім сподобається',
    gameImage: '/cyberpunk-image.png',
    date: 'today',
  },
  {
    id: '2',
    type: 'buy',
    username: 'Марія',
    avatar: '/avatar.png',
    isOnline: true,
    gameName: 'Якась гра, яка дуже всім сподобається',
    gameImage: '/cyberpunk-image.png',
    date: 'today',
  },
  {
    id: '3',
    type: 'screenshot',
    username: 'Дмитро',
    avatar: '/avatar.png',
    isOnline: true,
    gameName: 'Cyberpunk 2077',
    gameImage: '/cyberpunk-image.png',
    gameImages: [
      '/cyberpunk-image.png',
      '/game-image.png',
      '/ghost-of-tsushima.png',
    ],
    screenshotCount: 10,
    date: 'today',
  },
  {
    id: '4',
    type: 'wish',
    username: 'Анна',
    avatar: '/avatar.png',
    isOnline: true,
    gameName: 'Якась гра, яка дуже всім сподобається',
    gameImage: '/cyberpunk-image.png',
    date: '2024-04-23',
  },
]
