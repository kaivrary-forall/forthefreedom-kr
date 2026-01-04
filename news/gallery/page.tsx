import type { Metadata } from 'next'
import NewsTabs from '@/components/news/NewsTabs'
import NewsListAPI from '@/components/news/NewsListAPI'

export const metadata: Metadata = {
  title: '포토갤러리 | 자유와혁신',
  description: '자유와혁신의 활동 사진을 확인하세요.',
  openGraph: {
    title: '포토갤러리 | 자유와혁신',
    description: '자유와혁신의 활동 사진',
    url: 'https://forthefreedom.kr/news/gallery',
  },
}

export default function GalleryPage() {
  return (
    <div>
      <section 
        className="relative h-[40vh] flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: "url('/images/night-pic.jpg')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20"></div>
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg">포토갤러리</h1>
          <p className="text-xl text-gray-200 drop-shadow">자유와혁신의 활동 현장</p>
        </div>
      </section>

      <main className="relative z-10 bg-white">
        <NewsTabs active="gallery" />
        <NewsListAPI 
          category="gallery" 
          title="" 
          basePath="/news/gallery" 
        />
      </main>
    </div>
  )
}
