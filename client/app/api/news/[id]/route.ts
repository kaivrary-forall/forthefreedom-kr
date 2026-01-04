import { NextRequest, NextResponse } from 'next/server'

const RAILWAY_API = 'https://forthefreedom-kr-production.up.railway.app/api'
const CACHE_DURATION = 60
const TIMEOUT = 8000

// 카테고리 → Railway 엔드포인트 매핑
const CATEGORY_MAP: Record<string, string> = {
  'notices': 'notices',
  'spokesperson': 'spokesperson',
  'card-news': 'card-news',
  'activities': 'activities',
  'gallery': 'gallery',
  'media-coverage': 'media-coverage'
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category')

  if (!category || !CATEGORY_MAP[category]) {
    return NextResponse.json({
      success: false,
      error: `Invalid category. Valid: ${Object.keys(CATEGORY_MAP).join(', ')}`
    }, { status: 400 })
  }

  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT)

    const endpoint = CATEGORY_MAP[category]
    const response = await fetch(`${RAILWAY_API}/${endpoint}/${id}`, {
      signal: controller.signal,
      next: { revalidate: CACHE_DURATION }
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json({
          success: false,
          error: 'Not found'
        }, { status: 404 })
      }
      throw new Error(`API error: ${response.status}`)
    }

    const data = await response.json()

    if (!data.success) {
      throw new Error('API returned success: false')
    }

    return NextResponse.json({
      success: true,
      category,
      data: data.data
    })

  } catch (error) {
    console.error(`News detail proxy error (${category}/${id}):`, error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
