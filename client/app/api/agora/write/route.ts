import { NextRequest, NextResponse } from 'next/server'

const RAILWAY_API = 'https://forthefreedom-kr-production.up.railway.app/api'

// 글쓰기
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization')

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({
        success: false,
        message: '로그인이 필요합니다'
      }, { status: 401 })
    }

    const body = await request.json()
    const { title, content, boardType = 'member' } = body

    if (!title || !title.trim()) {
      return NextResponse.json({
        success: false,
        message: '제목을 입력해주세요'
      }, { status: 400 })
    }

    if (!content || !content.trim()) {
      return NextResponse.json({
        success: false,
        message: '내용을 입력해주세요'
      }, { status: 400 })
    }

    const response = await fetch(`${RAILWAY_API}/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader
      },
      body: JSON.stringify({ 
        title: title.trim(), 
        content: content.trim(),
        boardType 
      })
    })

    const data = await response.json()

    if (response.ok && data.success) {
      return NextResponse.json({
        success: true,
        message: data.message || '게시글이 작성되었습니다',
        post: data.data
      }, { status: 201 })
    } else {
      return NextResponse.json({
        success: false,
        message: data.message || '게시글 작성에 실패했습니다'
      }, { status: response.status })
    }

  } catch (error) {
    console.error('Post create proxy error:', error)
    return NextResponse.json({
      success: false,
      message: '게시글 작성 중 오류가 발생했습니다'
    }, { status: 500 })
  }
}
