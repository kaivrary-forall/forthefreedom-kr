import type { Metadata } from 'next'
import NewsTabs from '@/components/news/NewsTabs'
import NewsDetailAPI from '@/components/news/NewsDetailAPI'

export const metadata: Metadata = {
  title: '언론보도 | 자유와혁신',
  description: '자유와혁신 언론보도',
}

export default function MediaDetailPage() {
  return (
    <div>
      <NewsTabs active="media" />
      <main className="bg-white">
        <NewsDetailAPI 
          category="media-coverage"
          title="언론보도"
          backPath="/news/media"
          backLabel="언론보도 목록"
        />
      </main>
    </div>
  )
}
