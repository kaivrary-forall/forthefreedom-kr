// API 설정 - 내부 Next API Route 사용 (Railway 직접 호출 금지)
// 프론트는 /api/* 만 호출, 서버에서 Railway로 프록시

// 타입 정의
export interface Banner {
  id: string
  title: string
  subtitle: string
  imageUrl: string
  mobileImageUrl?: string
  linkUrl: string
  linkText: string
  source?: string
  sourceColor?: 'white' | 'black' | 'gray'
  order: number
  isActive: boolean
  imageActive?: boolean
  mobileImageActive?: boolean
}

export interface BannerSettings {
  randomOrder: boolean
}

export interface SideCard {
  id: string
  category: string
  title: string
  content?: string
  link: string
  isPinned: boolean
  order: number
}

export interface NewsItem {
  id: string
  title: string
  content: string
  excerpt?: string
  category: string
  imageUrl?: string
  createdAt: string
  updatedAt: string
}

export interface CalendarEvent {
  id: string
  title: string
  start: string
  end: string
  location?: string
  description?: string
  allDay?: boolean
}

// 내부 API 호출 함수 (프론트에서 사용)
export async function getBannersFromProxy(): Promise<{ banners: Banner[]; settings: BannerSettings }> {
  try {
    const response = await fetch('/api/banners')
    const data = await response.json()
    
    if (data.success && data.banners) {
      return {
        banners: data.banners,
        settings: data.settings || { randomOrder: false }
      }
    }
    return { banners: [], settings: { randomOrder: false } }
  } catch (error) {
    console.error('배너 로드 실패:', error)
    return { banners: [], settings: { randomOrder: false } }
  }
}

export async function getSideCardsFromProxy(): Promise<SideCard[]> {
  try {
    const response = await fetch('/api/side-cards')
    const data = await response.json()
    
    if (data.success && data.data) {
      return data.data
    }
    return []
  } catch (error) {
    console.error('사이드카드 로드 실패:', error)
    return []
  }
}

// 뉴스 API 함수들
export type NewsCategory = 'notices' | 'spokesperson' | 'card-news' | 'activities' | 'gallery' | 'media-coverage'

export async function getNewsFromProxy(category: NewsCategory, limit = 10): Promise<NewsItem[]> {
  try {
    const response = await fetch(`/api/news?category=${category}&limit=${limit}`)
    const data = await response.json()
    
    if (data.success && data.data) {
      return data.data
    }
    return []
  } catch (error) {
    console.error(`뉴스 로드 실패 (${category}):`, error)
    return []
  }
}

// 편의 함수들
export const getNotices = (limit = 10) => getNewsFromProxy('notices', limit)
export const getPressReleases = (limit = 10) => getNewsFromProxy('spokesperson', limit)
export const getCardNews = (limit = 10) => getNewsFromProxy('card-news', limit)
export const getActivities = (limit = 10) => getNewsFromProxy('activities', limit)
export const getGallery = (limit = 10) => getNewsFromProxy('gallery', limit)
export const getMediaCoverage = (limit = 10) => getNewsFromProxy('media-coverage', limit)
