'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getNewsFromProxy, NewsItem } from '@/lib/api'

// API 응답 타입 (Railway 실제 구조)
interface RailwayNewsItem {
  _id: string
  title: string
  content: string
  excerpt?: string
  category: string
  imageUrl?: string
  author?: string
  publishDate?: string
  createdAt: string
  views?: number
}

interface Props {
  lang?: 'ko' | 'en'
}

const texts = {
  ko: {
    title: '자유와혁신 주요 소식',
    subtitle: '다가오는 소식을 확인하세요',
    viewAll: '전체 소식 보기',
    notices: '공지사항',
    press: '보도자료',
    activities: '활동',
    noticesLink: '/news/notices',
    pressLink: '/news/press-releases',
    activitiesLink: '/news/events'
  },
  en: {
    title: 'Latest News',
    subtitle: 'Check our latest updates',
    viewAll: 'View All News',
    notices: 'Notice',
    press: 'Press Release',
    activities: 'Activities',
    noticesLink: '/en/news/notices',
    pressLink: '/en/news/press-releases',
    activitiesLink: '/en/news/events'
  }
}

export default function HomeNewsAPI({ lang = 'ko' }: Props) {
  const t = texts[lang]
  const [news, setNews] = useState<RailwayNewsItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadNews() {
      try {
        // 공지사항, 보도자료, 활동에서 각 1개씩 가져오기
        const [notices, press, activities] = await Promise.all([
          fetch('/api/news?category=notices&limit=1').then(r => r.json()),
          fetch('/api/news?category=spokesperson&limit=1').then(r => r.json()),
          fetch('/api/news?category=activities&limit=1').then(r => r.json())
        ])

        const combined: RailwayNewsItem[] = []
        
        if (notices.success && notices.data?.[0]) {
          combined.push({ ...notices.data[0], category: t.notices })
        }
        if (press.success && press.data?.[0]) {
          combined.push({ ...press.data[0], category: t.press })
        }
        if (activities.success && activities.data?.[0]) {
          combined.push({ ...activities.data[0], category: t.activities })
        }

        setNews(combined)
      } catch (error) {
        console.error('뉴스 로드 실패:', error)
      } finally {
        setIsLoading(false)
      }
    }
    loadNews()
  }, [])

  // 날짜 포맷
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('ko-KR', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  // 상세 페이지 링크 생성
  const getDetailLink = (item: RailwayNewsItem) => {
    const prefix = lang === 'en' ? '/en' : ''
    if (item.category === t.notices) return `${prefix}/news/notices/${item._id}`
    if (item.category === t.press) return `${prefix}/news/press-releases/${item._id}`
    if (item.category === t.activities) return `${prefix}/news/events/${item._id}`
    return `${prefix}/news/notices/${item._id}`
  }

  if (isLoading) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{t.title}</h2>
              <p className="text-gray-500 mt-1">{t.subtitle}</p>
            </div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-2xl h-80 animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{t.title}</h2>
            <p className="text-gray-500 mt-1">{t.subtitle}</p>
          </div>
          <Link href={lang === 'en' ? '/en/news/notices' : '/news/notices'} className="text-primary hover:text-primary-dark font-medium flex items-center gap-1">
            {t.viewAll} →
          </Link>
        </div>
        
        {/* 뉴스 그리드 */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {news.map((item) => (
            <Link
              key={item._id}
              href={getDetailLink(item)}
              className="group bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
            >
              {item.imageUrl ? (
                <div className="aspect-video overflow-hidden bg-gray-100">
                  <img 
                    src={item.imageUrl} 
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ) : (
                <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                  <span className="text-4xl">📰</span>
                </div>
              )}
              <div className="p-5">
                <span className="inline-block px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded mb-2">
                  {item.category}
                </span>
                <h3 className="font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors line-clamp-2">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                  {item.excerpt || item.content?.slice(0, 100)}
                </p>
                <p className="text-xs text-gray-400">
                  {formatDate(item.publishDate || item.createdAt)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
