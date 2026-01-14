import type { Metadata } from 'next'
import NewsTabs from '@/components/news/NewsTabs'
import EventDetailAPI from '@/components/events/EventDetailAPI'

export const metadata: Metadata = {
  title: '주요일정 | 자유와혁신',
  description: '자유와혁신 행사 상세 정보',
}

export default function EventDetailPage() {
  return (
    <div>
      <NewsTabs active="events" />
      <main className="bg-white">
        <section className="py-12">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <EventDetailAPI />
          </div>
        </section>
      </main>
    </div>
  )
}
