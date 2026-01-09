import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '찾아오시는 길 | 자유와혁신',
  description: '자유와혁신 중앙당 위치 안내. 서울 용산구 청파로45길 19, 301호 (복조빌딩)',
  openGraph: {
    title: '찾아오시는 길 | 자유와혁신',
    description: '자유와혁신 중앙당 위치 안내',
    url: 'https://forthefreedom.kr/about/location',
  },
}

export default function LocationPage() {
  return (
    <div>
      <main className="relative z-10 bg-white">
        {/* 지도 섹션 */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">찾아오시는 길</h2>
              <p className="text-xl text-gray-600 max-w-6xl mx-auto">
                다양한 교통수단으로 편리하게 방문하실 수 있습니다.
              </p>
            </div>

            {/* 주소 카드 */}
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-12 border-l-4 border-primary">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div>
                  <div className="flex items-center mb-3">
                    <div className="w-3 h-3 bg-primary rounded-full mr-3 animate-pulse"></div>
                    <h3 className="text-2xl font-bold text-gray-900">자유와혁신 중앙당</h3>
                  </div>
                  <p className="text-lg text-gray-700 mb-2">서울 용산구 청파로45길 19, 301호</p>
                  <p className="text-gray-500">(복조빌딩)</p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <a 
                    href="tel:02-2634-2023" 
                    className="inline-flex items-center px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-colors"
                  >
                    <i className="fas fa-phone mr-2"></i> 02-2634-2023
                  </a>
                  <a 
                    href="mailto:forthefreedom2025@naver.com" 
                    className="inline-flex items-center px-6 py-3 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <i className="fas fa-envelope mr-2"></i> 이메일
                  </a>
                </div>
              </div>
            </div>

            {/* 지도 (iframe) */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-12">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3163.5!2d126.9699!3d37.5463!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x357ca257a50a1b1b%3A0x1234567890!2z7ISc7Jq4IOyaqeywnOq1rCDssq3quqzroZw0Neq4uCAxOQ!5e0!3m2!1sko!2skr!4v1234567890"
                width="100%" 
                height="450" 
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full"
              ></iframe>
            </div>

            {/* 교통편 안내 */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* 지하철 */}
              <div className="bg-blue-50 rounded-xl p-6 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-subway text-blue-600 text-2xl"></i>
                </div>
                <h3 className="font-bold text-gray-900 mb-3">지하철</h3>
                <div className="text-sm text-gray-700 space-y-1">
                  <p><span className="font-semibold">4호선</span> 숙대입구역 8번 출구</p>
                  <p><span className="font-semibold">1호선</span> 남영역 1번 / 서울역 13번 출구</p>
                  <p><span className="font-semibold">6호선</span> 삼각지역 10번 출구</p>
                  <p className="text-xs text-gray-500 mt-2">도보 5-10분 거리</p>
                </div>
              </div>

              {/* 버스 */}
              <div className="bg-green-50 rounded-xl p-6 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-bus text-green-600 text-2xl"></i>
                </div>
                <h3 className="font-bold text-gray-900 mb-3">버스</h3>
                <div className="text-sm text-gray-700 space-y-1">
                  <p><span className="font-semibold">간선</span> 405, 502, 503</p>
                  <p><span className="font-semibold">지선</span> 7011, 7021, 7737</p>
                  <p className="text-xs text-gray-500 mt-2">청파로 정류장 하차</p>
                </div>
              </div>

              {/* 자가용 */}
              <div className="bg-purple-50 rounded-xl p-6 text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-car text-purple-600 text-2xl"></i>
                </div>
                <h3 className="font-bold text-gray-900 mb-3">자가용</h3>
                <div className="text-sm text-gray-700 space-y-1">
                  <p className="text-xs text-gray-500">인근 유료주차장 이용</p>
                  <p>청파동1마을공원공영주차장</p>
                  <p>청파동청사 공영주차장</p>
                </div>
              </div>

              {/* 택시 */}
              <div className="bg-yellow-50 rounded-xl p-6 text-center">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-taxi text-yellow-600 text-2xl"></i>
                </div>
                <h3 className="font-bold text-gray-900 mb-3">택시</h3>
                <div className="text-sm text-gray-700 space-y-1">
                  <p>서울역에서 약 10분</p>
                  <p className="text-xs text-gray-500 mt-2">&quot;용산구 청파로45길 19&quot; 안내</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-primary">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-6">자유와혁신을 방문해주세요</h2>
            <p className="text-xl text-red-100 mb-8">
              당원가입, 후원, 자원봉사 등 다양한 참여를 환영합니다
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
                href="/support"
                className="px-8 py-3 border-2 border-white text-white font-bold rounded-lg hover:bg-white hover:text-primary transition-colors"
              >
                후원하기
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
