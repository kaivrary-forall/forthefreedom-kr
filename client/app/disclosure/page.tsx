import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '정보공개 | 자유와혁신',
  description: '자유와혁신 정보공개. 정치자금 수입·지출 내역 등을 공개합니다.',
}

export default function DisclosurePage() {
  return (
    <div>
      <section className="bg-gray-900 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold text-white">정보공개</h1>
          <p className="text-gray-400 mt-2">정치자금법에 따른 정보공개</p>
        </div>
      </section>

      <main className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="prose max-w-none">
            <h2 className="text-xl font-bold text-gray-900 mb-4">정치자금 수입·지출 내역</h2>
            <p className="text-gray-600 mb-6">
              정치자금법 제42조에 따라 정치자금의 수입·지출 내역을 공개합니다.
            </p>

            <div className="bg-gray-50 rounded-xl p-8 text-center">
              <i className="fas fa-file-invoice-dollar text-4xl text-gray-400 mb-4"></i>
              <p className="text-gray-600">
                2025년 정치자금 회계보고서는 중앙선거관리위원회에 제출 후 공개될 예정입니다.
              </p>
              <a 
                href="https://www.nec.go.kr"
                target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-4 text-primary hover:underline"
              >
                중앙선거관리위원회 바로가기
                <i className="fas fa-external-link-alt text-xs"></i>
              </a>
            </div>

            <h2 className="text-xl font-bold text-gray-900 mt-12 mb-4">당비 납부 현황</h2>
            <p className="text-gray-600 mb-6">
              당원의 당비 납부 현황을 분기별로 공개합니다.
            </p>

            <div className="bg-gray-50 rounded-xl p-8 text-center">
              <p className="text-gray-600">준비 중입니다.</p>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Link href="/" className="text-primary hover:underline">
              <i className="fas fa-home mr-2"></i>홈으로 돌아가기
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
