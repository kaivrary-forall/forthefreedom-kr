import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '후원 방법 안내 | 자유와혁신',
  description: '자유와혁신 후원 방법 안내. 계좌이체, 정기후원 방법을 확인하세요.',
}

export default function SupportGuidePage() {
  return (
    <div>
      {/* 히어로 */}
      <section 
        className="relative h-[40vh] flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: "url('/images/flag-pic.jpg')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20"></div>
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg">후원 방법 안내</h1>
        </div>
      </section>

      <main className="relative z-10 bg-white">
        <section className="py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* 후원 방법 1: 계좌이체 */}
            <div className="mb-12">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold text-xl">1</div>
                <h2 className="text-2xl font-bold text-gray-900">계좌이체 후원</h2>
              </div>
              <div className="bg-gray-50 rounded-xl p-6 ml-16">
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <span className="font-semibold text-gray-700 w-20">은행</span>
                    <span className="text-gray-900">농협은행</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-semibold text-gray-700 w-20">계좌번호</span>
                    <span className="text-primary font-mono font-bold">301-0372-2432-31</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-semibold text-gray-700 w-20">예금주</span>
                    <span className="text-gray-900">자유와혁신중앙당후원회</span>
                  </div>
                </div>
                <p className="mt-4 text-sm text-gray-600">
                  * 입금자명을 실명으로 입금해 주세요
                </p>
              </div>
            </div>

            {/* 후원 방법 2: 정기후원 */}
            <div className="mb-12">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold text-xl">2</div>
                <h2 className="text-2xl font-bold text-gray-900">정기후원</h2>
              </div>
              <div className="bg-gray-50 rounded-xl p-6 ml-16">
                <p className="text-gray-700 mb-4">
                  매월 일정 금액을 자동으로 후원하실 수 있습니다.
                </p>
                <p className="text-sm text-gray-600">
                  정기후원 신청은 중앙당 사무처로 문의해 주세요.<br />
                  전화: 02-2634-2023
                </p>
              </div>
            </div>

            {/* 네비게이션 */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8 border-t">
              <Link 
                href="/support"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                <i className="fas fa-arrow-left"></i>
                후원 안내로 돌아가기
              </Link>
              <Link 
                href="/support/receipt"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-colors"
              >
                영수증 신청
                <i className="fas fa-arrow-right"></i>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
