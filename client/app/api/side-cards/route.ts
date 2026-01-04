import { NextResponse } from 'next/server'

const RAILWAY_API = 'https://forthefreedom-kr-production.up.railway.app/api'

export async function GET() {
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 8000) // 8초 타임아웃

    const response = await fetch(`${RAILWAY_API}/side-cards`, {
      signal: controller.signal,
      next: { tags: ['sidecards'] }  // 캐시 태그 기반 즉시반영
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      throw new Error(`Side-cards API error: ${response.status}`)
    }

    const data = await response.json()

    // success 필드 검증
    if (!data.success) {
      throw new Error('Side-cards API returned success: false')
    }

    return NextResponse.json({
      success: true,
      data: data.data || []
    })

  } catch (error) {
    console.error('Side-cards proxy error:', error)
    
    // fallback 데이터 반환
    return NextResponse.json({
      success: false,
      data: [],
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 200 })
  }
}
