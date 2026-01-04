import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const revalidate = 0

const RAILWAY_API = 'https://forthefreedom-kr-production.up.railway.app'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params

    const res = await fetch(`${RAILWAY_API}/api/qr/scan/${encodeURIComponent(code)}`, {
      cache: 'no-store',
    })

    if (!res.ok) {
      return NextResponse.json({ success: false, message: 'QR not found' }, { status: 404 })
    }

    const data = await res.json()
    const targetUrl = data?.targetUrl

    if (!targetUrl) {
      return NextResponse.json({ success: false, message: 'No targetUrl' }, { status: 404 })
    }

    return NextResponse.redirect(targetUrl)
  } catch (error) {
    console.error('QR redirect error:', error)
    return NextResponse.json({ success: false, message: 'QR redirect error' }, { status: 500 })
  }
}
