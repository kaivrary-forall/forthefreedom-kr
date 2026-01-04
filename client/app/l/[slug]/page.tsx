import { notFound } from 'next/navigation'
import LandingPageRenderer from '@/components/landing/LandingPageRenderer'

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://forthefreedom-kr-production.up.railway.app'

interface LandingPageData {
  _id: string
  slug: string
  title: string
  blocks: Block[]
  settings: {
    backgroundColor?: string
    fontFamily?: string
  }
  isActive: boolean
}

interface Block {
  id: string
  type: string
  data: Record<string, unknown>
}

async function getLandingPage(slug: string): Promise<LandingPageData | null> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/landing/${slug}`, {
      cache: 'no-store'
    })
    
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const page = await getLandingPage(slug)
  
  if (!page) {
    return { title: '페이지를 찾을 수 없습니다' }
  }

  return {
    title: page.title,
    viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
  }
}

export default async function LandingPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const page = await getLandingPage(slug)

  if (!page || !page.isActive) {
    notFound()
  }

  return <LandingPageRenderer page={page} />
}
