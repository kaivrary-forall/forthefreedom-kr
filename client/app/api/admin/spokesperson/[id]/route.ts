import { NextRequest, NextResponse } from 'next/server'

const RAILWAY_API = 'https://forthefreedom-kr-production.up.railway.app'

// GET: 보도자료 단일 조회
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

    const response = await fetch(`${RAILWAY_API}/api/spokesperson/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader
      },
      cache: 'no-store'
    })

    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error('Admin spokesperson GET error:', error)
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch spokesperson'
    }, { status: 500 })
  }
}

// PUT: 보도자료 수정 (multipart/form-data)
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

    const formData = await request.formData()

    const response = await fetch(`${RAILWAY_API}/api/spokesperson/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': authHeader
      },
      body: formData
    })

    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error('Admin spokesperson PUT error:', error)
    return NextResponse.json({
      success: false,
      message: 'Failed to update spokesperson'
    }, { status: 500 })
  }
}

// DELETE: 보도자료 삭제
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

    const response = await fetch(`${RAILWAY_API}/api/spokesperson/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader
      }
    })

    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error('Admin spokesperson DELETE error:', error)
    return NextResponse.json({
      success: false,
      message: 'Failed to delete spokesperson'
    }, { status: 500 })
  }
}
