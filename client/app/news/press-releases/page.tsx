import type { Metadata } from 'next'
import NewsTabs from '@/components/news/NewsTabs'
import NewsListAPI from '@/components/news/NewsListAPI'

export const metadata: Metadata = {
  title: '보도자료 | 자유와혁신',
  description: '자유와혁신의 공식 보도자료와 대변인 발표입니다.',
  openGraph: {
    title: '보도자료 | 자유와혁신',
    description: '자유와혁신의 공식 보도자료',
    url: 'https://forthefreedom.kr/news/press-releases',
  },
}

export default function PressReleasesPage() {
  return (
    <div>
      <section 
        className="relative h-[40vh] flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: "url('/images/night-pic.jpg')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20"></div>
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg">보도자료</h1>
          <p className="text-xl text-gray-200 drop-shadow">대변인실 공식 발표</p>
        </div>
      </section>

      <main className="relative z-10 bg-white">
        <NewsTabs active="press-releases" />
        <NewsListAPI 
          category="spokesperson" 
          title="" 
          basePath="/news/press-releases" 
        />
      </main>
    </div>
  )
}
