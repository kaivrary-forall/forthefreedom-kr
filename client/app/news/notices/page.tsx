import type { Metadata } from 'next'
import NewsTabs from '@/components/news/NewsTabs'
import NewsListAPI from '@/components/news/NewsListAPI'

export const metadata: Metadata = {
  title: '공지 | 자유와혁신',
  description: '자유와혁신의 최신 공지사항과 중요 소식을 확인하세요.',
  openGraph: {
    title: '공지 | 자유와혁신',
    description: '자유와혁신의 최신 공지사항',
    url: 'https://forthefreedom.kr/news/notices',
  },
}

export default function NoticesPage() {
  return (
    <div className="pt-16">
      <NewsTabs active="notices" />
      <main className="bg-white">
        <NewsListAPI 
          category="notices" 
          title="" 
          basePath="/news/notices" 
        />
      </main>
    </div>
  )
}
