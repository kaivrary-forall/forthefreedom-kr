import { NextRequest, NextResponse } from 'next/server'

const RAILWAY_API = 'https://forthefreedom-kr-production.up.railway.app'

// GET: 배너 설정 조회
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization')
    
    if (!authHeader) {
      return NextResponse.json({
        success: false,
        message: '인증이 필요합니다'
      }, { status: 401 })
    }

    const response = await fetch(`${RAILWAY_API}/api/banners/settings`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader
      },
      cache: 'no-store'
    })

    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error('Admin banner settings GET error:', error)
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch banner settings'
    }, { status: 500 })
  }
}

// PUT: 배너 설정 업데이트
export async function PUT(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization')
    
    if (!authHeader) {
      return NextResponse.json({
        success: false,
        message: '인증이 필요합니다'
      }, { status: 401 })
    }

    const body = await request.json()

    const response = await fetch(`${RAILWAY_API}/api/banners/settings`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader
      },
      body: JSON.stringify(body)
    })

    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error('Admin banner settings PUT error:', error)
    return NextResponse.json({
      success: false,
      message: 'Failed to update banner settings'
    }, { status: 500 })
  }
}
