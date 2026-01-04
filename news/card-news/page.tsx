import type { Metadata } from 'next'
import NewsTabs from '@/components/news/NewsTabs'
import NewsListAPI from '@/components/news/NewsListAPI'

export const metadata: Metadata = {
  title: '카드뉴스 | 자유와혁신',
  description: '자유와혁신 카드뉴스. 정책과 활동을 카드뉴스로 쉽게 만나보세요.',
  openGraph: {
    title: '카드뉴스 | 자유와혁신',
    description: '자유와혁신 카드뉴스',
    url: 'https://forthefreedom.kr/news/card-news',
  },
}

export default function CardNewsPage() {
  return (
    <div>
      <section 
        className="relative h-[40vh] flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: "url('/images/night-pic.jpg')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20"></div>
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg">카드뉴스</h1>
          <p className="text-xl text-gray-200 drop-shadow">한눈에 보는 자유와혁신</p>
        </div>
      </section>

      <main className="relative z-10 bg-white">
        <NewsTabs active="card-news" />
        <NewsListAPI 
          category="card-news" 
          title="" 
          basePath="/news/card-news" 
        />
      </main>
    </div>
  )
}
