import type { Metadata } from 'next'
import NewsTabs from '@/components/news/NewsTabs'
import NewsDetailAPI from '@/components/news/NewsDetailAPI'

export const metadata: Metadata = {
  title: '인사공고 | 자유와혁신',
  description: '자유와혁신 인사공고',
}

export default function PersonnelDetailPage() {
  return (
    <div>
      <NewsTabs active="personnel" />
      <main className="bg-white">
        <NewsDetailAPI 
          category="personnel"
          title="인사공고"
          backPath="/news/personnel"
          backLabel="인사공고 목록"
        />
      </main>
    </div>
  )
}
