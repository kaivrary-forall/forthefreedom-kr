import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '후원 안내 | 자유와혁신',
  description: '자유와혁신 공식 후원 안내. 자유민주주의 수호 활동을 후원해주세요. 공식 후원계좌, 정치자금법 안내.',
  keywords: '자유와혁신 후원, 황교안 후원, 정치자금, 후원계좌',
  openGraph: {
    title: '후원 안내 | 자유와혁신',
    description: '자유와혁신 공식 후원 안내',
    url: 'https://forthefreedom.kr/support',
    images: ['/images/flag-pic.jpg'],
  },
}

export default function SupportPage() {
  return (
    <div>
      {/* 히어로 */}
      <section 
        className="relative h-[50vh] flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: "url('/images/flag-pic.jpg')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20"></div>
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg">후원 안내</h1>
          <p className="text-xl text-gray-200 drop-shadow">자유민주주의 수호를 위한 여러분의 참여</p>
        </div>
      </section>

      <main className="relative z-10 bg-white">
        {/* 공식 후원 계좌 */}
        <section className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">공식 후원 계좌</h2>
              <p className="text-lg text-gray-600">
                자유민주주의 체제 수호와 혁신적 정치를 위한 후원에 참여해 주세요
              </p>
            </div>

            {/* 계좌 정보 카드 */}
            <div className="bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-200 rounded-2xl p-8 md:p-12 text-center mb-12">
              <div className="mb-8">
                <i className="fas fa-university text-primary text-4xl mb-4"></i>
                <h3 className="text-2xl font-bold text-gray-900">공식 후원 계좌</h3>
              </div>
              
              <div className="bg-white rounded-xl p-8 shadow-sm border border-red-200 mb-8">
                <div className="space-y-6">
                  <div>
                    <p className="text-gray-600 mb-2">은행명</p>
                    <p className="text-2xl font-bold text-gray-900">농협은행</p>
                  </div>
                  
                  <div>
                    <p className="text-gray-600 mb-2">계좌번호</p>
                    <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                      <p className="text-2xl md:text-3xl font-bold text-primary font-mono">301-0372-2432-31</p>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-gray-600 mb-2">예금주</p>
                    <p className="text-xl font-bold text-gray-900">자유와혁신중앙당후원회</p>
                  </div>
                </div>
              </div>

              <p className="text-sm text-gray-600">
                * 입금 시 실명으로 입금해 주세요
              </p>
            </div>


          </div>
        </section>

        {/* 후원 안내 */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">후원 안내</h3>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <i className="fas fa-file-invoice text-blue-600 text-xl"></i>
                  </div>
                  <h4 className="text-lg font-bold text-gray-900">세액공제 혜택</h4>
                </div>
                <p className="text-gray-600 text-sm">
                  정치자금법에 따라 10만원까지 전액 세액공제, 10만원 초과분은 15% 세액공제 혜택을 받으실 수 있습니다.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <i className="fas fa-user-check text-purple-600 text-xl"></i>
                  </div>
                  <h4 className="text-lg font-bold text-gray-900">후원 자격</h4>
                </div>
                <p className="text-gray-600 text-sm">
                  대한민국 국민이면 누구나 후원하실 수 있습니다. (외국인, 법인 후원 불가)
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <i className="fas fa-coins text-orange-600 text-xl"></i>
                  </div>
                  <h4 className="text-lg font-bold text-gray-900">후원 한도</h4>
                </div>
                <p className="text-gray-600 text-sm">
                  중앙당후원회 기부 한도는 연간 500만원입니다. (정치자금법 제11조, 1인당 연간 총 후원 한도 2,000만원)
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 관련 링크 */}
        <section className="py-12 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/support/guide"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-primary text-primary rounded-lg font-semibold hover:bg-primary hover:text-white transition-colors"
              >
                <i className="fas fa-book"></i>
                후원 방법 안내
              </Link>
              <Link 
                href="/support/receipt"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-primary text-primary rounded-lg font-semibold hover:bg-primary hover:text-white transition-colors"
              >
                <i className="fas fa-file-alt"></i>
                영수증 신청
              </Link>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-primary">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-6">함께해 주셔서 감사합니다</h2>
            <p className="text-xl text-red-100 mb-8">
              여러분의 후원은 대한민국의 자유민주주의를 지키는 힘이 됩니다
            </p>
            <a 
              href="https://www.ihappynanum.com/Nanum/api/screen/F7FCRIO2E3"
              target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-3 bg-white text-primary font-bold rounded-lg hover:bg-gray-100 transition-colors"
            >
              당원가입
            </a>
          </div>
        </section>
      </main>
    </div>
  )
}
