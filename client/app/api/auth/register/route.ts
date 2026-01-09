import { NextRequest, NextResponse } from 'next/server'

const RAILWAY_API = 'https://forthefreedom-kr-production.up.railway.app/api'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, password, passwordConfirm, name, nickname, email, phone, agreements } = body

    // 필수 필드 검증
    if (!userId || !password || !passwordConfirm || !name || !nickname || !email || !phone) {
      return NextResponse.json({
        success: false,
        message: '모든 필수 항목을 입력해주세요'
      }, { status: 400 })
    }

    // 아이디 형식 검증
    if (!/^[a-zA-Z0-9_]{4,20}$/.test(userId)) {
      return NextResponse.json({
        success: false,
        message: '아이디는 영문/숫자/밑줄 4~20자여야 합니다'
      }, { status: 400 })
    }

    // 비밀번호 길이 검증
    if (password.length < 8) {
      return NextResponse.json({
        success: false,
        message: '비밀번호는 8자 이상이어야 합니다'
      }, { status: 400 })
    }

    // 비밀번호 확인
    if (password !== passwordConfirm) {
      return NextResponse.json({
        success: false,
        message: '비밀번호가 일치하지 않습니다'
      }, { status: 400 })
    }

    // 이메일 형식 검증
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({
        success: false,
        message: '올바른 이메일 형식이 아닙니다'
      }, { status: 400 })
    }

    // 약관 동의 검증
    if (!agreements?.terms || !agreements?.privacy) {
      return NextResponse.json({
        success: false,
        message: '필수 약관에 동의해주세요'
      }, { status: 400 })
    }

    const response = await fetch(`${RAILWAY_API}/members/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userId: userId.toLowerCase().trim(),
        password,
        passwordConfirm,
        name: name.trim(),
        nickname: nickname.trim(),
        email: email.toLowerCase().trim(),
        phone: phone.replace(/\D/g, ''),
        agreements
      })
    })

    const data = await response.json()

    if (data.success) {
      return NextResponse.json({
        success: true,
        message: '회원가입이 완료되었습니다'
      })
    } else {
      return NextResponse.json({
        success: false,
        message: data.message || '회원가입에 실패했습니다'
      }, { status: 400 })
    }

  } catch (error) {
    console.error('Register proxy error:', error)
    return NextResponse.json({
      success: false,
      message: '회원가입 처리 중 오류가 발생했습니다'
    }, { status: 500 })
  }
}
