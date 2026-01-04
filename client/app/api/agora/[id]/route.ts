import { NextRequest, NextResponse } from 'next/server'

const RAILWAY_API = 'https://forthefreedom-kr-production.up.railway.app/api'
const TIMEOUT = 8000

// 캐싱 비활성화 - 댓글 실시간 반영
export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT)

    const response = await fetch(`${RAILWAY_API}/posts/${id}`, {
      signal: controller.signal,
      cache: 'no-store'  // 캐시 안 함
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json({
          success: false,
          error: 'Post not found'
        }, { status: 404 })
      }
      throw new Error(`Post API error: ${response.status}`)
    }

    const data = await response.json()

    if (!data.success) {
      throw new Error('Post API returned success: false')
    }

    // Railway 응답이 { data: { post: {...}, comments: [...] } } 구조
    const postData = data.data?.post || data.data
    
    return NextResponse.json({
      success: true,
      post: postData,
      comments: data.data?.comments || []
    })

  } catch (error) {
    console.error(`Agora detail proxy error (${id}):`, error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
