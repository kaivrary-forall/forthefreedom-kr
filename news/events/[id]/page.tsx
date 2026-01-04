import type { Metadata } from 'next'
import NewsTabs from '@/components/news/NewsTabs'
import EventDetailAPI from '@/components/events/EventDetailAPI'

export const metadata: Metadata = {
  title: '행사안내 | 자유와혁신',
  description: '자유와혁신 행사 상세 정보',
}

export default function EventDetailPage() {
  return (
    <div>
      <section 
        className="relative h-[30vh] flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: "url('/images/night-pic.jpg')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20"></div>
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-3xl md:text-4xl font-bold drop-shadow-lg">행사안내</h1>
        </div>
      </section>

      <main className="relative z-10 bg-white">
        <NewsTabs active="events" />

        <section className="py-12">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <EventDetailAPI />
          </div>
        </section>
      </main>
    </div>
  )
}
