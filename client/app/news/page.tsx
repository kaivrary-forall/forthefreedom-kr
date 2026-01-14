'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import NewsTabs from '@/components/news/NewsTabs'

interface NewsItem {
  _id: string
  title: string
  content: string
  excerpt?: string
  category?: string
  imageUrl?: string
  thumbnailUrl?: string
  author?: string
  publishDate?: string
  createdAt: string
  views?: number
  source: string
  basePath: string
}

const API_SOURCES = [
  { key: 'notices', api: '/api/notices', name: '공지', basePath: '/news/notices' },
  { key: 'press', api: '/api/spokesperson', name: '성명', basePath: '/news/press-releases' },
  { key: 'activities', api: '/api/activities', name: '활동소식', basePath: '/news/activities' },
  { key: 'media', api: '/api/media-coverage', name: '언론보도', basePath: '/news/media' },
  { key: 'events', api: '/api/events', name: '주요일정', basePath: '/news/events' },
  { key: 'cardnews', api: '/api/card-news', name: '카드뉴스', basePath: '/news/card-news' },
  { key: 'gallery', api: '/api/gallery', name: '갤러리', basePath: '/news/gallery' },
]

export default function NewsAllPage() {
  const [news, setNews] = useState<NewsItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadAllNews() {
      setIsLoading(true)
      
      try {
        const promises = API_SOURCES.map(async (source) => {
          try {
            const res = await fetch(`${source.api}?limit=5&page=1`)
            const data = await res.json()
            
            if (data.success && data.data) {
              return data.data.map((item: any) => ({
                ...item,
                source: source.name,
                basePath: source.basePath,
                imageUrl: item.imageUrl || item.thumbnailUrl || null
              }))
            }
            return []
          } catch {
            return []
          }
        })

        const results = await Promise.all(promises)
        const allNews = results.flat()
        
        allNews.sort((a, b) => {
          const dateA = new Date(a.publishDate || a.createdAt).getTime()
          const dateB = new Date(b.publishDate || b.createdAt).getTime()
          return dateB - dateA
        })

        setNews(allNews)
      } catch (error) {
        console.error('뉴스 로드 실패:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadAllNews()
  }, [])

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('ko-KR', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  return (
    <div>
      {/* 탭 네비게이션 */}
      <NewsTabs active="all" />

      {/* 전체 뉴스 목록 */}
      <main className="bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-xl h-32 animate-pulse" />
              ))}
            </div>
          ) : news.length === 0 ? (
            <div className="text-center py-16 text-gray-500">
              <p className="text-lg">등록된 게시물이 없습니다.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {news.map((item) => (
                <Link
                  key={`${item.source}-${item._id}`}
                  href={`${item.basePath}/${item._id}`}
                  className="block bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg hover:border-primary/30 transition-all"
                >
                  <div className="flex gap-6">
                    {item.imageUrl ? (
                      <div className="hidden sm:block w-40 h-28 rounded-lg overflow-hidden flex-shrink-0">
                        <img 
                          src={item.imageUrl} 
                          alt={item.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none'
                          }}
                        />
                      </div>
                    ) : (
                      <div className="hidden sm:flex w-40 h-28 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 items-center justify-center flex-shrink-0">
                        <span className="text-3xl">📄</span>
                      </div>
                    )}
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs font-medium rounded">
                          {item.source}
                        </span>
                      </div>
                      <h2 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1 hover:text-primary transition-colors">
                        {item.title}
                      </h2>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {item.excerpt || item.content?.slice(0, 150)}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-gray-400">
                        <span>{formatDate(item.publishDate || item.createdAt)}</span>
                        {item.author && <span>작성자: {item.author}</span>}
                        {item.views !== undefined && <span>조회 {item.views}</span>}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
