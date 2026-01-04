'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

interface NewsDetail {
  _id: string
  title: string
  content: string
  excerpt?: string
  category?: string
  imageUrl?: string
  author?: string
  publishDate?: string
  createdAt: string
  updatedAt?: string
  views?: number
  tags?: string[]
  attachments?: Array<{ name: string; url: string }>
}

interface NewsDetailAPIProps {
  category: string
  title: string
  backPath: string // 예: /news/notices
  backLabel: string // 예: 공지사항 목록
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
        const response = await fetch(`/api/news/${id}?category=${category}`)
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
            <span>{formatDate(news.publishDate || news.createdAt)}</span>
            {news.author && <span>작성자: {news.author}</span>}
            {news.views !== undefined && <span>조회 {news.views}</span>}
          </div>
        </header>

        {/* 대표 이미지 */}
        {news.imageUrl && (
          <div className="mb-8 rounded-xl overflow-hidden">
            <img 
              src={news.imageUrl} 
              alt={news.title}
              className="w-full h-auto"
            />
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
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* 첨부파일 */}
        {news.attachments && news.attachments.length > 0 && (
          <div className="bg-gray-50 rounded-xl p-6 mb-8">
            <h3 className="font-semibold text-gray-900 mb-4">첨부파일</h3>
            <ul className="space-y-2">
              {news.attachments.map((file, index) => (
                <li key={index}>
                  <a 
                    href={file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-primary hover:underline"
                  >
                    📎 {file.name}
                  </a>
                </li>
              ))}
            </ul>
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
