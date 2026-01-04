import { NextRequest, NextResponse } from 'next/server'

const RAILWAY_API = 'https://forthefreedom-kr-production.up.railway.app'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const lang = searchParams.get('lang') || 'ko'

    const response = await fetch(`${RAILWAY_API}/api/site-settings/footer?lang=${lang}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      next: { tags: ['footer'], revalidate: 60 } // 1분 캐시 + 태그
    })

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Site settings fetch error:', error)
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch footer settings'
    }, { status: 500 })
  }
}
