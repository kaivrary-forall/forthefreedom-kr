import { NextRequest, NextResponse } from 'next/server'

const RAILWAY_API = 'https://forthefreedom-kr-production.up.railway.app/api'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = body

    if (!email) {
      return NextResponse.json({
        success: false,
        message: '이메일을 입력해주세요'
      }, { status: 400 })
    }

    const response = await fetch(`${RAILWAY_API}/members/register/send-email-code`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email: email.toLowerCase().trim() })
    })

    const data = await response.json()

    return NextResponse.json(data, { status: response.status })

  } catch (error) {
    console.error('Send email code proxy error:', error)
    return NextResponse.json({
      success: false,
      message: '인증 코드 발송 중 오류가 발생했습니다'
    }, { status: 500 })
  }
}
