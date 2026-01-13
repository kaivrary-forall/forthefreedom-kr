import type { Metadata } from 'next'
import NewsTabs from '@/components/news/NewsTabs'
import NewsListAPI from '@/components/news/NewsListAPI'

export const metadata: Metadata = {
  title: '갤러리 | 자유와혁신',
  description: '자유와혁신의 활동 사진을 확인하세요.',
  openGraph: {
    title: '갤러리 | 자유와혁신',
    description: '자유와혁신의 활동 사진',
    url: 'https://forthefreedom.kr/news/gallery',
  },
}

export default function GalleryPage() {
  return (
    <div className="pt-16">
      <NewsTabs active="gallery" />
      <main className="bg-white">
        <NewsListAPI 
          category="gallery" 
          title="" 
          basePath="/news/gallery" 
        />
      </main>
    </div>
  )
}
