import { NextRequest, NextResponse } from 'next/server'

const RAILWAY_API = 'https://forthefreedom-kr-production.up.railway.app'

// 랜딩페이지 목록 조회
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization')
    
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const res = await fetch(`${RAILWAY_API}/api/admin/landing`, {
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': authHeader 
      },
      cache: 'no-store'
    })

    const data = await res.json()
    return NextResponse.json(data, { status: res.status })
  } catch (error) {
    console.error('Landing list error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

// 랜딩페이지 생성
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization')
    
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()

    const res = await fetch(`${RAILWAY_API}/api/admin/landing`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader
      },
      body: JSON.stringify(body)
    })

    const data = await res.json()
    return NextResponse.json(data, { status: res.status })
  } catch (error) {
    console.error('Landing create error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
