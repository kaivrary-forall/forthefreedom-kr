import type { Metadata } from 'next'
import NewsTabs from '@/components/news/NewsTabs'
import NewsDetailAPI from '@/components/news/NewsDetailAPI'

export const metadata: Metadata = {
  title: '카드뉴스 | 자유와혁신',
  description: '자유와혁신 카드뉴스',
}

export default function CardNewsDetailPage() {
  return (
    <div>
      <NewsTabs active="card-news" />
      <main className="bg-white">
        <NewsDetailAPI 
          category="card-news"
          title="카드뉴스"
          backPath="/news/card-news"
          backLabel="카드뉴스 목록"
        />
      </main>
    </div>
  )
}
