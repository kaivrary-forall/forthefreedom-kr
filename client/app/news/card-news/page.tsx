import type { Metadata } from 'next'
import NewsTabs from '@/components/news/NewsTabs'
import NewsListAPI from '@/components/news/NewsListAPI'

export const metadata: Metadata = {
  title: '카드뉴스 | 자유와혁신',
  description: '자유와혁신 카드뉴스. 정책과 활동을 카드뉴스로 쉽게 만나보세요.',
  openGraph: {
    title: '카드뉴스 | 자유와혁신',
    description: '자유와혁신 카드뉴스',
    url: 'https://forthefreedom.kr/news/card-news',
  },
}

export default function CardNewsPage() {
  return (
    <div>
      <NewsTabs active="card-news" />
      <main className="bg-white">
        <NewsListAPI 
          category="card-news"
          title="카드뉴스"
        />
      </main>
    </div>
  )
}
