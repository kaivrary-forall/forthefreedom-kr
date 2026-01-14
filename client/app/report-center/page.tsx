import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '제보센터 | 자유와혁신',
  description: '자유와혁신 부정선거/반국가세력 제보센터. 부정선거, 반국가세력 관련 제보를 받습니다.',
  openGraph: {
    title: '제보센터 | 자유와혁신',
    description: '자유와혁신 부정선거/반국가세력 제보센터',
    url: 'https://forthefreedom.kr/report-center',
  },
}

export default function ReportCenterPage() {
  return (
    <div>
      
      <main className="bg-white py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 준비중 안내 */}
          <div className="bg-white rounded-2xl shadow-lg p-12 border border-gray-100 text-center mb-12">
            <div className="w-24 h-24 bg-red-50 rounded-full mx-auto mb-8 flex items-center justify-center">
              <i className="fas fa-tools text-primary text-4xl"></i>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">온라인 제보 시스템 준비중</h2>
            <p className="text-lg text-gray-600 mb-8">
              온라인 제보 시스템을 준비하고 있습니다.<br />
              현재는 아래 연락처로 제보해 주세요.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/"
                className="inline-flex items-center justify-center px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-colors"
              >
                <i className="fas fa-home mr-2"></i>홈으로 돌아가기
              </Link>
              <a 
                href="tel:02-6952-0510"
                className="inline-flex items-center justify-center px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors"
              >
                <i className="fas fa-phone mr-2"></i>전화 제보
              </a>
            </div>
          </div>

          {/* 제보 안내 */}
          <div className="bg-gray-50 rounded-xl p-8 border border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">
              <i className="fas fa-info-circle text-primary mr-2"></i>제보 연락처
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-white p-6 rounded-lg border border-gray-200 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <i className="fas fa-phone text-primary text-xl"></i>
                </div>
                <p className="text-sm text-gray-500 mb-2">전화</p>
                <a href="tel:02-6952-0510" className="text-xl font-bold text-gray-900 hover:text-primary">
                  02-6952-0510
                </a>
              </div>
              <div className="bg-white p-6 rounded-lg border border-gray-200 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <i className="fas fa-envelope text-primary text-xl"></i>
                </div>
                <p className="text-sm text-gray-500 mb-2">이메일</p>
                <a href="mailto:report@freeinno.kr" className="text-xl font-bold text-gray-900 hover:text-primary">
                  report@freeinno.kr
                </a>
              </div>
            </div>
          </div>

          {/* 제보 유형 안내 */}
          <div className="mt-12">
            <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">제보 대상</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-white p-6 rounded-xl border-2 border-red-100">
                <div className="flex items-center gap-3 mb-3">
                  <i className="fas fa-vote-yea text-primary text-xl"></i>
                  <h4 className="font-bold text-gray-900">부정선거 관련</h4>
                </div>
                <p className="text-sm text-gray-600">
                  선거 부정행위, 개표 조작 의혹, 선관위 비리 등
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl border-2 border-red-100">
                <div className="flex items-center gap-3 mb-3">
                  <i className="fas fa-shield-alt text-primary text-xl"></i>
                  <h4 className="font-bold text-gray-900">반국가세력 관련</h4>
                </div>
                <p className="text-sm text-gray-600">
                  종북 활동, 국가안보 위협 행위, 이적 행위 등
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
