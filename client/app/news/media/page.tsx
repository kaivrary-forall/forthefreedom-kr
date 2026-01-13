import type { Metadata } from 'next'
import NewsTabs from '@/components/news/NewsTabs'
import NewsListAPI from '@/components/news/NewsListAPI'

export const metadata: Metadata = {
  title: '언론보도 | 자유와혁신',
  description: '자유와혁신 관련 언론보도 모음입니다.',
  openGraph: {
    title: '언론보도 | 자유와혁신',
    description: '자유와혁신 관련 언론보도',
    url: 'https://forthefreedom.kr/news/media',
  },
}

export default function MediaPage() {
  return (
    <div className="pt-16">
      <NewsTabs active="media" />
      <main className="bg-white">
        <NewsListAPI 
          category="media-coverage" 
          title="" 
          basePath="/news/media" 
        />
      </main>
    </div>
  )
}
