import { NextRequest, NextResponse } from 'next/server'

const RAILWAY_API = 'https://forthefreedom-kr-production.up.railway.app/api'

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization')

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({
        success: false,
        message: '인증 토큰이 없습니다'
      }, { status: 401 })
    }

    const token = authHeader.split(' ')[1]

    const response = await fetch(`${RAILWAY_API}/members/me`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    const data = await response.json()

    if (data.success) {
      return NextResponse.json({
        success: true,
        data: data.data
      })
    } else {
      return NextResponse.json({
        success: false,
        message: data.message || '인증에 실패했습니다'
      }, { status: 401 })
    }

  } catch (error) {
    console.error('Auth me proxy error:', error)
    return NextResponse.json({
      success: false,
      message: '인증 처리 중 오류가 발생했습니다'
    }, { status: 500 })
  }
}
