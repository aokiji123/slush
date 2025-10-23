import type { PostDto } from '@/types/community'
import type { Review } from '@/api/types/game'

export const mockScreenshots = [
  {
    id: '1',
    url: '/sekiro.jpg',
    title: 'Sekiro: Shadows Die Twice',
    isFeatured: true,
  },
  {
    id: '2',
    url: '/witcher-3.jpg',
    title: 'The Witcher 3',
    isFeatured: false,
  },
  {
    id: '3',
    url: '/cyberpunk.png',
    title: 'Cyberpunk 2077',
    isFeatured: false,
  },
  {
    id: '4',
    url: '/ghost-of-tsushima.png',
    title: 'Ghost of Tsushima',
    isFeatured: false,
  },
  {
    id: '5',
    url: '/destiny-2.png',
    title: 'Destiny 2',
    isFeatured: false,
  },
  {
    id: '6',
    url: '/baldurs-gate-3.png',
    title: 'Baldur\'s Gate 3',
    isFeatured: false,
  },
  {
    id: '7',
    url: '/duck-simulator.png',
    title: 'Duck Simulator',
    isFeatured: false,
  },
  {
    id: '8',
    url: '/game-image.png',
    title: 'Random Game',
    isFeatured: false,
  },
]

export const mockVideos = [
  {
    id: '1',
    url: '/cyberpunk-image.png',
    title: 'Cyberpunk 2077 Gameplay',
    duration: '15:30',
    isFeatured: true,
  },
  {
    id: '2',
    url: '/game-image.png',
    title: 'The Witcher 3 Combat',
    duration: '8:45',
    isFeatured: false,
  },
  {
    id: '3',
    url: '/sekiro.jpg',
    title: 'Sekiro Boss Fight',
    duration: '12:20',
    isFeatured: false,
  },
  {
    id: '4',
    url: '/ghost-of-tsushima.png',
    title: 'Ghost of Tsushima Stealth',
    duration: '6:15',
    isFeatured: false,
  },
]

export const mockReviews: Review[] = [
  {
    id: '1',
    gameId: '1',
    userId: '1',
    content: 'Вражаюча гра з чудовою графікою та захоплюючим геймплеєм. Рекомендую всім любителям survival жанру!',
    rating: 5,
    username: 'MrZubarik',
    userAvatar: '/avatar.png',
    likes: 42,
    isLikedByCurrentUser: false,
    createdAt: '2024-01-15T10:30:00Z',
  },
  {
    id: '2',
    gameId: '2',
    userId: '1',
    content: 'Шедевр RPG жанру. Глибокий сюжет, чудові персонажі та безмежний світ для дослідження.',
    rating: 5,
    username: 'MrZubarik',
    userAvatar: '/avatar.png',
    likes: 128,
    isLikedByCurrentUser: true,
    createdAt: '2024-01-10T14:20:00Z',
  },
]

export const mockGuides = [
  {
    id: '1',
    title: 'Подробное руководство по прохождению игры (1.0)',
    description: 'Полное руководство для новичков с пошаговыми инструкциями и советами',
    image: '/game-image.png',
    views: 1250,
    likes: 89,
    createdAt: '2024-01-12T09:15:00Z',
  },
  {
    id: '2',
    title: 'Секреты и скрытые локации',
    description: 'Все секретные места и скрытые предметы в игре',
    image: '/cyberpunk.png',
    views: 890,
    likes: 67,
    createdAt: '2024-01-08T16:45:00Z',
  },
]

export const mockDiscussions: PostDto[] = [
  {
    id: '1',
    title: 'Обсуждение новых обновлений',
    content: 'Что думаете о последних изменениях в игре? Какие новые механики вам понравились больше всего?',
    type: 0, // Discussion
    authorId: '1',
    authorUsername: 'MrZubarik',
    authorAvatar: '/avatar.png',
    createdAt: '2024-01-14T11:30:00Z',
    updatedAt: '2024-01-14T11:30:00Z',
    gameId: '1',
    likesCount: 23,
    commentsCount: 8,
    media: [],
    gameMainImage: '/cyberpunk-image.png',
  },
  {
    id: '2',
    title: 'Лучшие стратегии для новичков',
    content: 'Делимся советами и стратегиями для тех, кто только начинает играть',
    type: 0, // Discussion
    authorId: '1',
    authorUsername: 'MrZubarik',
    authorAvatar: '/avatar.png',
    createdAt: '2024-01-11T15:20:00Z',
    updatedAt: '2024-01-11T15:20:00Z',
    gameId: '2',
    likesCount: 45,
    commentsCount: 12,
    media: [],
    gameMainImage: '/cyberpunk-image.png',
  },
]

export const mockComments = [
  {
    id: '1',
    username: 'GamerPro',
    avatar: '/avatar.png',
    content: 'Отличный профиль! Много интересного контента.',
    createdAt: '5 минут назад',
  },
  {
    id: '2',
    username: 'GameMaster',
    avatar: '/avatar.png',
    content: 'Спасибо за гайды, очень помогли в прохождении!',
    createdAt: '1 час назад',
  },
  {
    id: '3',
    username: 'PlayerOne',
    avatar: '/avatar.png',
    content: 'Крутые скриншоты! В какой игре сделаны?',
    createdAt: '2 часа назад',
  },
  {
    id: '4',
    username: 'QuestHunter',
    avatar: '/avatar.png',
    content: 'Добавь в друзья, играем вместе!',
    createdAt: '3 часа назад',
  },
  {
    id: '5',
    username: 'LevelUp',
    avatar: '/avatar.png',
    content: 'Интересные обзоры, продолжай в том же духе!',
    createdAt: '1 день назад',
  },
]
