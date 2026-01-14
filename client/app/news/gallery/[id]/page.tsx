import type { Metadata } from 'next'
import NewsTabs from '@/components/news/NewsTabs'
import NewsDetailAPI from '@/components/news/NewsDetailAPI'

export const metadata: Metadata = {
  title: '갤러리 | 자유와혁신',
  description: '자유와혁신 갤러리',
}

export default function GalleryDetailPage() {
  return (
    <div>
      <NewsTabs active="gallery" />
      <main className="bg-white">
        <NewsDetailAPI 
          category="gallery"
          title="갤러리"
          backPath="/news/gallery"
          backLabel="갤러리 목록"
        />
      </main>
    </div>
  )
}
