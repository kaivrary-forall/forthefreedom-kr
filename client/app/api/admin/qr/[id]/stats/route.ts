import { NextRequest, NextResponse } from 'next/server'

const RAILWAY_API = 'https://forthefreedom-kr-production.up.railway.app'

// QR 통계 조회
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authHeader = request.headers.get('Authorization')
    
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || '30d'

    const res = await fetch(`${RAILWAY_API}/api/admin/qr/${id}/stats?period=${period}`, {
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': authHeader 
      },
      cache: 'no-store'
    })

    const data = await res.json()
    return NextResponse.json(data, { status: res.status })
  } catch (error) {
    console.error('QR stats error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
