import { NextRequest, NextResponse } from 'next/server'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://forthefreedom-kr-production.up.railway.app'

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ success: false, message: '인증이 필요합니다' }, { status: 401 })
    }

    const body = await request.json()

    const response = await fetch(`${API_URL}/api/admin/slots/create`, {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })

    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error('슬롯 생성 오류:', error)
    return NextResponse.json({ success: false, message: '슬롯 생성 중 오류가 발생했습니다' }, { status: 500 })
  }
}
