import type { Metadata } from 'next'
import NewsTabs from '@/components/news/NewsTabs'
import EventsListAPI from '@/components/events/EventsListAPI'

export const metadata: Metadata = {
  title: '행사안내 | 자유와혁신',
  description: '자유와혁신 행사 및 집회 일정을 확인하세요.',
  openGraph: {
    title: '행사안내 | 자유와혁신',
    description: '자유와혁신 행사 및 집회 일정',
    url: 'https://www.forthefreedom.kr/news/events',
  },
}

export default function EventsPage() {
  return (
    <div>
      <section 
        className="relative h-[40vh] flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: "url('/images/night-pic.jpg')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20"></div>
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg">행사안내</h1>
          <p className="text-xl text-gray-200 drop-shadow">함께하는 자유와혁신 행사</p>
        </div>
      </section>

      <main className="relative z-10 bg-white">
        <NewsTabs active="events" />

        <section className="py-12">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <EventsListAPI />
          </div>
        </section>
      </main>
    </div>
  )
}
