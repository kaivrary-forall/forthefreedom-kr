import type { Metadata } from 'next'
import NewsTabs from '@/components/news/NewsTabs'
import NewsDetailAPI from '@/components/news/NewsDetailAPI'

export const metadata: Metadata = {
  title: '활동소식 | 자유와혁신',
  description: '자유와혁신 활동소식',
}

export default function ActivityDetailPage() {
  return (
    <div>
      <NewsTabs active="activities" />
      <main className="bg-white">
        <NewsDetailAPI 
          category="activities"
          title="활동소식"
          backPath="/news/activities"
          backLabel="활동소식 목록"
        />
      </main>
    </div>
  )
}
