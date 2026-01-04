import { NextRequest, NextResponse } from 'next/server'

const RAILWAY_API = 'https://forthefreedom-kr-production.up.railway.app'

// GET: 관리자용 배너 목록 (all=true로 비활성 포함)
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization')
    
    if (!authHeader) {
      return NextResponse.json({
        success: false,
        message: '인증이 필요합니다'
      }, { status: 401 })
    }

    const response = await fetch(`${RAILWAY_API}/api/banners?all=true`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader
      },
      cache: 'no-store'
    })

    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error('Admin banners GET error:', error)
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch banners'
    }, { status: 500 })
  }
}

// POST: 배너 생성 (multipart/form-data)
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization')
    
    if (!authHeader) {
      return NextResponse.json({
        success: false,
        message: '인증이 필요합니다'
      }, { status: 401 })
    }

    // FormData 그대로 전달
    const formData = await request.formData()

    const response = await fetch(`${RAILWAY_API}/api/banners`, {
      method: 'POST',
      headers: {
        'Authorization': authHeader
        // Content-Type은 자동 설정됨 (multipart/form-data)
      },
      body: formData
    })

    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error('Admin banners POST error:', error)
    return NextResponse.json({
      success: false,
      message: 'Failed to create banner'
    }, { status: 500 })
  }
}
