import { NextRequest, NextResponse } from 'next/server'

const RAILWAY_API = 'https://forthefreedom-kr-production.up.railway.app'

// GET: 배너 단일 조회
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const authHeader = request.headers.get('Authorization')
    
    if (!authHeader) {
      return NextResponse.json({
        success: false,
        message: '인증이 필요합니다'
      }, { status: 401 })
    }

    const response = await fetch(`${RAILWAY_API}/api/banners/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader
      },
      cache: 'no-store'
    })

    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error('Admin banner GET error:', error)
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch banner'
    }, { status: 500 })
  }
}

// PUT: 배너 수정 (multipart/form-data)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const authHeader = request.headers.get('Authorization')
    
    if (!authHeader) {
      return NextResponse.json({
        success: false,
        message: '인증이 필요합니다'
      }, { status: 401 })
    }

    // FormData 그대로 전달
    const formData = await request.formData()

    const response = await fetch(`${RAILWAY_API}/api/banners/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': authHeader
      },
      body: formData
    })

    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error('Admin banner PUT error:', error)
    return NextResponse.json({
      success: false,
      message: 'Failed to update banner'
    }, { status: 500 })
  }
}

// DELETE: 배너 삭제
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const authHeader = request.headers.get('Authorization')
    
    if (!authHeader) {
      return NextResponse.json({
        success: false,
        message: '인증이 필요합니다'
      }, { status: 401 })
    }

    const response = await fetch(`${RAILWAY_API}/api/banners/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader
      }
    })

    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error('Admin banner DELETE error:', error)
    return NextResponse.json({
      success: false,
      message: 'Failed to delete banner'
    }, { status: 500 })
  }
}
