import { NextRequest, NextResponse } from 'next/server'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://forthefreedom-kr-production.up.railway.app'

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader) {
      return NextResponse.json(
        { success: false, message: '인증이 필요합니다' },
        { status: 401 }
      )
    }

    const response = await fetch(`${API_URL}/api/admin/slots/permissions`, {
      headers: {
        'Authorization': authHeader
      }
    })

    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error('권한 목록 조회 오류:', error)
    return NextResponse.json(
      { success: false, message: '권한 목록 조회 중 오류가 발생했습니다' },
      { status: 500 }
    )
  }
}
