import { NextResponse } from 'next/server'

const RAILWAY_API = 'https://forthefreedom-kr-production.up.railway.app/api'

export async function GET() {
  try {
    // Railway API에서 배너 + 설정 동시 로드
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 8000) // 8초 타임아웃

    const [bannersRes, settingsRes] = await Promise.all([
      fetch(`${RAILWAY_API}/banners`, {
        signal: controller.signal,
        next: { tags: ['banners'] }  // 캐시 태그 기반 즉시반영
      }),
      fetch(`${RAILWAY_API}/banners/settings`, {
        signal: controller.signal,
        next: { tags: ['banners'] }  // 캐시 태그 기반 즉시반영
      })
    ])

    clearTimeout(timeoutId)

    if (!bannersRes.ok) {
      throw new Error(`Banners API error: ${bannersRes.status}`)
    }

    const bannersData = await bannersRes.json()
    const settingsData = settingsRes.ok ? await settingsRes.json() : { success: true, data: { randomOrder: false } }

    // success 필드 검증
    if (!bannersData.success) {
      throw new Error('Banners API returned success: false')
    }

    return NextResponse.json({
      success: true,
      banners: bannersData.data || [],
      settings: settingsData.data || { randomOrder: false }
    })

  } catch (error) {
    console.error('Banners proxy error:', error)
    
    // fallback 데이터 반환
    return NextResponse.json({
      success: false,
      banners: [],
      settings: { randomOrder: false },
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 200 }) // 200으로 반환해서 프론트에서 fallback 처리
  }
}
