import { NextRequest, NextResponse } from 'next/server'

const RAILWAY_API = 'https://forthefreedom-kr-production.up.railway.app/api'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const nickname = searchParams.get('nickname')

    if (!nickname) {
      return NextResponse.json({
        success: false,
        message: '닉네임을 입력해주세요'
      }, { status: 400 })
    }

    const response = await fetch(
      `${RAILWAY_API}/members/check-nickname?nickname=${encodeURIComponent(nickname.trim())}`
    )

    const data = await response.json()

    return NextResponse.json({
      success: true,
      available: data.available
    })

  } catch (error) {
    console.error('Check nickname proxy error:', error)
    return NextResponse.json({
      success: false,
      message: '확인 중 오류가 발생했습니다'
    }, { status: 500 })
  }
}
