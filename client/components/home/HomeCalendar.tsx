import Link from 'next/link'

interface CalendarEvent {
  id: number
  date: string
  title: string
  time: string
  location: string
  organizer?: string
}

interface HomeCalendarProps {
  events: CalendarEvent[]
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

export default function HomeCalendar({ events }: HomeCalendarProps) {
  // 한국 시간 기준 현재 날짜
  const today = getKoreanToday()
  const todayStr = getKoreanDateString(new Date())
  
  const days = ['일', '월', '화', '수', '목', '금', '토']
  
  // 이번 주 일요일부터 시작
  const startOfWeek = new Date(today)
  startOfWeek.setDate(today.getDate() - today.getDay())
  
  // 2주치 날짜 배열 생성
  const twoWeeks: Date[] = []
  for (let i = 0; i < 14; i++) {
    const date = new Date(startOfWeek)
    date.setDate(startOfWeek.getDate() + i)
    twoWeeks.push(date)
  }

  // 날짜별 이벤트 매핑
  const getEventsForDate = (date: Date) => {
    const dateStr = getKoreanDateString(date)
    return events.filter(e => e.date === dateStr)
  }

  const formatDate = (date: Date) => date.getDate()
  
  const isToday = (date: Date) => {
    const dateStr = getKoreanDateString(date)
    return todayStr === dateStr
  }

  // 월 표시
  const startMonth = startOfWeek.getMonth() + 1
  const endDate = new Date(startOfWeek)
  endDate.setDate(startOfWeek.getDate() + 13)
  const endMonth = endDate.getMonth() + 1
  const year = startOfWeek.getFullYear()
  const endYear = endDate.getFullYear()

  const monthLabel = startMonth === endMonth 
    ? `${year}년 ${startMonth}월`
    : endYear > year 
      ? `${year}년 ${startMonth}월 - ${endYear}년 ${endMonth}월`
      : `${year}년 ${startMonth}월 - ${endMonth}월`

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">자유와혁신 주요 일정</h2>
            <p className="text-gray-500 mt-1">다가오는 일정을 확인하세요</p>
          </div>
          <Link href="/about/schedule" className="text-primary hover:text-primary-dark font-medium flex items-center gap-1">
            전체 일정 보기 <i className="fas fa-arrow-right text-sm"></i>
          </Link>
        </div>

        {/* 월 표시 */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <button className="p-2 text-gray-400 hover:text-primary transition-colors">
            <i className="fas fa-chevron-left"></i>
          </button>
          <span className="text-lg font-semibold text-gray-900">{monthLabel}</span>
          <button className="p-2 text-gray-400 hover:text-primary transition-colors">
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>

        {/* 캘린더 그리드 */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {/* 요일 헤더 */}
          <div className="grid grid-cols-7 border-b border-gray-200">
            {days.map((day, i) => (
              <div 
                key={day} 
                className={`py-3 text-center text-sm font-medium ${
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
                  className={`min-h-[100px] p-2 border-r border-gray-100 last:border-r-0 ${
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
                      <span className="ml-1 px-1.5 py-0.5 bg-white text-primary text-xs rounded">오늘</span>
                    )}
                  </div>
                  {dateEvents.slice(0, 2).map((event) => (
                    <div 
                      key={event.id}
                      className={`text-xs px-1.5 py-1 rounded mb-1 truncate ${
                        isTodayDate 
                          ? 'bg-white/20 text-white' 
                          : 'bg-primary/10 text-primary'
                      }`}
                      title={`${event.title} (${event.time})`}
                    >
                      <span className={isTodayDate ? 'text-white' : 'text-primary'}>●</span> {event.title}
                      <div className={`text-[10px] ${isTodayDate ? 'text-white/80' : 'text-gray-500'}`}>
                        {event.time} | {event.location}
                      </div>
                    </div>
                  ))}
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
                  className={`min-h-[100px] p-2 border-r border-gray-100 last:border-r-0 ${
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
                      <span className="ml-1 px-1.5 py-0.5 bg-white text-primary text-xs rounded">오늘</span>
                    )}
                  </div>
                  {dateEvents.slice(0, 2).map((event) => (
                    <div 
                      key={event.id}
                      className={`text-xs px-1.5 py-1 rounded mb-1 truncate ${
                        isTodayDate 
                          ? 'bg-white/20 text-white' 
                          : 'bg-primary/10 text-primary'
                      }`}
                      title={`${event.title} (${event.time})`}
                    >
                      <span className={isTodayDate ? 'text-white' : 'text-primary'}>●</span> {event.title}
                      <div className={`text-[10px] ${isTodayDate ? 'text-white/80' : 'text-gray-500'}`}>
                        {event.time} | {event.location}
                      </div>
                    </div>
                  ))}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
