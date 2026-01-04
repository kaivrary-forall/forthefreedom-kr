import { NextRequest, NextResponse } from 'next/server'

const RAILWAY_API = 'https://forthefreedom-kr-production.up.railway.app'

// GET: 게시글 목록 (관리자용 - 삭제된 글 포함)
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization')
    
    if (!authHeader) {
      return NextResponse.json({
        success: false,
        message: '인증이 필요합니다'
      }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = searchParams.get('page') || '1'
    const limit = searchParams.get('limit') || '20'
    const boardType = searchParams.get('boardType') || 'member'
    const keyword = searchParams.get('keyword') || ''
    const includeDeleted = searchParams.get('includeDeleted') || 'false'

    // 기본 API 호출
    let url = `${RAILWAY_API}/api/posts?page=${page}&limit=${limit}&boardType=${boardType}`
    if (keyword) url += `&keyword=${encodeURIComponent(keyword)}`

    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader
      },
      cache: 'no-store'
    })

    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error('Admin agora posts GET error:', error)
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch posts'
    }, { status: 500 })
  }
}
