import { NextRequest, NextResponse } from 'next/server'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://forthefreedom-kr-production.up.railway.app'

export async function GET() {
  try {
    const response = await fetch(`${API_URL}/api/announcement`, {
      cache: 'no-store'
    })
    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ success: false, message: '서버 오류' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ success: false, message: '인증이 필요합니다' }, { status: 401 })
    }

    const body = await request.json()
    const response = await fetch(`${API_URL}/api/announcement`, {
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
    return NextResponse.json({ success: false, message: '서버 오류' }, { status: 500 })
  }
}
