'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Attachment {
  filename?: string
  originalName?: string
  path: string
  url?: string
}

interface NewsItem {
  _id: string
  title: string
  content: string
  excerpt?: string
  category?: string
  imageUrl?: string
  thumbnailUrl?: string
  attachments?: Attachment[]
  author?: string
  publishDate?: string
  createdAt: string
  views?: number
}

interface Pagination {
  current: number
  pages: number
  total: number
  hasNext: boolean
  hasPrev: boolean
}

interface NewsListAPIProps {
  category: string
  title: string
  basePath?: string
}

// 카테고리별 API 경로 매핑
const API_MAP: Record<string, string> = {
  'notices': '/api/notices',
  'activities': '/api/activities',
  'media-coverage': '/api/media-coverage',
  'card-news': '/api/card-news',
  'gallery': '/api/gallery',
  'events': '/api/events',
  'spokesperson': '/api/spokesperson',
  'policy-committee': '/api/policy-committee',
  'new-media': '/api/new-media',
}

// 카테고리별 basePath 매핑
const BASE_PATH_MAP: Record<string, string> = {
  'notices': '/news/notices',
  'activities': '/news/activities',
  'media-coverage': '/news/media',
  'card-news': '/news/card-news',
  'gallery': '/news/gallery',
  'events': '/news/events',
  'spokesperson': '/news/press-releases',
  'policy-committee': '/news/policy-committee',
  'new-media': '/news/new-media',
}

// 아이템에서 이미지 URL 추출
function getImageUrl(item: NewsItem): string | null {
  if (item.imageUrl) return item.imageUrl
  if (item.thumbnailUrl) return item.thumbnailUrl
  
  if (item.attachments && item.attachments.length > 0) {
    const att = item.attachments[0]
    if (att.url) return att.url
    if (att.path && att.path.startsWith('http')) return att.path
    if (att.path && att.path.startsWith('/uploads')) return null
  }
  
  return null
}

export default function NewsListAPI({ category, title, basePath }: NewsListAPIProps) {
  const [news, setNews] = useState<NewsItem[]>([])
  const [pagination, setPagination] = useState<Pagination | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)

  const actualBasePath = basePath || BASE_PATH_MAP[category] || `/news/${category}`

  useEffect(() => {
    async function loadNews() {
      setIsLoading(true)
      try {
        const apiPath = API_MAP[category] || `/api/${category}`
        const response = await fetch(`${apiPath}?limit=10&page=${currentPage}`)
        const data = await response.json()
        
        if (data.success) {
          setNews(data.data || [])
          setPagination(data.pagination || null)
        }
      } catch (error) {
        console.error('뉴스 목록 로드 실패:', error)
      } finally {
        setIsLoading(false)
      }
    }
    loadNews()
  }, [category, currentPage])

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('ko-KR', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-xl h-32 animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  if (news.length === 0) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-16 text-gray-500">
          <p className="text-lg">등록된 게시물이 없습니다.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* 뉴스 목록 */}
      <div className="space-y-4">
        {news.map((item) => {
          const imageUrl = getImageUrl(item)
          
          return (
            <Link
              key={item._id}
              href={`${actualBasePath}/${item._id}`}
              className="block bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg hover:border-primary/30 transition-all"
            >
              <div className="flex gap-6">
                {/* 썸네일 */}
                {imageUrl ? (
                  <div className="hidden sm:block w-40 h-28 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                    <img 
                      src={imageUrl} 
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
                
                {/* 콘텐츠 */}
                <div className="flex-1 min-w-0">
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
          )
        })}
      </div>

      {/* 페이지네이션 */}
      {pagination && pagination.pages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-12">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={!pagination.hasPrev}
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ← 이전
          </button>
          
          <span className="text-sm text-gray-600">
            {pagination.current} / {pagination.pages} 페이지
          </span>
          
          <button
            onClick={() => setCurrentPage(p => Math.min(pagination.pages, p + 1))}
            disabled={!pagination.hasNext}
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            다음 →
          </button>
        </div>
      )}
    </div>
  )
}
