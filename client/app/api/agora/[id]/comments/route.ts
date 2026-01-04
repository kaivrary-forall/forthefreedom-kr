import { NextRequest, NextResponse } from 'next/server'

const RAILWAY_API = 'https://forthefreedom-kr-production.up.railway.app/api'

// 댓글 작성
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: postId } = await params
    const authHeader = request.headers.get('Authorization')

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({
        success: false,
        message: '로그인이 필요합니다'
      }, { status: 401 })
    }

    const body = await request.json()
    const { content } = body

    if (!content || !content.trim()) {
      return NextResponse.json({
        success: false,
        message: '댓글 내용을 입력해주세요'
      }, { status: 400 })
    }

    const response = await fetch(`${RAILWAY_API}/posts/${postId}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader
      },
      body: JSON.stringify({ content: content.trim() })
    })

    const data = await response.json()

    if (response.ok && data.success) {
      return NextResponse.json({
        success: true,
        comment: data.comment || data.data
      }, { status: 201 })
    } else {
      return NextResponse.json({
        success: false,
        message: data.message || '댓글 작성에 실패했습니다'
      }, { status: response.status })
    }

  } catch (error) {
    console.error('Comment proxy error:', error)
    return NextResponse.json({
      success: false,
      message: '댓글 작성 중 오류가 발생했습니다'
    }, { status: 500 })
  }
}
