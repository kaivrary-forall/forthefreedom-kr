import { NextRequest, NextResponse } from 'next/server'

const RAILWAY_API = 'https://forthefreedom-kr-production.up.railway.app/api'
const TIMEOUT = 8000 // 8초 타임아웃

// 지원하는 뉴스 카테고리
const VALID_CATEGORIES = [
  'notices',        // 공지사항
  'spokesperson',   // 보도자료
  'card-news',      // 카드뉴스
  'activities',     // 활동
  'gallery',        // 갤러리
  'media-coverage'  // 언론보도
] as const

type NewsCategory = typeof VALID_CATEGORIES[number]

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category') as NewsCategory
  const limit = searchParams.get('limit') || '10'
  const page = searchParams.get('page') || '1'

  // 카테고리 검증
  if (!category || !VALID_CATEGORIES.includes(category)) {
    return NextResponse.json({
      success: false,
      error: `Invalid category. Valid: ${VALID_CATEGORIES.join(', ')}`,
      data: []
    }, { status: 400 })
  }

  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT)

    const response = await fetch(
      `${RAILWAY_API}/${category}?limit=${limit}&page=${page}&sort=-createdAt`,
      {
        signal: controller.signal,
        next: { tags: ['news', category] }  // 캐시 태그 기반 즉시반영
      }
    )

    clearTimeout(timeoutId)

    if (!response.ok) {
      throw new Error(`News API error: ${response.status}`)
    }

    const data = await response.json()

    if (!data.success) {
      throw new Error('News API returned success: false')
    }

    return NextResponse.json({
      success: true,
      category,
      data: data.data || [],
      pagination: data.pagination || null
    })

  } catch (error) {
    console.error(`News proxy error (${category}):`, error)
    
    return NextResponse.json({
      success: false,
      category,
      data: [],
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 200 })
  }
}
