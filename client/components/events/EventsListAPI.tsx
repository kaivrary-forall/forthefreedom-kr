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
      <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-xl h-28 animate-pulse" />
        ))}
      </div>
    )
  }

  if (events.length === 0) {
    return (
      <div className="text-center py-16 text-gray-500">
        <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
          <span className="text-2xl">📅</span>
        </div>
        <p className="text-lg">등록된 행사가 없습니다.</p>
      </div>
    )
  }

  return (
    <div>
      <div className="space-y-4">
        {events.map((event) => {
          const status = getEventStatus(event.eventDate, event.endDate)
          
          return (
            <Link 
              key={event._id} 
              href={`/news/events/${event._id}`}
              className="block bg-white border rounded-xl p-6 hover:shadow-lg hover:border-primary/30 transition-all"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-xs px-2 py-1 rounded ${status.color}`}>
                      {status.label}
                    </span>
                    {event.category && (
                      <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded">
                        {event.category}
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{event.title}</h3>
                  {event.excerpt && (
                    <p className="text-sm text-gray-600 line-clamp-1">{event.excerpt}</p>
                  )}
                </div>
                <div className="flex flex-col gap-2 text-sm text-gray-600 md:text-right">
                  <span className="flex items-center gap-2 md:justify-end">
                    <span className="text-primary">📅</span>
                    {formatDate(event.eventDate)}
                  </span>
                  {event.eventLocation && (
                    <span className="flex items-center gap-2 md:justify-end">
                      <span className="text-primary">📍</span>
                      {event.eventLocation}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      {/* 페이지네이션 */}
      {pagination && pagination.pages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-8">
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
