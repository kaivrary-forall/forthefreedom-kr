import type { Metadata } from 'next'
import Link from 'next/link'
import { schedules } from '@/data/schedule.ko'

export const metadata: Metadata = {
  title: '주요 일정 | 자유와혁신',
  description: '자유와혁신 주요 일정 안내. 당 행사, 교육, 집회 일정을 확인하세요.',
  openGraph: {
    title: '주요 일정 | 자유와혁신',
    description: '자유와혁신 주요 일정 안내',
    url: 'https://forthefreedom.kr/about/schedule',
  },
}

export default function SchedulePage() {
  return (
    <div>
      {/* 히어로 */}
      <section 
        className="relative h-[50vh] flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: "url('/images/night-pic.jpg')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20"></div>
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg">주요 일정</h1>
          <p className="text-xl text-gray-200 drop-shadow">자유와혁신과 함께하는 활동</p>
        </div>
      </section>

      <main className="relative z-10 bg-white">
        {/* 주요 일정 */}
        <section className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">정기 일정</h2>
              <p className="text-gray-600">자유와혁신의 정기적인 활동 일정입니다</p>
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
                  <div className="space-y-2 text-sm text-gray-600 mb-4">
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
                  <p className="text-gray-600 text-sm">{schedule.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 안내 */}
        <section className="py-12 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center flex-shrink-0">
                  <i className="fas fa-info-circle text-white text-xl"></i>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">일정 안내</h3>
                  <p className="text-gray-600 mb-4">
                    상세 일정은 변경될 수 있습니다. 최신 일정은 공지사항을 확인하시거나 
                    당사로 문의해 주시기 바랍니다.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <a 
                      href="tel:02-2634-2023"
                      className="inline-flex items-center text-primary hover:underline"
                    >
                      <i className="fas fa-phone mr-2"></i> 02-2634-2023
                    </a>
                    <a 
                      href="mailto:forthefreedom2025@naver.com"
                      className="inline-flex items-center text-primary hover:underline"
                    >
                      <i className="fas fa-envelope mr-2"></i> 이메일 문의
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-primary">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-6">함께 참여하세요</h2>
            <p className="text-xl text-red-100 mb-8">
              자유와혁신의 다양한 활동에 함께해 주세요
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="https://www.ihappynanum.com/Nanum/api/screen/F7FCRIO2E3"
                target="_blank" rel="noopener noreferrer"
                className="px-8 py-3 bg-white text-primary font-bold rounded-lg hover:bg-gray-100 transition-colors"
              >
                당원가입
              </a>
              <Link 
                href="/about/location"
                className="px-8 py-3 border-2 border-white text-white font-bold rounded-lg hover:bg-white hover:text-primary transition-colors"
              >
                찾아오시는 길
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
