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
    <div>
      <NewsTabs active="events" />
      <main className="bg-white">
        <EventsListAPI />
      </main>
    </div>
  )
}
