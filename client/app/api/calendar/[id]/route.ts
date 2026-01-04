import { NextRequest, NextResponse } from 'next/server'

const RAILWAY_API = 'https://forthefreedom-kr-production.up.railway.app/api'
const CACHE_DURATION = 60
const TIMEOUT = 8000

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT)

    const response = await fetch(`${RAILWAY_API}/events/${id}`, {
      signal: controller.signal,
      next: { revalidate: CACHE_DURATION }
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json({
          success: false,
          error: 'Event not found'
        }, { status: 404 })
      }
      throw new Error(`Event API error: ${response.status}`)
    }

    const data = await response.json()

    if (!data.success) {
      throw new Error('Event API returned success: false')
    }

    return NextResponse.json({
      success: true,
      event: data.data
    })

  } catch (error) {
    console.error(`Calendar detail proxy error (${id}):`, error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
