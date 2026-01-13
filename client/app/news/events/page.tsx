import type { Metadata } from 'next'
import NewsTabs from '@/components/news/NewsTabs'
import EventsListAPI from '@/components/events/EventsListAPI'

export const metadata: Metadata = {
  title: '주요일정 | 자유와혁신',
  description: '자유와혁신 행사 및 집회 일정을 확인하세요.',
  openGraph: {
    title: '주요일정 | 자유와혁신',
    description: '자유와혁신 행사 및 집회 일정',
    url: 'https://www.forthefreedom.kr/news/events',
  },
}

export default function EventsPage() {
  return (
    <div className="pt-16">
      <NewsTabs active="events" />
      <main className="bg-white">
        <section className="py-12">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <EventsListAPI />
          </div>
        </section>
      </main>
    </div>
  )
}
