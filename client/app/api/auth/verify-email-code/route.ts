import { NextRequest, NextResponse } from 'next/server'

const RAILWAY_API = 'https://forthefreedom-kr-production.up.railway.app/api'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, code } = body

    if (!email || !code) {
      return NextResponse.json({
        success: false,
        message: '이메일과 인증 코드를 입력해주세요'
      }, { status: 400 })
    }

    const response = await fetch(`${RAILWAY_API}/members/register/verify-email-code`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        email: email.toLowerCase().trim(),
        code: code.trim()
      })
    })

    const data = await response.json()

    return NextResponse.json(data, { status: response.status })

  } catch (error) {
    console.error('Verify email code proxy error:', error)
    return NextResponse.json({
      success: false,
      message: '인증 확인 중 오류가 발생했습니다'
    }, { status: 500 })
  }
}
