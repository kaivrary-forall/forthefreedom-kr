'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

interface Attachment {
  filename?: string
  originalName?: string
  name?: string
  path?: string
  url?: string
}

interface NewsDetail {
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
  updatedAt?: string
  views?: number
  tags?: string[]
  attachments?: Attachment[]
  // 활동소식 전용
  activityType?: 'photo' | 'video'
  youtubeUrl?: string
  eventDate?: string
  location?: string
}

interface NewsDetailAPIProps {
  category: string
  title: string
  backPath: string
  backLabel: string
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

// attachment에서 이미지 URL 추출
function getAttachmentUrl(att: Attachment): string | null {
  if (att.url) return att.url
  if (att.path && att.path.startsWith('http')) return att.path
  return null
}

// 유튜브 embed URL 변환
function getYoutubeEmbedUrl(url: string): string | null {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/))([^?&]+)/)
  if (match && match[1]) {
    return `https://www.youtube.com/embed/${match[1]}`
  }
  return null
}

export default function NewsDetailAPI({ category, title, backPath, backLabel }: NewsDetailAPIProps) {
  const params = useParams()
  const id = params.id as string
  
  const [news, setNews] = useState<NewsDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadNews() {
      if (!id) return
      
      setIsLoading(true)
      setError(null)
      
      try {
        const apiPath = API_MAP[category] || `/api/${category}`
        const response = await fetch(`${apiPath}/${id}`)
        const data = await response.json()
        
        if (data.success && data.data) {
          setNews(data.data)
        } else {
          setError(data.error || '게시물을 찾을 수 없습니다.')
        }
      } catch (err) {
        console.error('뉴스 상세 로드 실패:', err)
        setError('게시물을 불러오는 중 오류가 발생했습니다.')
      } finally {
        setIsLoading(false)
      }
    }

    loadNews()
  }, [id, category])

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('ko-KR', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !news) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center py-16">
          <p className="text-lg text-gray-500 mb-6">{error || '게시물을 찾을 수 없습니다.'}</p>
          <Link 
            href={backPath}
            className="inline-flex items-center gap-2 text-primary hover:text-primary-dark"
          >
            ← {backLabel}으로 돌아가기
          </Link>
        </div>
      </div>
    )
  }

  // 이미지 URL들 추출
  const imageUrls: string[] = []
  
  // imageUrl이 있으면 추가
  if (news.imageUrl) {
    imageUrls.push(news.imageUrl)
  }
  
  // attachments에서 이미지 URL 추출
  if (news.attachments && news.attachments.length > 0) {
    news.attachments.forEach(att => {
      const url = getAttachmentUrl(att)
      if (url && !imageUrls.includes(url)) {
        imageUrls.push(url)
      }
    })
  }

  // 유튜브 영상 URL
  const youtubeEmbedUrl = news.youtubeUrl ? getYoutubeEmbedUrl(news.youtubeUrl) : null

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* 뒤로가기 */}
      <Link 
        href={backPath}
        className="inline-flex items-center gap-2 text-gray-500 hover:text-primary mb-6"
      >
        ← {backLabel}
      </Link>

      {/* 헤더 */}
      <article>
        <header className="mb-8 pb-8 border-b border-gray-200">
          {news.category && (
            <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full mb-4">
              {news.category}
            </span>
          )}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {news.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
            <span>{formatDate(news.publishDate || news.eventDate || news.createdAt)}</span>
            {news.author && <span>작성자: {news.author}</span>}
            {news.location && <span>📍 {news.location}</span>}
            {news.views !== undefined && <span>조회 {news.views}</span>}
          </div>
        </header>

        {/* 유튜브 영상 (활동소식 video 타입) */}
        {youtubeEmbedUrl && (
          <div className="mb-8 rounded-xl overflow-hidden aspect-video">
            <iframe
              src={youtubeEmbedUrl}
              title={news.title}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        )}

        {/* 이미지 갤러리 */}
        {imageUrls.length > 0 && (
          <div className="mb-8">
            {imageUrls.length === 1 ? (
              // 단일 이미지
              <div className="rounded-xl overflow-hidden">
                <img 
                  src={imageUrls[0]} 
                  alt={news.title}
                  className="w-full h-auto"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none'
                  }}
                />
              </div>
            ) : (
              // 다중 이미지 그리드
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {imageUrls.map((url, index) => (
                  <div key={index} className="rounded-xl overflow-hidden bg-gray-100">
                    <img 
                      src={url} 
                      alt={`${news.title} - ${index + 1}`}
                      className="w-full h-auto"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none'
                      }}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 본문 */}
        <div 
          className="prose prose-lg max-w-none mb-8"
          style={{ whiteSpace: 'pre-wrap' }}
        >
          {news.content}
        </div>

        {/* 태그 */}
        {news.tags && news.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {news.tags.map((tag, index) => (
              <span 
                key={index}
                className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* 하단 네비게이션 */}
        <div className="pt-8 border-t border-gray-200">
          <Link 
            href={backPath}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            ← {backLabel}
          </Link>
        </div>
      </article>
    </div>
  )
}
