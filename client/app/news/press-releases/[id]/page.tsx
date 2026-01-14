import type { Metadata } from 'next'
import NewsTabs from '@/components/news/NewsTabs'
import NewsDetailAPI from '@/components/news/NewsDetailAPI'

export const metadata: Metadata = {
  title: '성명 | 자유와혁신',
  description: '자유와혁신 성명',
}

export default function PressReleaseDetailPage() {
  return (
    <div>
      <NewsTabs active="press-releases" />
      <main className="bg-white">
        <NewsDetailAPI 
          category="spokesperson"
          title="성명"
          backPath="/news/press-releases"
          backLabel="성명 목록"
        />
      </main>
    </div>
  )
}
