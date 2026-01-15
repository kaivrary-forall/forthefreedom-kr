import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '창당 스토리 | 자유와혁신',
  description: '자유와혁신 창당 스토리. 자유민주주의 체제 수호를 위해 탄생한 국민의 정당.',
  openGraph: {
    title: '창당 스토리 | 자유와혁신',
    description: '자유와혁신 창당 스토리',
    url: 'https://forthefreedom.kr/about/founding',
  },
}

export default function FoundingPage() {
  return (
    <div>
      <main className="bg-white">
        <section className="py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-6">창당 스토리</h1>
                <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                  대한민국은 현재 미완성된 국정감시와 반국가세력의 준동, 선거 조작 의혹 등으로 위기에 처해 있습니다.
                </p>
                <div className="space-y-4 mb-8">
                  <div className="flex items-start">
                    <i className="fas fa-exclamation-triangle text-primary mr-3 mt-1"></i>
                    <span className="text-gray-700">2020년 4.15 총선 이후 거듭된 각종 조작 의혹</span>
                  </div>
                  <div className="flex items-start">
                    <i className="fas fa-exclamation-triangle text-primary mr-3 mt-1"></i>
                    <span className="text-gray-700">좌파 세력과 결탁한 반국가세력의 선거 조작 시도</span>
                  </div>
                  <div className="flex items-start">
                    <i className="fas fa-exclamation-triangle text-primary mr-3 mt-1"></i>
                    <span className="text-gray-700">자유민주주의 체제의 심각한 위기</span>
                  </div>
                </div>
                <p className="text-lg text-primary font-semibold">
                  분노한 애국 세력이 이 거악과 체제 전쟁을 막기 위해 자유와혁신을 창당했습니다.
                </p>
              </div>
              <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-2xl p-8 text-center">
                <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                  <i className="fas fa-flag text-white text-4xl"></i>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">2024년 창당</h3>
                <p className="text-gray-600">
                  자유민주주의 체제를 수호하고<br />
                  혁신적 미래를 선도하는<br />
                  국민의 정당
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 창당 이념 */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">창당 이념</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-2xl shadow-sm">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-6">
                  <i className="fas fa-dove text-white text-2xl"></i>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">자유</h3>
                <p className="text-gray-600 leading-relaxed">
                  대한민국 건국 당시, 자유민주주의를 채택하여 세계 자유진영과 함께 한 이승만 대통령의 정신을 계승합니다.
                </p>
              </div>
              <div className="bg-white p-8 rounded-2xl shadow-sm">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-6">
                  <i className="fas fa-rocket text-white text-2xl"></i>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">혁신</h3>
                <p className="text-gray-600 leading-relaxed">
                  오늘날 대한민국이 부국강병 반열에 오를 수 있도록 산업화의 토대를 마련한 박정희 대통령의 정신을 계승합니다.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
