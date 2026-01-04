'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface CalendarEvent {
  _id: string
  title: string
  content?: string
  eventDate: string
  endDate?: string
  eventLocation?: string
}

interface Props {
  lang?: 'ko' | 'en'
}

const texts = {
  ko: {
    title: '자유와혁신 주요 일정',
    subtitle: '다가오는 일정을 확인하세요',
    viewAll: '전체 일정 보기',
    today: '오늘',
    more: '개 더',
    noEvents: '다가오는 일정이 없습니다.',
    days: ['일', '월', '화', '수', '목', '금', '토'],
    eventsLink: '/news/events'
  },
  en: {
    title: 'Upcoming Events',
    subtitle: 'Check our upcoming schedules',
    viewAll: 'View All Events',
    today: 'Today',
    more: ' more',
    noEvents: 'No upcoming events.',
    days: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    eventsLink: '/en/news/events'
  }
}

// 한국 시간 기준 날짜 문자열 (YYYY-MM-DD)
const getKoreanDateString = (date: Date): string => {
  return date.toLocaleDateString('sv-SE', { timeZone: 'Asia/Seoul' })
}

// 한국 시간 기준 현재 날짜
const getKoreanToday = (): Date => {
  const now = new Date()
  const koreaDateStr = now.toLocaleDateString('sv-SE', { timeZone: 'Asia/Seoul' })
  return new Date(koreaDateStr + 'T00:00:00+09:00')
}

export default function HomeCalendarAPI({ lang = 'ko' }: Props) {
  const t = texts[lang]
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [weekOffset, setWeekOffset] = useState(0)
  
  const MAX_WEEK_OFFSET = 4

  useEffect(() => {
    async function loadEvents() {
      try {
        const response = await fetch('/api/calendar?source=google')
        const data = await response.json()
        
        if (data.success) {
          setEvents(data.events || [])
        }
      } catch (error) {
        console.error('일정 로드 실패:', error)
      } finally {
        setIsLoading(false)
      }
    }
    loadEvents()
  }, [])

  // 한국 시간 기준 현재 날짜
  const today = getKoreanToday()
  const todayStr = getKoreanDateString(new Date())
  const days = t.days
  
  // 현재 주 기준 + offset 적용
  const baseDate = new Date(today)
  baseDate.setDate(today.getDate() + (weekOffset * 7))
  
  // 해당 주의 일요일 계산
  const startOfWeek = new Date(baseDate)
  startOfWeek.setDate(baseDate.getDate() - baseDate.getDay())
  
  // 2주치 날짜 배열 생성
  const twoWeeks: Date[] = []
  for (let i = 0; i < 14; i++) {
    const date = new Date(startOfWeek)
    date.setDate(startOfWeek.getDate() + i)
    twoWeeks.push(date)
  }

  // 날짜별 이벤트 매핑 (한국 시간 기준)
  const getEventsForDate = (date: Date) => {
    const dateStr = getKoreanDateString(date)
    return events.filter(e => {
      const eventDateStr = getKoreanDateString(new Date(e.eventDate))
      const endDateStr = e.endDate ? getKoreanDateString(new Date(e.endDate)) : eventDateStr
      return dateStr >= eventDateStr && dateStr <= endDateStr
    })
  }

  const formatDate = (date: Date) => date.getDate()
  
  const isToday = (date: Date) => {
    const dateStr = getKoreanDateString(date)
    return todayStr === dateStr
  }

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleTimeString('ko-KR', { 
      hour: '2-digit', 
      minute: '2-digit', 
      hour12: false,
      timeZone: 'Asia/Seoul'
    })
  }

  // 월 표시 계산
  const getMonthLabel = () => {
    const startMonth = startOfWeek.getMonth() + 1
    const endDate = new Date(startOfWeek)
    endDate.setDate(startOfWeek.getDate() + 13)
    const endMonth = endDate.getMonth() + 1
    const startYear = startOfWeek.getFullYear()
    const endYear = endDate.getFullYear()

    if (startYear === endYear && startMonth === endMonth) {
      return `${startYear}년 ${startMonth}월`
    } else if (startYear !== endYear) {
      return `${startYear}년 ${startMonth}월 - ${endYear}년 ${endMonth}월`
    } else {
      return `${startYear}년 ${startMonth}월 - ${endMonth}월`
    }
  }

  // 주 이동
  const goToPrevWeek = () => {
    if (weekOffset > -MAX_WEEK_OFFSET) {
      setWeekOffset(prev => prev - 1)
    }
  }

  const goToNextWeek = () => {
    if (weekOffset < MAX_WEEK_OFFSET) {
      setWeekOffset(prev => prev + 1)
    }
  }

  // 미래 일정 (모바일용) - 한국 시간 기준
  const upcomingEvents = events
    .filter(e => {
      const eventDateStr = getKoreanDateString(new Date(e.eventDate))
      return eventDateStr >= todayStr
    })
    .slice(0, 5)

  if (isLoading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{t.title}</h2>
            <p className="text-gray-500 mt-1">{t.subtitle}</p>
          </div>
          <Link href={t.eventsLink} className="text-primary hover:text-primary-dark font-medium flex items-center gap-1">
            {t.viewAll} <span className="text-sm">→</span>
          </Link>
        </div>

        {/* 데스크톱: 캘린더 그리드 */}
        <div className="hidden md:block">
          {/* 월 표시 + 화살표 */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <button 
              onClick={goToPrevWeek}
              disabled={weekOffset <= -MAX_WEEK_OFFSET}
              className={`p-2 rounded-full transition-colors ${
                weekOffset <= -MAX_WEEK_OFFSET 
                  ? 'text-gray-300 cursor-not-allowed' 
                  : 'text-gray-500 hover:text-primary hover:bg-gray-100'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <span className="text-lg font-semibold text-gray-900 min-w-[200px] text-center">
              {getMonthLabel()}
            </span>
            <button 
              onClick={goToNextWeek}
              disabled={weekOffset >= MAX_WEEK_OFFSET}
              className={`p-2 rounded-full transition-colors ${
                weekOffset >= MAX_WEEK_OFFSET 
                  ? 'text-gray-300 cursor-not-allowed' 
                  : 'text-gray-500 hover:text-primary hover:bg-gray-100'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* 캘린더 그리드 */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {/* 요일 헤더 */}
            <div className="grid grid-cols-7 border-b border-gray-200">
              {days.map((day, i) => (
                <div 
                  key={day} 
                  className={`py-3 text-center text-sm font-medium border-r border-gray-200 last:border-r-0 ${
                    i === 0 ? 'text-red-500' : i === 6 ? 'text-blue-500' : 'text-gray-600'
                  }`}
                >
                  {day}
                </div>
              ))}
            </div>

            {/* 1주차 */}
            <div className="grid grid-cols-7 border-b border-gray-200">
              {twoWeeks.slice(0, 7).map((date, i) => {
                const dateEvents = getEventsForDate(date)
                const isTodayDate = isToday(date)
                
                return (
                  <div 
                    key={i} 
                    className={`min-h-[120px] p-2 border-r border-gray-200 last:border-r-0 ${
                      isTodayDate ? 'bg-primary text-white' : ''
                    }`}
                  >
                    <div className={`text-sm font-medium mb-1 ${
                      isTodayDate 
                        ? 'text-white' 
                        : i === 0 ? 'text-red-500' : i === 6 ? 'text-blue-500' : 'text-gray-900'
                    }`}>
                      {formatDate(date)}
                      {isTodayDate && (
                        <span className="ml-1 text-xs">{t.today}</span>
                      )}
                    </div>
                    {dateEvents.slice(0, 3).map((event) => (
                      <div 
                        key={event._id}
                        className={`text-xs px-1.5 py-1 rounded mb-1 ${
                          isTodayDate 
                            ? 'bg-white/20 text-white' 
                            : 'bg-primary/10 text-primary'
                        }`}
                        title={`${event.title}${event.eventLocation ? ` - ${event.eventLocation}` : ''}`}
                      >
                        <div className="font-medium truncate">● {event.title}</div>
                        <div className={`text-[10px] truncate ${isTodayDate ? 'text-white/80' : 'text-gray-500'}`}>
                          {formatTime(event.eventDate)} | {event.eventLocation || ''}
                        </div>
                        {event.content && (
                          <div className={`text-[10px] truncate ${isTodayDate ? 'text-white/70' : 'text-gray-400'}`}>
                            {event.content}
                          </div>
                        )}
                      </div>
                    ))}
                    {dateEvents.length > 3 && (
                      <div className={`text-[10px] ${isTodayDate ? 'text-white/60' : 'text-gray-400'}`}>
                        +{dateEvents.length - 3}개 더
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            {/* 2주차 */}
            <div className="grid grid-cols-7">
              {twoWeeks.slice(7, 14).map((date, i) => {
                const dateEvents = getEventsForDate(date)
                const isTodayDate = isToday(date)
                
                return (
                  <div 
                    key={i} 
                    className={`min-h-[120px] p-2 border-r border-gray-200 last:border-r-0 ${
                      isTodayDate ? 'bg-primary text-white' : ''
                    }`}
                  >
                    <div className={`text-sm font-medium mb-1 ${
                      isTodayDate 
                        ? 'text-white' 
                        : i === 0 ? 'text-red-500' : i === 6 ? 'text-blue-500' : 'text-gray-900'
                    }`}>
                      {formatDate(date)}
                      {isTodayDate && (
                        <span className="ml-1 text-xs">{t.today}</span>
                      )}
                    </div>
                    {dateEvents.slice(0, 3).map((event) => (
                      <div 
                        key={event._id}
                        className={`text-xs px-1.5 py-1 rounded mb-1 ${
                          isTodayDate 
                            ? 'bg-white/20 text-white' 
                            : 'bg-primary/10 text-primary'
                        }`}
                        title={`${event.title}${event.eventLocation ? ` - ${event.eventLocation}` : ''}`}
                      >
                        <div className="font-medium truncate">● {event.title}</div>
                        <div className={`text-[10px] truncate ${isTodayDate ? 'text-white/80' : 'text-gray-500'}`}>
                          {formatTime(event.eventDate)} | {event.eventLocation || ''}
                        </div>
                        {event.content && (
                          <div className={`text-[10px] truncate ${isTodayDate ? 'text-white/70' : 'text-gray-400'}`}>
                            {event.content}
                          </div>
                        )}
                      </div>
                    ))}
                    {dateEvents.length > 3 && (
                      <div className={`text-[10px] ${isTodayDate ? 'text-white/60' : 'text-gray-400'}`}>
                        +{dateEvents.length - 3}개 더
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* 모바일: 리스트 뷰 */}
        <div className="md:hidden">
          {upcomingEvents.length > 0 ? (
            <div className="space-y-3">
              {upcomingEvents.map((event) => (
                <div 
                  key={event._id}
                  className="bg-white rounded-lg border border-gray-200 p-4"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-medium text-primary">
                      {new Date(event.eventDate).toLocaleDateString(lang === 'en' ? 'en-US' : 'ko-KR', {
                        month: 'short',
                        day: 'numeric',
                        weekday: 'short',
                        timeZone: 'Asia/Seoul'
                      })}
                    </span>
                    <span className="text-sm text-gray-500">
                      {formatTime(event.eventDate)}
                    </span>
                  </div>
                  <h4 className="font-medium text-gray-900">{event.title}</h4>
                  {event.eventLocation && (
                    <p className="text-sm text-gray-500 mt-1">📍 {event.eventLocation}</p>
                  )}
                  {event.content && (
                    <p className="text-sm text-gray-400 mt-1">{event.content}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              {t.noEvents}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
