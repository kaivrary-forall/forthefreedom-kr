import { NextRequest, NextResponse } from 'next/server'

// 환경변수에서 로드 (Vercel에서 설정)
const GOOGLE_CALENDAR_ID = process.env.GOOGLE_CALENDAR_ID || ''
const GOOGLE_API_KEY = process.env.GOOGLE_CALENDAR_API_KEY || ''
const CACHE_DURATION = 60
const TIMEOUT = 8000

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const source = searchParams.get('source') || 'google' // 'google' or 'railway'
  
  if (source === 'railway') {
    return fetchRailwayEvents(searchParams)
  }
  
  return fetchGoogleCalendar()
}

async function fetchGoogleCalendar() {
  // 환경변수 체크
  if (!GOOGLE_CALENDAR_ID || !GOOGLE_API_KEY) {
    console.error('Google Calendar 환경변수가 설정되지 않았습니다.')
    return NextResponse.json({
      success: false,
      events: [],
      source: 'google',
      error: 'Google Calendar not configured'
    }, { status: 200 })
  }

  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT)

    // 4주 전부터 3개월 후까지의 일정 조회 (캘린더 ±4주 이동 지원)
    const fourWeeksAgo = new Date()
    fourWeeksAgo.setDate(fourWeeksAgo.getDate() - 28)
    
    const threeMonthsLater = new Date()
    threeMonthsLater.setMonth(threeMonthsLater.getMonth() + 3)

    const params = new URLSearchParams({
      key: GOOGLE_API_KEY,
      timeMin: fourWeeksAgo.toISOString(),
      timeMax: threeMonthsLater.toISOString(),
      singleEvents: 'true',
      orderBy: 'startTime',
      maxResults: '50'
    })

    const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(GOOGLE_CALENDAR_ID)}/events?${params}`

    const response = await fetch(url, {
      signal: controller.signal,
      next: { revalidate: CACHE_DURATION }
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      throw new Error(`Google Calendar API error: ${response.status}`)
    }

    const data = await response.json()

    // Google Calendar 응답을 통일된 형식으로 변환
    const events = (data.items || []).map((item: any) => ({
      _id: item.id,
      title: item.summary || '제목 없음',
      content: item.description || '',
      eventDate: item.start?.dateTime || item.start?.date || '',
      endDate: item.end?.dateTime || item.end?.date || '',
      eventLocation: item.location || '',
      isAllDay: !item.start?.dateTime,
      source: 'google'
    }))

    return NextResponse.json({
      success: true,
      events,
      source: 'google',
      total: events.length
    })

  } catch (error) {
    console.error('Google Calendar proxy error:', error)
    
    return NextResponse.json({
      success: false,
      events: [],
      source: 'google',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 200 })
  }
}

async function fetchRailwayEvents(searchParams: URLSearchParams) {
  const RAILWAY_API = 'https://forthefreedom-kr-production.up.railway.app/api'
  const limit = searchParams.get('limit') || '10'
  const page = searchParams.get('page') || '1'

  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT)

    const response = await fetch(
      `${RAILWAY_API}/events?limit=${limit}&page=${page}&sort=-eventDate`,
      {
        signal: controller.signal,
        next: { revalidate: CACHE_DURATION }
      }
    )

    clearTimeout(timeoutId)

    if (!response.ok) {
      throw new Error(`Events API error: ${response.status}`)
    }

    const data = await response.json()

    if (!data.success) {
      throw new Error('Events API returned success: false')
    }

    return NextResponse.json({
      success: true,
      events: data.data || [],
      pagination: data.pagination || null,
      source: 'railway'
    })

  } catch (error) {
    console.error('Railway events proxy error:', error)
    
    return NextResponse.json({
      success: false,
      events: [],
      pagination: null,
      source: 'railway',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 200 })
  }
}
