'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

interface EventItem {
  _id: string
  title: string
  excerpt?: string
  category?: string
  content?: string
  eventDate: string
  endDate?: string
  eventLocation?: string
  organizer?: string
  contact?: string
  status?: string
  views?: number
}

interface Pagination {
  total: number
  current: number
  pages: number
  limit: number
}

export default function EventsListAPI() {
  const [events, setEvents] = useState<EventItem[]>([])
  const [pagination, setPagination] = useState<Pagination | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadEvents() {
      setIsLoading(true)
      try {
        const response = await fetch(`/api/calendar?page=${currentPage}&limit=10`)
        const data = await response.json()
        
        if (data.success) {
          setEvents(data.events || [])
          setPagination(data.pagination || null)
        }
      } catch (error) {
        console.error('행사 목록 로드 실패:', error)
      } finally {
        setIsLoading(false)
      }
    }
    loadEvents()
  }, [currentPage])

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('ko-KR', { 
      year: 'numeric',
      month: 'long', 
      day: 'numeric',
      weekday: 'short'
    })
  }

  const getEventStatus = (eventDate: string, endDate?: string) => {
    const now = new Date()
    const start = new Date(eventDate)
    const end = endDate ? new Date(endDate) : start
    
    if (now < start) return { label: '예정', color: 'bg-blue-100 text-blue-800' }
    if (now >= start && now <= end) return { label: '진행중', color: 'bg-green-100 text-green-800' }
    return { label: '종료', color: 'bg-gray-100 text-gray-600' }
  }

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-xl h-28 animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  if (events.length === 0) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-16 text-gray-500">
          <p className="text-lg">등록된 행사가 없습니다.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-4">
        {events.map((event) => {
          const status = getEventStatus(event.eventDate, event.endDate)
          
          return (
            <Link 
              key={event._id} 
              href={`/news/events/${event._id}`}
              className="block bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg hover:border-primary/30 transition-all"
            >
              <div className="flex gap-6">
                <div className="hidden sm:flex w-40 h-28 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 items-center justify-center flex-shrink-0">
                  <span className="text-3xl">📅</span>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-0.5 text-xs font-medium rounded ${status.color}`}>
                      {status.label}
                    </span>
                    {event.category && (
                      <span className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded">
                        {event.category}
                      </span>
                    )}
                  </div>
                  <h2 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1 hover:text-primary transition-colors">
                    {event.title}
                  </h2>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {event.excerpt || event.content?.slice(0, 150)}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-gray-400">
                    <span>{formatDate(event.eventDate)}</span>
                    {event.eventLocation && <span>📍 {event.eventLocation}</span>}
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
            disabled={currentPage === 1}
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ← 이전
          </button>
          
          <span className="text-sm text-gray-600">
            {pagination.current} / {pagination.pages} 페이지
          </span>
          
          <button
            onClick={() => setCurrentPage(p => Math.min(pagination.pages, p + 1))}
            disabled={currentPage === pagination.pages}
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            다음 →
          </button>
        </div>
      )}
    </div>
  )
}
