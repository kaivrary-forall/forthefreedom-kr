import { NextResponse } from 'next/server'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://forthefreedom-kr-production.up.railway.app'

export async function GET() {
  try {
    const response = await fetch(`${API_URL}/api/announcement/all`, {
      cache: 'no-store'
    })
    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ success: false, message: '서버 오류' }, { status: 500 })
  }
}
