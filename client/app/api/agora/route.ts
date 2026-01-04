import { NextRequest, NextResponse } from 'next/server'

const RAILWAY_API = 'https://forthefreedom-kr-production.up.railway.app/api'
const TIMEOUT = 8000

// 캐싱 비활성화 - 글쓰기 실시간 반영
export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const page = searchParams.get('page') || '1'
  const limit = searchParams.get('limit') || '20'
  const boardType = searchParams.get('boardType') || 'member' // member = 아고라

  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT)

    const response = await fetch(
      `${RAILWAY_API}/posts?boardType=${boardType}&page=${page}&limit=${limit}&sort=-createdAt`,
      {
        signal: controller.signal,
        cache: 'no-store'  // 캐시 안 함
      }
    )

    clearTimeout(timeoutId)

    if (!response.ok) {
      throw new Error(`Posts API error: ${response.status}`)
    }

    const data = await response.json()

    if (!data.success) {
      throw new Error('Posts API returned success: false')
    }

    return NextResponse.json({
      success: true,
      posts: data.data?.posts || [],
      pagination: data.data?.pagination || null
    })

  } catch (error) {
    console.error('Agora proxy error:', error)
    
    return NextResponse.json({
      success: false,
      posts: [],
      pagination: null,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 200 })
  }
}
