import { NextRequest, NextResponse } from 'next/server'

const RAILWAY_API = 'https://forthefreedom-kr-production.up.railway.app/api'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({
        success: false,
        message: '아이디를 입력해주세요'
      }, { status: 400 })
    }

    const response = await fetch(
      `${RAILWAY_API}/members/check-userid?userId=${encodeURIComponent(userId.toLowerCase().trim())}`
    )

    const data = await response.json()

    return NextResponse.json({
      success: true,
      available: data.available
    })

  } catch (error) {
    console.error('Check userId proxy error:', error)
    return NextResponse.json({
      success: false,
      message: '확인 중 오류가 발생했습니다'
    }, { status: 500 })
  }
}
