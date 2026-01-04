import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '당헌당규 | 자유와혁신',
  description: '자유와혁신 당헌, 당규, 강령 문서를 확인하고 다운로드하세요.',
}

// TODO: API 연동 후 실제 데이터로 교체
const constitutionDocs: { id: number; title: string; date: string; fileType: string; fileUrl: string }[] = []

export default function PartyConstitutionPage() {
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
              <li className="text-gray-900">당헌당규</li>
            </ol>
          </nav>
        </div>
      </section>

      <main className="bg-white">
        <section className="py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* 페이지 헤더 - 운영 사이트와 동일 */}
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">당헌당규</h1>
              <p className="text-xl text-gray-600">자유와혁신의 강령, 당헌, 당규를 확인하세요</p>
            </div>

            {/* 강령·당헌·당규 페이지 안내 */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
              <p className="text-sm text-yellow-800">
                <i className="fas fa-info-circle mr-2"></i>
                당헌·당규 전문은 <Link href="/about/principles" className="text-primary underline font-medium">강령·당헌·당규 페이지</Link>에서도 확인하실 수 있습니다.
              </p>
            </div>

            {/* 자료 목록 또는 빈 상태 */}
            {constitutionDocs.length > 0 ? (
              <div className="space-y-4">
                {constitutionDocs.map((item) => (
                  <div key={item.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-all hover:-translate-y-0.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                          <i className="fas fa-balance-scale text-red-600 text-xl"></i>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{item.title}</h3>
                          <p className="text-sm text-gray-500">{item.date}</p>
                        </div>
                      </div>
                      <a 
                        href={item.fileUrl}
                        target="_blank" rel="noopener noreferrer"
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                      >
                        <i className="fas fa-download mr-2"></i>다운로드
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* 빈 상태 - 운영 사이트와 동일 */
              <div className="text-center py-16">
                <div className="max-w-md mx-auto">
                  <i className="fas fa-balance-scale text-gray-400 text-6xl mb-6"></i>
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">당헌당규 파일이 없습니다</h3>
                  <p className="text-gray-500 mb-6">당헌·당규 전문은 아래 페이지에서 확인하실 수 있습니다.</p>
                  <Link 
                    href="/about/principles"
                    className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                  >
                    <i className="fas fa-book mr-2"></i>
                    강령·당헌·당규 보기
                  </Link>
                </div>
              </div>
            )}

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
