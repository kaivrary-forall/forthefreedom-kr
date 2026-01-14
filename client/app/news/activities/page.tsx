import type { Metadata } from 'next'
import NewsTabs from '@/components/news/NewsTabs'
import NewsListAPI from '@/components/news/NewsListAPI'

export const metadata: Metadata = {
  title: '활동소식 | 자유와혁신',
  description: '자유와혁신의 활동 소식입니다.',
  openGraph: {
    title: '활동소식 | 자유와혁신',
    description: '자유와혁신의 활동 소식',
    url: 'https://forthefreedom.kr/news/activities',
  },
}

export default function ActivitiesPage() {
  return (
    <div>
      <NewsTabs active="activities" />
      <main className="bg-white">
        <NewsListAPI 
          category="activities"
          title="활동소식"
        />
      </main>
    </div>
  )
}
