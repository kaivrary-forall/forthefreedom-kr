import { NextRequest, NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'

export async function POST(request: NextRequest) {
  try {
    // 시크릿 검증
    const secret = request.headers.get('x-revalidate-secret')
    const expectedSecret = process.env.REVALIDATE_SECRET

    if (!expectedSecret) {
      console.warn('REVALIDATE_SECRET not configured')
      // 개발 환경에서는 시크릿 없이도 허용
      if (process.env.NODE_ENV === 'production') {
        return NextResponse.json({ success: false, message: 'Secret not configured' }, { status: 500 })
      }
    } else if (secret !== expectedSecret) {
      return NextResponse.json({ success: false, message: 'Invalid secret' }, { status: 401 })
    }

    const body = await request.json()
    const tags = body.tags || []

    // 태그별 revalidate
    for (const tag of tags) {
      await revalidateTag(tag, '/')
      console.log(`Revalidated tag: ${tag}`)
    }

    return NextResponse.json({
      success: true,
      message: `Revalidated tags: ${tags.join(', ')}`,
      revalidatedAt: new Date().toISOString()
    })
  } catch (error) {
    console.error('Revalidate error:', error)
    return NextResponse.json({
      success: false,
      message: 'Revalidation failed'
    }, { status: 500 })
  }
}
