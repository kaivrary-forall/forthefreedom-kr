import type { Metadata } from 'next'
import NewsTabs from '@/components/news/NewsTabs'
import NewsDetailAPI from '@/components/news/NewsDetailAPI'

export const metadata: Metadata = {
  title: '공지사항 | 자유와혁신',
  description: '자유와혁신 공지사항',
}

export default function NoticeDetailPage() {
  return (
    <div>
      <NewsTabs active="notices" />
      <main className="bg-white">
        <NewsDetailAPI 
          category="notices"
          title="공지사항"
          backPath="/news/notices"
          backLabel="공지사항 목록"
        />
      </main>
    </div>
  )
}
