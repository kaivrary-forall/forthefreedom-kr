import type { Metadata } from 'next'
import NewsTabs from '@/components/news/NewsTabs'
import NewsListAPI from '@/components/news/NewsListAPI'

export const metadata: Metadata = {
  title: '공지사항 | 자유와혁신',
  description: '자유와혁신의 최신 공지사항과 중요 소식을 확인하세요.',
  openGraph: {
    title: '공지사항 | 자유와혁신',
    description: '자유와혁신의 최신 공지사항',
    url: 'https://forthefreedom.kr/news/notices',
  },
}

export default function NoticesPage() {
  return (
    <div>
      {/* 히어로 */}
      <section 
        className="relative h-[40vh] flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: "url('/images/night-pic.jpg')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20"></div>
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg">공지사항</h1>
          <p className="text-xl text-gray-200 drop-shadow">자유와혁신의 중요 소식</p>
        </div>
      </section>

      <main className="relative z-10 bg-white">
        {/* 탭 네비게이션 */}
        <NewsTabs active="notices" />

        {/* 공지사항 목록 - API 연동 */}
        <NewsListAPI 
          category="notices" 
          title="" 
          basePath="/news/notices" 
        />
      </main>
    </div>
  )
}
