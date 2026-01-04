import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '자료실 | 자유와혁신',
  description: '자유와혁신 자료실. 정책자료, 당헌당규, 선거자료 등 각종 자료를 확인하세요.',
}

const resourceCategories = [
  {
    title: '정책자료',
    icon: 'fa-file-alt',
    href: '/resources/policy-materials',
    description: '7대 핵심 정책과 분야별 세부 정책 자료를 확인하세요',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-100',
    iconBg: 'bg-blue-600',
    btnColor: 'bg-blue-600 hover:bg-blue-700',
    textColor: 'text-blue-600',
  },
  {
    title: '당헌당규',
    icon: 'fa-balance-scale',
    href: '/resources/party-constitution',
    description: '자유와혁신의 강령, 당헌, 당규 등 기본 규정을 확인하세요',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-100',
    iconBg: 'bg-red-600',
    btnColor: 'bg-red-600 hover:bg-red-700',
    textColor: 'text-red-600',
  },
  {
    title: '선거자료',
    icon: 'fa-vote-yea',
    href: '/resources/election-materials',
    description: '선거 관련 공약, 정책 자료, 선거운동 자료를 확인하세요',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-100',
    iconBg: 'bg-purple-600',
    btnColor: 'bg-purple-600 hover:bg-purple-700',
    textColor: 'text-purple-600',
  },
]

export default function ResourcesPage() {
  return (
    <div>
      {/* 브레드크럼 */}
      <section className="bg-gray-50 py-8 mt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="text-sm mb-4">
            <ol className="flex items-center space-x-2">
              <li><Link href="/" className="text-gray-500 hover:text-primary">홈</Link></li>
              <li><i className="fas fa-chevron-right text-gray-400 text-xs mx-2"></i></li>
              <li className="text-gray-900">자료실</li>
            </ol>
          </nav>
          <h1 className="text-3xl font-bold text-gray-900">자료실</h1>
        </div>
      </section>

      <main className="bg-white">
        {/* 자료실 카테고리 - 운영 사이트와 동일 */}
        <section className="py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">자료 카테고리</h2>
              <p className="text-xl text-gray-600 max-w-6xl mx-auto">
                자유와혁신의 다양한 자료를 카테고리별로 확인하세요
              </p>
            </div>
            
            <div className="grid lg:grid-cols-3 gap-8">
              {resourceCategories.map((cat) => (
                <div 
                  key={cat.title}
                  className={`${cat.bgColor} border ${cat.borderColor} rounded-lg p-8 text-center hover:shadow-lg transition-shadow`}
                >
                  <div className={`w-16 h-16 ${cat.iconBg} rounded-full flex items-center justify-center mx-auto mb-6`}>
                    <i className={`fas ${cat.icon} text-white text-2xl`}></i>
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">{cat.title}</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {cat.description}
                  </p>
                  <Link 
                    href={cat.href}
                    className={`inline-flex items-center justify-center px-6 py-3 ${cat.btnColor} text-white font-medium rounded-lg transition-colors`}
                  >
                    <span>바로가기</span>
                    <i className="fas fa-arrow-right ml-2"></i>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 다운로드 섹션 */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">다운로드</h2>
              <p className="text-gray-600">로고, 이미지 등 홍보 자료</p>
            </div>
            <div className="flex justify-center">
              <Link 
                href="/resources/downloads"
                className="inline-flex items-center justify-center px-8 py-4 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
              >
                <i className="fas fa-download mr-2"></i>
                다운로드 바로가기
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
