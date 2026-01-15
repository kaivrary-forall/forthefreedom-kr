import type { Metadata } from 'next'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'CI | 자유와혁신',
  description: '자유와혁신 CI(Corporate Identity). 당 로고, 색상, 사용 가이드라인.',
  openGraph: {
    title: 'CI | 자유와혁신',
    description: '자유와혁신 CI',
    url: 'https://forthefreedom.kr/about/ci',
  },
}

export default function CIPage() {
  return (
    <div>
      <main className="bg-white">
        <section className="py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">자유와혁신 CI</h1>
              <p className="text-lg text-gray-600">
                자유와혁신의 공식 CI(Corporate Identity)입니다
              </p>
            </div>

            {/* 로고 */}
            <div className="mb-16">
              <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">로고</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-white border-2 border-gray-100 rounded-2xl p-8 text-center">
                  <div className="bg-gray-50 rounded-xl p-8 mb-6">
                    <Image
                      src="/images/logo.png"
                      alt="자유와혁신 로고"
                      width={200}
                      height={200}
                      className="mx-auto"
                    />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">기본 로고</h3>
                  <p className="text-sm text-gray-600">흰색 배경에서 사용</p>
                </div>
                <div className="bg-primary rounded-2xl p-8 text-center">
                  <div className="bg-white/10 rounded-xl p-8 mb-6">
                    <Image
                      src="/images/logo.png"
                      alt="자유와혁신 로고"
                      width={200}
                      height={200}
                      className="mx-auto"
                    />
                  </div>
                  <h3 className="font-bold text-white mb-2">어두운 배경</h3>
                  <p className="text-sm text-red-100">어두운 배경에서 사용</p>
                </div>
              </div>
            </div>

            {/* 색상 */}
            <div className="mb-16">
              <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">브랜드 색상</h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white border-2 border-gray-100 rounded-2xl p-6 text-center">
                  <div className="w-24 h-24 bg-primary rounded-full mx-auto mb-4"></div>
                  <h3 className="font-bold text-gray-900 mb-2">Primary Red</h3>
                  <p className="text-sm text-gray-600 font-mono">#8B1538</p>
                </div>
                <div className="bg-white border-2 border-gray-100 rounded-2xl p-6 text-center">
                  <div className="w-24 h-24 bg-blue-600 rounded-full mx-auto mb-4"></div>
                  <h3 className="font-bold text-gray-900 mb-2">Blue</h3>
                  <p className="text-sm text-gray-600 font-mono">#2563EB</p>
                </div>
                <div className="bg-white border-2 border-gray-100 rounded-2xl p-6 text-center">
                  <div className="w-24 h-24 bg-gray-900 rounded-full mx-auto mb-4"></div>
                  <h3 className="font-bold text-gray-900 mb-2">Black</h3>
                  <p className="text-sm text-gray-600 font-mono">#111827</p>
                </div>
              </div>
            </div>

            {/* 다운로드 */}
            <div className="bg-gray-50 rounded-2xl p-8 text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">CI 다운로드</h2>
              <p className="text-gray-600 mb-6">
                자유와혁신 CI 파일을 다운로드하실 수 있습니다
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="/images/logo.png"
                  download
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-colors"
                >
                  <i className="fas fa-download"></i>
                  PNG 다운로드
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
