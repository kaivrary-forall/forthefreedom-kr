import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'FAIN | 자유와혁신',
  description: '자유와혁신 FAIN - 당원 전용 콘텐츠',
  robots: 'noindex, nofollow',
}

export default function FainPage() {
  return (
    <div>
      {/* 히어로 */}
      <section 
        className="relative h-[40vh] flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: "url('/images/night-pic.jpg')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20"></div>
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg">FAIN</h1>
          <p className="text-xl text-gray-200 drop-shadow">Freedom And Innovation News</p>
        </div>
      </section>

      <main className="relative z-10 bg-white py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 로그인 필요 안내 */}
          <div className="bg-white rounded-2xl shadow-lg p-12 border border-gray-100 text-center">
            <div className="w-24 h-24 bg-primary/10 rounded-full mx-auto mb-8 flex items-center justify-center">
              <i className="fas fa-lock text-primary text-4xl"></i>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">당원 전용 콘텐츠</h2>
            <p className="text-lg text-gray-600 mb-8">
              FAIN은 당원 전용 뉴스레터 및 콘텐츠입니다.<br />
              로그인 후 이용해 주세요.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="https://www.ihappynanum.com/Nanum/api/screen/F7FCRIO2E3"
                target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-colors"
              >
                <i className="fas fa-user-plus mr-2"></i>당원가입
              </a>
              <Link 
                href="/"
                className="inline-flex items-center justify-center px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors"
              >
                <i className="fas fa-home mr-2"></i>홈으로
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
