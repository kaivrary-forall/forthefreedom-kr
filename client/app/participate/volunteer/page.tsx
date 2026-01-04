import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '자원봉사 안내 | 자유와혁신',
  description: '자유와혁신 자원봉사 안내. 자유행동과 함께 다양한 봉사활동에 참여하세요.',
}

export default function VolunteerPage() {
  return (
    <div>
      {/* 히어로 */}
      <section 
        className="relative h-[50vh] flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: "url('/images/activity.jpg')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20"></div>
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg">자원봉사 안내</h1>
          <p className="text-xl text-gray-200 drop-shadow">자유행동과 함께하세요</p>
        </div>
      </section>

      <main className="relative z-10 bg-white">
        {/* 자유행동 소개 */}
        <section className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="fas fa-hands-helping text-white text-3xl"></i>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">자유행동</h2>
              <p className="text-lg text-gray-600">
                자유행동은 자유와혁신의 자원봉사단으로,<br />
                지역사회 봉사와 당 활동을 지원합니다
              </p>
            </div>
          </div>
        </section>

        {/* 활동 내용 */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">주요 활동</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <i className="fas fa-hand-holding-heart text-blue-600 text-xl"></i>
                </div>
                <h4 className="font-bold text-gray-900 mb-2">지역사회 봉사</h4>
                <p className="text-gray-600 text-sm">
                  어르신 돌봄, 환경정화, 이웃돕기 등 지역사회 봉사활동
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <i className="fas fa-bullhorn text-green-600 text-xl"></i>
                </div>
                <h4 className="font-bold text-gray-900 mb-2">캠페인 활동</h4>
                <p className="text-gray-600 text-sm">
                  자유민주주의 수호, 부정선거 척결 캠페인 참여
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <i className="fas fa-calendar-alt text-purple-600 text-xl"></i>
                </div>
                <h4 className="font-bold text-gray-900 mb-2">행사 지원</h4>
                <p className="text-gray-600 text-sm">
                  당 주최 행사, 집회, 토론회 등 행사 운영 지원
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <i className="fas fa-vote-yea text-orange-600 text-xl"></i>
                </div>
                <h4 className="font-bold text-gray-900 mb-2">선거 캠프</h4>
                <p className="text-gray-600 text-sm">
                  선거 기간 캠프 활동, 유세 지원, 참관인 활동
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 참여 방법 */}
        <section className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">참여 방법</h3>
            <p className="text-gray-600 mb-8">
              자유행동 참여를 원하시면 당원가입 후 중앙당 조직국으로 문의해 주세요
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="https://www.ihappynanum.com/Nanum/api/screen/F7FCRIO2E3"
                target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-white rounded-xl font-bold hover:bg-primary-dark transition-colors"
              >
                <i className="fas fa-user-plus"></i>
                당원가입
              </a>
              <a 
                href="tel:02-2634-2023"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-primary text-primary rounded-xl font-bold hover:bg-primary hover:text-white transition-colors"
              >
                <i className="fas fa-phone"></i>
                문의하기
              </a>
            </div>
          </div>
        </section>

        {/* 네비게이션 */}
        <section className="py-8 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <Link 
              href="/participate"
              className="inline-flex items-center gap-2 text-primary font-semibold hover:underline"
            >
              <i className="fas fa-arrow-left"></i>
              참여하기로 돌아가기
            </Link>
          </div>
        </section>
      </main>
    </div>
  )
}
