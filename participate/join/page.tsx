import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '당원가입 안내 | 자유와혁신',
  description: '자유와혁신 당원가입 안내. 온라인, 오프라인 가입 방법과 당원 자격을 확인하세요.',
  openGraph: {
    title: '당원가입 안내 | 자유와혁신',
    description: '자유와혁신 당원가입 안내',
    url: 'https://forthefreedom.kr/participate/join',
  },
}

export default function JoinPage() {
  return (
    <div>
      {/* 히어로 */}
      <section 
        className="relative h-[50vh] flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: "url('/images/flag-pic.jpg')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20"></div>
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg">당원가입 안내</h1>
          <p className="text-xl text-gray-200 drop-shadow">자유와혁신의 당원이 되어주세요</p>
        </div>
      </section>

      <main className="relative z-10 bg-white">
        {/* 온라인 가입 */}
        <section className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-2xl p-12 text-center border-2 border-red-200">
              <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-8">
                <i className="fas fa-laptop text-primary text-4xl"></i>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">온라인 당원가입</h2>
              <p className="text-xl text-gray-700 mb-8">
                간편가입 시스템을 통해 빠르고 안전하게 당원가입을 진행할 수 있습니다
              </p>
              <a 
                href="https://www.ihappynanum.com/Nanum/api/screen/F7FCRIO2E3"
                target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-primary text-white px-12 py-5 rounded-xl font-bold text-xl hover:bg-primary-dark transition-colors"
              >
                <i className="fas fa-user-plus"></i>
                온라인 당원가입
              </a>
              <p className="text-gray-600 mt-6">
                클릭 후 본인인증을 진행해 주세요
              </p>
            </div>
          </div>
        </section>

        {/* 가입 자격 */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">가입 자격</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <i className="fas fa-check text-green-600 text-xl"></i>
                  </div>
                  <h3 className="font-bold text-gray-900">가입 가능</h3>
                </div>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center gap-2">
                    <i className="fas fa-circle text-xs text-green-500"></i>
                    대한민국 국민
                  </li>
                  <li className="flex items-center gap-2">
                    <i className="fas fa-circle text-xs text-green-500"></i>
                    18세 이상 (선거권 보유자)
                  </li>
                  <li className="flex items-center gap-2">
                    <i className="fas fa-circle text-xs text-green-500"></i>
                    당의 정강정책에 동의하는 분
                  </li>
                </ul>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                    <i className="fas fa-times text-red-600 text-xl"></i>
                  </div>
                  <h3 className="font-bold text-gray-900">가입 제한</h3>
                </div>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center gap-2">
                    <i className="fas fa-circle text-xs text-red-500"></i>
                    타 정당 당원
                  </li>
                  <li className="flex items-center gap-2">
                    <i className="fas fa-circle text-xs text-red-500"></i>
                    공무원 (일부 제외)
                  </li>
                  <li className="flex items-center gap-2">
                    <i className="fas fa-circle text-xs text-red-500"></i>
                    법률에 의해 제한된 자
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* 오프라인 가입 */}
        <section className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">오프라인 가입</h2>
            <div className="bg-gray-50 rounded-xl p-8">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">1</div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">입당원서 작성</h3>
                    <p className="text-gray-600">중앙당 또는 시도당에서 입당원서를 작성합니다</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">2</div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">신분증 지참</h3>
                    <p className="text-gray-600">본인 확인을 위해 신분증을 지참해 주세요</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">3</div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">가입 완료</h3>
                    <p className="text-gray-600">심사 후 당원증이 발급됩니다</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 p-4 bg-white rounded-lg border">
                <p className="text-gray-700">
                  <strong>문의:</strong> 중앙당 조직국 
                  <a href="tel:02-2634-2023" className="text-primary ml-2">02-2634-2023</a>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 네비게이션 */}
        <section className="py-8 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/participate"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                <i className="fas fa-arrow-left"></i>
                참여하기로 돌아가기
              </Link>
              <Link 
                href="/participate/faq"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-primary text-primary rounded-lg font-semibold hover:bg-primary hover:text-white transition-colors"
              >
                자주 묻는 질문
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
