import { NextRequest, NextResponse } from 'next/server'

const RAILWAY_API = 'https://forthefreedom-kr-production.up.railway.app'

// GET: 관리자용 공지사항 목록 (all status)
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization')
    
    if (!authHeader) {
      return NextResponse.json({
        success: false,
        message: '인증이 필요합니다'
      }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = searchParams.get('page') || '1'
    const limit = searchParams.get('limit') || '20'
    const status = searchParams.get('status') || 'all'

    const response = await fetch(
      `${RAILWAY_API}/api/notices?page=${page}&limit=${limit}&status=${status}`,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': authHeader
        },
        cache: 'no-store'
      }
    )

    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error('Admin notices GET error:', error)
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch notices'
    }, { status: 500 })
  }
}

// POST: 공지사항 생성 (multipart/form-data)
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization')
    
    if (!authHeader) {
      return NextResponse.json({
        success: false,
        message: '인증이 필요합니다'
      }, { status: 401 })
    }

    const formData = await request.formData()

    const response = await fetch(`${RAILWAY_API}/api/notices`, {
      method: 'POST',
      headers: {
        'Authorization': authHeader
      },
      body: formData
    })

    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error('Admin notices POST error:', error)
    return NextResponse.json({
      success: false,
      message: 'Failed to create notice'
    }, { status: 500 })
  }
}
