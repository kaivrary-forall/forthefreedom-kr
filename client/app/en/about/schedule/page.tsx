import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Schedule | Freedom & Innovation',
  description: 'Freedom & Innovation event schedule.',
}

const schedules = [
  {
    id: '1',
    category: 'Education',
    categoryColor: 'bg-blue-100 text-blue-800',
    title: 'New Member Orientation',
    date: 'Every 4th Saturday',
    time: '14:00 - 17:00',
    location: 'Party HQ',
  },
  {
    id: '2',
    category: 'Rally',
    categoryColor: 'bg-red-100 text-red-800',
    title: 'Democracy Protection Rally',
    date: 'Every Saturday',
    time: '14:00 - 18:00',
    location: 'Gwanghwamun Square',
  },
  {
    id: '3',
    category: 'Meeting',
    categoryColor: 'bg-purple-100 text-purple-800',
    title: 'Supreme Council',
    date: 'Every Monday',
    time: '10:00 - 12:00',
    location: 'Party HQ',
  },
  {
    id: '4',
    category: 'Volunteer',
    categoryColor: 'bg-green-100 text-green-800',
    title: 'Community Service',
    date: 'Bi-weekly Sunday',
    time: '09:00 - 13:00',
    location: 'Various locations',
  }
]

export default function SchedulePageEn() {
  return (
    <div>
      {/* Hero */}
      <section 
        className="relative h-[50vh] flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: "url('/images/night-pic.jpg')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20"></div>
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg">Schedule</h1>
          <p className="text-xl text-gray-200 drop-shadow">Activities with Freedom &amp; Innovation</p>
        </div>
      </section>

      <main className="relative z-10 bg-white">
        <section className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Regular Schedule</h2>
              <p className="text-gray-600">Our regular activities and events</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {schedules.map((schedule) => (
                <div key={schedule.id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <span className={`${schedule.categoryColor} px-3 py-1 rounded-full text-sm font-medium`}>
                      {schedule.category}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{schedule.title}</h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center">
                      <i className="fas fa-calendar w-5 mr-2 text-primary"></i>
                      {schedule.date}
                    </div>
                    <div className="flex items-center">
                      <i className="fas fa-clock w-5 mr-2 text-primary"></i>
                      {schedule.time}
                    </div>
                    <div className="flex items-center">
                      <i className="fas fa-map-marker-alt w-5 mr-2 text-primary"></i>
                      {schedule.location}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-primary">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-6">Join Us</h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="https://www.ihappynanum.com/Nanum/api/screen/F7FCRIO2E3"
                target="_blank" rel="noopener noreferrer"
                className="px-8 py-3 bg-white text-primary font-bold rounded-lg hover:bg-gray-100 transition-colors"
              >
                Join Party
              </a>
              <Link 
                href="/en/about/location"
                className="px-8 py-3 border-2 border-white text-white font-bold rounded-lg hover:bg-white hover:text-primary transition-colors"
              >
                Location
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
