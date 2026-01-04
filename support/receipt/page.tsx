import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '영수증 신청 | 자유와혁신',
  description: '자유와혁신 후원금 영수증 신청 안내. 연말정산 세액공제를 위한 영수증 발급.',
}

export default function SupportReceiptPage() {
  return (
    <div>
      {/* 히어로 */}
      <section 
        className="relative h-[40vh] flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: "url('/images/flag-pic.jpg')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20"></div>
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg">영수증 신청</h1>
        </div>
      </section>

      <main className="relative z-10 bg-white">
        <section className="py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

            {/* 세액공제 안내 */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">세액공제 혜택</h2>
              <div className="bg-gray-50 rounded-xl p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-white rounded-lg border">
                    <span className="text-gray-700">10만원 이하</span>
                    <span className="font-bold text-primary">전액 세액공제 (100%)</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-white rounded-lg border">
                    <span className="text-gray-700">10만원 초과분</span>
                    <span className="font-bold text-primary">15% 세액공제</span>
                  </div>
                </div>
                <p className="mt-4 text-sm text-gray-600">
                  예) 30만원 후원 시: 10만원(전액) + 20만원×15% = 13만원 세액공제
                </p>
              </div>
            </div>

            {/* 영수증 신청 방법 */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">온라인 영수증 신청</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <a 
                  href="https://form.naver.com/response/ia2iK2yzR1NT3vSYaqjPjw"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white border-2 border-primary rounded-xl p-6 text-center hover:bg-primary/5 transition-colors group"
                >
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                    <i className="fas fa-file-invoice text-primary text-2xl"></i>
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">자유와혁신 중앙당 후원회</h3>
                  <p className="text-sm text-gray-600 mb-4">영수증 발급 신청</p>
                  <span className="inline-flex items-center gap-2 text-primary font-semibold">
                    신청하기 <i className="fas fa-arrow-right"></i>
                  </span>
                </a>

                <a 
                  href="https://form.naver.com/response/gjYSKrmFAFnfLgz1nvYsHw"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white border-2 border-primary rounded-xl p-6 text-center hover:bg-primary/5 transition-colors group"
                >
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                    <i className="fas fa-user-tie text-primary text-2xl"></i>
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">대통령후보 황교안 후원회</h3>
                  <p className="text-sm text-gray-600 mb-4">영수증 발급 신청</p>
                  <span className="inline-flex items-center gap-2 text-primary font-semibold">
                    신청하기 <i className="fas fa-arrow-right"></i>
                  </span>
                </a>
              </div>
            </div>

            {/* 기타 신청 방법 */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">기타 신청 방법</h2>
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-xl p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                      <i className="fas fa-phone"></i>
                    </div>
                    <h3 className="font-bold text-gray-900">전화 신청</h3>
                  </div>
                  <p className="text-gray-700 ml-14">
                    중앙당 사무처: <a href="tel:02-2634-2023" className="text-primary font-semibold">02-2634-2023</a>
                  </p>
                </div>
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
                href="/support/guide"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-primary text-primary rounded-lg font-semibold hover:bg-primary hover:text-white transition-colors"
              >
                후원 방법 안내
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
