import { NextRequest, NextResponse } from 'next/server'

const RAILWAY_API = 'https://forthefreedom-kr-production.up.railway.app/api'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, password } = body

    if (!userId || !password) {
      return NextResponse.json({
        success: false,
        message: '아이디와 비밀번호를 입력해주세요'
      }, { status: 400 })
    }

    const response = await fetch(`${RAILWAY_API}/members/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        userId: userId.toLowerCase().trim(), 
        password 
      })
    })

    const data = await response.json()

    if (data.success) {
      // 로그인 성공 - 토큰과 회원정보 반환
      return NextResponse.json({
        success: true,
        data: {
          token: data.data.token,
          member: data.data.member
        }
      })
    } else {
      // 로그인 실패
      return NextResponse.json({
        success: false,
        message: data.message || '로그인에 실패했습니다',
        status: data.status // pending 등
      }, { status: 401 })
    }

  } catch (error) {
    console.error('Login proxy error:', error)
    return NextResponse.json({
      success: false,
      message: '로그인 처리 중 오류가 발생했습니다'
    }, { status: 500 })
  }
}
