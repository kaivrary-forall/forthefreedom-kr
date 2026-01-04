import type { Metadata } from 'next'
import NewsTabs from '@/components/news/NewsTabs'
import NewsDetailAPI from '@/components/news/NewsDetailAPI'

export const metadata: Metadata = {
  title: '카드뉴스 | 자유와혁신',
  description: '자유와혁신 카드뉴스',
}

export default function CardNewsDetailPage() {
  return (
    <div>
      <section 
        className="relative h-[30vh] flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: "url('/images/night-pic.jpg')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20"></div>
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 drop-shadow-lg">카드뉴스</h1>
        </div>
      </section>

      <main className="relative z-10 bg-white">
        <NewsTabs active="card-news" />
        <NewsDetailAPI 
          category="card-news"
          title="카드뉴스"
          backPath="/news/card-news"
          backLabel="카드뉴스 목록"
        />
      </main>
    </div>
  )
}
