import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '로고 | 자유와혁신',
  description: '자유와혁신의 정체성과 가치를 담은 심볼과 로고를 소개합니다.',
  openGraph: {
    title: '로고 | 자유와혁신',
    description: '자유와혁신 로고',
    url: 'https://forthefreedom.kr/about/logo',
  },
}

export default function LogoPage() {
  return (
    <div>
      {/* 히어로 */}
      <section 
        className="relative h-[50vh] flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: "url('/images/night-pic.jpg')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20"></div>
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg">자유와혁신 로고</h1>
          <p className="text-xl text-gray-200 drop-shadow">자유와혁신의 정체성과 가치를 담은 심볼</p>
        </div>
      </section>

      <main className="relative z-10 bg-white">
        {/* 로고 소개 */}
        <section className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">심볼 & 로고</h2>
            
            <div className="grid md:grid-cols-2 gap-12 mb-16">
              {/* 기본 로고 */}
              <div className="bg-gray-50 p-8 rounded-2xl text-center">
                <div className="bg-white p-8 rounded-xl mb-6 shadow-sm">
                  <Image 
                    src="/images/logo.png" 
                    alt="자유와혁신 기본 로고" 
                    width={300}
                    height={128}
                    className="mx-auto h-32 w-auto object-contain"
                  />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-3">기본 로고</h4>
                <p className="text-gray-600">
                  자유와혁신의 기본 로고입니다. 일반적인 용도에 사용됩니다.
                </p>
              </div>
              
              {/* 심볼 로고 */}
              <div className="bg-gray-50 p-8 rounded-2xl text-center">
                <div className="bg-white p-8 rounded-xl mb-6 shadow-sm">
                  <Image 
                    src="/images/logo-symbol.png" 
                    alt="자유와혁신 심볼 로고" 
                    width={128}
                    height={128}
                    className="mx-auto h-32 w-auto object-contain"
                  />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-3">심볼 로고</h4>
                <p className="text-gray-600">
                  자유와혁신의 심볼 로고입니다. 공간이 제한된 경우 사용됩니다.
                </p>
              </div>
            </div>
            
            {/* 로고 의미 */}
            <div className="bg-gradient-to-br from-red-50 to-red-100 p-12 rounded-2xl">
              <h4 className="text-2xl font-bold text-red-900 mb-8 text-center">로고의 상징</h4>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="fas fa-fist-raised text-white text-xl"></i>
                  </div>
                  <h5 className="text-lg font-bold text-red-900 mb-2">자유</h5>
                  <p className="text-gray-700">
                    대한민국의 자유민주주의 수호에 대한 의지를 상징합니다.
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="fas fa-lightbulb text-white text-xl"></i>
                  </div>
                  <h5 className="text-lg font-bold text-red-900 mb-2">혁신</h5>
                  <p className="text-gray-700">
                    새로운 시대를 향한 혁신과 변화의 의지를 표현합니다.
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="fas fa-heart text-white text-xl"></i>
                  </div>
                  <h5 className="text-lg font-bold text-red-900 mb-2">국민</h5>
                  <p className="text-gray-700">
                    국민과 함께하는 정당으로서의 정체성을 담고 있습니다.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 브랜드 컬러 */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">브랜드 컬러</h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-full h-24 bg-primary rounded-xl mb-3"></div>
                <p className="font-semibold text-gray-900">Primary</p>
                <p className="text-sm text-gray-500">#A50034</p>
              </div>
              <div className="text-center">
                <div className="w-full h-24 bg-primary-dark rounded-xl mb-3"></div>
                <p className="font-semibold text-gray-900">Primary Dark</p>
                <p className="text-sm text-gray-500">#8B002C</p>
              </div>
              <div className="text-center">
                <div className="w-full h-24 bg-red-50 rounded-xl mb-3 border border-gray-200"></div>
                <p className="font-semibold text-gray-900">Light</p>
                <p className="text-sm text-gray-500">#FDF2F4</p>
              </div>
              <div className="text-center">
                <div className="w-full h-24 bg-gray-900 rounded-xl mb-3"></div>
                <p className="font-semibold text-gray-900">Dark</p>
                <p className="text-sm text-gray-500">#111827</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-primary">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-6">자유와혁신과 함께하세요</h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="https://www.ihappynanum.com/Nanum/api/screen/F7FCRIO2E3"
                target="_blank" rel="noopener noreferrer"
                className="px-8 py-3 bg-white text-primary font-bold rounded-lg hover:bg-gray-100 transition-colors"
              >
                당원가입
              </a>
              <Link 
                href="/about"
                className="px-8 py-3 border-2 border-white text-white font-bold rounded-lg hover:bg-white hover:text-primary transition-colors"
              >
                당 소개
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
