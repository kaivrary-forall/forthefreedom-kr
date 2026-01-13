import type { Metadata } from 'next'
import NewsTabs from '@/components/news/NewsTabs'
import NewsListAPI from '@/components/news/NewsListAPI'

export const metadata: Metadata = {
  title: '성명 | 자유와혁신',
  description: '자유와혁신의 공식 성명과 대변인 발표입니다.',
  openGraph: {
    title: '성명 | 자유와혁신',
    description: '자유와혁신의 공식 성명',
    url: 'https://forthefreedom.kr/news/press-releases',
  },
}

export default function PressReleasesPage() {
  return (
    <div className="pt-16">
      <NewsTabs active="press-releases" />
      <main className="bg-white">
        <NewsListAPI 
          category="spokesperson" 
          title="" 
          basePath="/news/press-releases" 
        />
      </main>
    </div>
  )
}
