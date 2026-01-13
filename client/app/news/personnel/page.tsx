import type { Metadata } from 'next'
import NewsTabs from '@/components/news/NewsTabs'
import NewsListAPI from '@/components/news/NewsListAPI'

export const metadata: Metadata = {
  title: '인사공고 | 자유와혁신',
  description: '자유와혁신의 인사공고 및 인사발령 소식입니다.',
  openGraph: {
    title: '인사공고 | 자유와혁신',
    description: '자유와혁신의 인사공고',
    url: 'https://forthefreedom.kr/news/personnel',
  },
}

export default function PersonnelPage() {
  return (
    <div className="pt-16">
      <NewsTabs active="personnel" />
      <main className="bg-white">
        <NewsListAPI 
          category="personnel" 
          title="" 
          basePath="/news/personnel" 
        />
      </main>
    </div>
  )
}
