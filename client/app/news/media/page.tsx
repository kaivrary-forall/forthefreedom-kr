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
    <div>
      <section 
        className="relative h-[40vh] flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: "url('/images/night-pic.jpg')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20"></div>
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg">언론보도</h1>
          <p className="text-xl text-gray-200 drop-shadow">미디어에 비친 자유와혁신</p>
        </div>
      </section>

      <main className="relative z-10 bg-white">
        <NewsTabs active="media" />
        <NewsListAPI 
          category="media-coverage" 
          title="" 
          basePath="/news/media" 
        />
      </main>
    </div>
  )
}
