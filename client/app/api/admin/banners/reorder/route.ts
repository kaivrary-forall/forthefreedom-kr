import { NextRequest, NextResponse } from 'next/server'

const RAILWAY_API = 'https://forthefreedom-kr-production.up.railway.app'

// PUT: 배너 순서 일괄 업데이트
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

    const response = await fetch(`${RAILWAY_API}/api/banners/reorder/bulk`, {
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
    console.error('Admin banners reorder error:', error)
    return NextResponse.json({
      success: false,
      message: 'Failed to reorder banners'
    }, { status: 500 })
  }
}
