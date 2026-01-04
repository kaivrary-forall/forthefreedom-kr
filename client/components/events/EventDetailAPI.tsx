'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

interface EventDetail {
  _id: string
  title: string
  excerpt?: string
  category?: string
  content: string
  eventDate: string
  endDate?: string
  eventLocation?: string
  organizer?: string
  contact?: string
  status?: string
  views?: number
  attachments?: Array<{ filename: string; originalName: string; path: string }>
  createdAt: string
}

export default function EventDetailAPI() {
  const params = useParams()
  const id = params.id as string
  
  const [event, setEvent] = useState<EventDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadEvent() {
      if (!id) return
      
      setIsLoading(true)
      setError(null)
      
      try {
        const response = await fetch(`/api/calendar/${id}`)
        const data = await response.json()
        
        if (data.success && data.event) {
          setEvent(data.event)
        } else {
          setError(data.error || '행사를 찾을 수 없습니다.')
        }
      } catch (err) {
        console.error('행사 로드 실패:', err)
        setError('행사를 불러오는 중 오류가 발생했습니다.')
      } finally {
        setIsLoading(false)
      }
    }
    loadEvent()
  }, [id])

  const formatDate = (dateStr: string, includeTime: boolean = true) => {
    const date = new Date(dateStr)
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric',
      month: 'long', 
      day: 'numeric',
      weekday: 'long'
    }
    if (includeTime) {
      options.hour = '2-digit'
      options.minute = '2-digit'
    }
    return date.toLocaleDateString('ko-KR', options)
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
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/4 mb-8"></div>
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
      </div>
    )
  }

  if (error || !event) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
          <span className="text-2xl">😕</span>
        </div>
        <p className="text-lg text-gray-500 mb-6">{error || '행사를 찾을 수 없습니다.'}</p>
        <Link 
          href="/news/events"
          className="inline-flex items-center gap-2 text-primary hover:text-primary-dark"
        >
          ← 행사 목록으로 돌아가기
        </Link>
      </div>
    )
  }

  const status = getEventStatus(event.eventDate, event.endDate)

  return (
    <article className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* 헤더 */}
      <header className="p-6 border-b border-gray-100">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className={`text-sm px-3 py-1 rounded ${status.color}`}>
            {status.label}
          </span>
          {event.category && (
            <span className="bg-primary/10 text-primary text-sm px-3 py-1 rounded">
              {event.category}
            </span>
          )}
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
          {event.title}
        </h1>
        {event.excerpt && (
          <p className="text-gray-600">{event.excerpt}</p>
        )}
      </header>

      {/* 행사 정보 */}
      <div className="p-6 bg-gray-50 border-b border-gray-100">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="flex items-start gap-3">
            <span className="text-xl">📅</span>
            <div>
              <p className="text-sm text-gray-500">일시</p>
              <p className="font-medium text-gray-900">{formatDate(event.eventDate)}</p>
              {event.endDate && event.endDate !== event.eventDate && (
                <p className="text-sm text-gray-600">~ {formatDate(event.endDate)}</p>
              )}
            </div>
          </div>
          
          {event.eventLocation && (
            <div className="flex items-start gap-3">
              <span className="text-xl">📍</span>
              <div>
                <p className="text-sm text-gray-500">장소</p>
                <p className="font-medium text-gray-900">{event.eventLocation}</p>
              </div>
            </div>
          )}
          
          {event.organizer && (
            <div className="flex items-start gap-3">
              <span className="text-xl">🏢</span>
              <div>
                <p className="text-sm text-gray-500">주최</p>
                <p className="font-medium text-gray-900">{event.organizer}</p>
              </div>
            </div>
          )}
          
          {event.contact && (
            <div className="flex items-start gap-3">
              <span className="text-xl">📞</span>
              <div>
                <p className="text-sm text-gray-500">문의</p>
                <p className="font-medium text-gray-900">{event.contact}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 본문 */}
      <div className="p-6">
        <div 
          className="prose max-w-none text-gray-700"
          style={{ whiteSpace: 'pre-wrap' }}
        >
          {event.content}
        </div>
      </div>

      {/* 첨부파일 */}
      {event.attachments && event.attachments.length > 0 && (
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">
          <h3 className="font-semibold text-gray-900 mb-3">첨부파일</h3>
          <ul className="space-y-2">
            {event.attachments.map((file, index) => (
              <li key={index}>
                <a 
                  href={`https://forthefreedom-kr-production.up.railway.app${file.path}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-primary hover:underline"
                >
                  📎 {file.originalName}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 하단 네비게이션 */}
      <div className="px-6 py-4 border-t border-gray-100">
        <Link 
          href="/news/events"
          className="inline-flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-primary transition-colors"
        >
          ← 행사 목록으로
        </Link>
      </div>
    </article>
  )
}
