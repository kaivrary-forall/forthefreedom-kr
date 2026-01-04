import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '다운로드 | 자유와혁신',
  description: '자유와혁신 다운로드 센터. 당원 가입 신청서, 규약, 법령 등 각종 문서를 다운로드하세요.',
}

// 운영 사이트 downloads.html에서 추출한 실제 데이터
const formsDocs = [
  { id: 1, title: '당원 가입 신청서', desc: '당원 가입을 위한 신청서 양식', icon: 'fa-user-plus', size: '128KB' },
  { id: 2, title: '자원봉사 신청서', desc: '당 활동 자원봉사 신청서', icon: 'fa-handshake', size: '94KB' },
  { id: 3, title: '당비 자동이체 신청서', desc: '당비 자동이체 신청을 위한 양식', icon: 'fa-credit-card', size: '76KB' },
]

const rulesDocs = [
  { id: 4, title: '당 규약', desc: '자유와혁신 당 규약 전문', icon: 'fa-gavel', size: '542KB' },
  { id: 5, title: '정치자금법', desc: '정치자금에 관한 법률', icon: 'fa-balance-scale', size: '312KB' },
  { id: 6, title: '공직선거법', desc: '공직선거에 관한 법률', icon: 'fa-landmark', size: '856KB' },
]

const mediaDocs = [
  { id: 7, title: '당 로고', desc: '공식 로고 이미지 파일', icon: 'fa-image', type: 'PNG', file: '/images/logo.png' },
]

export default function DownloadsPage() {
  return (
    <div>
      {/* 브레드크럼 - 운영 사이트와 동일 */}
      <section className="bg-gray-50 py-8 mt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="text-sm">
            <ol className="list-none p-0 inline-flex space-x-2">
              <li className="flex items-center">
                <Link href="/" className="text-gray-500 hover:text-primary">홈</Link>
                <i className="fas fa-chevron-right mx-2 text-gray-400"></i>
              </li>
              <li className="flex items-center">
                <Link href="/resources" className="text-gray-500 hover:text-primary">자료실</Link>
                <i className="fas fa-chevron-right mx-2 text-gray-400"></i>
              </li>
              <li className="text-gray-900">다운로드</li>
            </ol>
          </nav>
        </div>
      </section>

      <main className="bg-white">
        <section className="py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* 페이지 헤더 - 운영 사이트와 동일 */}
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">다운로드 센터</h2>
              <p className="text-xl text-gray-600 max-w-6xl mx-auto">
                당원 가입 신청서, 규약, 법령 등 각종 문서를 다운로드하세요.
              </p>
            </div>

            {/* 신청서 및 양식 */}
            <div className="mb-16">
              <h3 className="text-2xl font-bold text-gray-900 mb-8">신청서 및 양식</h3>
              <div className="space-y-4">
                {formsDocs.map((doc) => (
                  <div key={doc.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                          <i className={`fas ${doc.icon} text-red-600 text-xl`}></i>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{doc.title}</h4>
                          <p className="text-gray-600 text-sm">{doc.desc}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-sm">PDF</span>
                        <span className="text-gray-500 text-sm">{doc.size}</span>
                        <button className="bg-gray-300 text-gray-500 px-4 py-2 rounded-lg cursor-not-allowed" disabled>
                          준비중
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 규약 및 법령 */}
            <div className="mb-16">
              <h3 className="text-2xl font-bold text-gray-900 mb-8">규약 및 법령</h3>
              <div className="space-y-4">
                {rulesDocs.map((doc) => (
                  <div key={doc.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                          <i className={`fas ${doc.icon} text-red-600 text-xl`}></i>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{doc.title}</h4>
                          <p className="text-gray-600 text-sm">{doc.desc}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-sm">PDF</span>
                        <span className="text-gray-500 text-sm">{doc.size}</span>
                        <button className="bg-gray-300 text-gray-500 px-4 py-2 rounded-lg cursor-not-allowed" disabled>
                          준비중
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 미디어 자료 */}
            <div className="mb-16">
              <h3 className="text-2xl font-bold text-gray-900 mb-8">미디어 자료</h3>
              <div className="space-y-4">
                {mediaDocs.map((doc) => (
                  <div key={doc.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                          <i className={`fas ${doc.icon} text-green-600 text-xl`}></i>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{doc.title}</h4>
                          <p className="text-gray-600 text-sm">{doc.desc}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="bg-green-100 text-green-600 px-2 py-1 rounded text-sm">{doc.type}</span>
                        <a 
                          href={doc.file}
                          download
                          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                        >
                          다운로드
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 자료실로 돌아가기 */}
            <div className="mt-12 text-center">
              <Link href="/resources" className="text-primary hover:underline">
                <i className="fas fa-arrow-left mr-2"></i>자료실로 돌아가기
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
