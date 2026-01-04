'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getSideCardsFromProxy, SideCard } from '@/lib/api'
import { sideCards as fallbackCards } from '@/data/home-main.ko'

// 레거시 URL을 새 URL로 변환 (내부 링크만)
function convertLegacyUrl(url: string): string {
  if (!url) return '/'
  
  // 외부 링크는 그대로 반환
  if (!url.startsWith('/')) return url
  
  // 상세 페이지 변환 (쿼리 파라미터 포함)
  const detailPatterns: Record<string, string> = {
    '/news/notice-detail.html': '/news/notices',
    '/news/press-release-detail.html': '/news/press-releases',
    '/news/card-news-detail.html': '/news/card-news',
    '/news/media-detail.html': '/news/media',
    '/news/activity-detail.html': '/news/activities',
    '/news/gallery-detail.html': '/news/gallery',
    '/news/event-detail.html': '/news/events',
    '/agora/detail.html': '/agora',
  }

  // URL 파싱
  try {
    const urlObj = new URL(url, 'http://dummy')
    const pathname = urlObj.pathname
    const id = urlObj.searchParams.get('id')

    // 상세 페이지 체크
    if (detailPatterns[pathname] && id) {
      return `${detailPatterns[pathname]}/${id}`
    }

    // .html 제거
    if (pathname.endsWith('.html')) {
      return pathname.replace('.html', '')
    }

    return url
  } catch {
    // URL 파싱 실패시 .html만 제거
    if (url.includes('.html')) {
      return url.split('?')[0].replace('.html', '')
    }
    return url
  }
}

export default function HomeSideWidgetsAPI() {
  const [cards, setCards] = useState<SideCard[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadSideCards() {
      try {
        const data = await getSideCardsFromProxy()
        if (data.length > 0) {
          setCards(data)
        } else {
          // fallback
          setCards(fallbackCards.map((c, i) => ({
            id: String(c.id),
            category: c.category,
            title: c.title,
            content: c.content,
            link: c.link,
            isPinned: c.isPinned || false,
            order: i
          })))
        }
      } catch (error) {
        console.error('사이드 카드 로드 실패:', error)
        setCards(fallbackCards.map((c, i) => ({
          id: String(c.id),
          category: c.category,
          title: c.title,
          content: c.content,
          link: c.link,
          isPinned: c.isPinned || false,
          order: i
        })))
      } finally {
        setIsLoading(false)
      }
    }
    loadSideCards()
  }, [])

  if (isLoading) {
    return (
      <div className="lg:flex-[3] grid grid-cols-2 lg:grid-cols-1 gap-3 lg:h-full">
        {[1, 2, 3, 4].map((i) => (
          <div 
            key={i}
            className="bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-xl h-24 animate-pulse"
          />
        ))}
      </div>
    )
  }

  return (
    <div className="lg:flex-[3] grid grid-cols-2 lg:grid-cols-1 gap-3 lg:h-full">
      {cards.slice(0, 4).map((card) => (
        <Link
          key={card.id}
          href={convertLegacyUrl(card.link)}
          className="bg-white rounded-xl p-4 border border-gray-200 hover:border-primary hover:shadow-md hover:-translate-y-0.5 transition-all flex flex-col justify-center overflow-hidden"
        >
          <div className="text-xs font-semibold text-primary mb-1.5 uppercase">
            {card.category}
            {card.isPinned && ' 📌'}
          </div>
          <div className="text-sm font-semibold text-gray-900 mb-1 truncate">
            {card.title}
          </div>
          {card.content && (
            <div className="text-xs text-gray-500 line-clamp-2">
              {card.content}
            </div>
          )}
        </Link>
      ))}
    </div>
  )
}
