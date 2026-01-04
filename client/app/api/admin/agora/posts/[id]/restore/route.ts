import { NextRequest, NextResponse } from 'next/server'

const RAILWAY_API = 'https://forthefreedom-kr-production.up.railway.app'

// PATCH: 게시글 복구
export async function PATCH(
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

    const response = await fetch(`${RAILWAY_API}/api/posts/${id}/restore`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader
      }
    })

    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error('Admin agora post restore error:', error)
    return NextResponse.json({
      success: false,
      message: 'Failed to restore post'
    }, { status: 500 })
  }
}
