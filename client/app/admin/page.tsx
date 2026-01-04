'use client'

import AdminGuard from '@/components/admin/AdminGuard'
import AdminSidebar from '@/components/admin/AdminSidebar'
import Link from 'next/link'

export default function AdminPage() {
  return (
    <AdminGuard>
      <div className="flex min-h-screen">
        <AdminSidebar />
        
        <main className="flex-1 p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">대시보드</h1>
            <p className="text-gray-500 mt-1">자유와혁신 관리자 시스템</p>
          </div>

          {/* 퀵 액션 카드 */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <Link
              href="/admin/site-settings/footer"
              className="bg-white rounded-xl p-6 border border-gray-200 hover:border-primary hover:shadow-lg transition-all"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">푸터 설정</h3>
              <p className="text-sm text-gray-500">주소, 연락처, 소셜 링크 관리</p>
            </Link>

            <Link
              href="/admin/content/banners"
              className="bg-white rounded-xl p-6 border border-gray-200 hover:border-primary hover:shadow-lg transition-all"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">배너 관리</h3>
              <p className="text-sm text-gray-500">메인 슬라이더 배너 편집</p>
            </Link>

            <Link
              href="/admin/content/notices"
              className="bg-white rounded-xl p-6 border border-gray-200 hover:border-primary hover:shadow-lg transition-all"
            >
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">공지사항</h3>
              <p className="text-sm text-gray-500">공지사항 작성 및 관리</p>
            </Link>
          </div>

          {/* 상태 카드 */}
          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="text-sm text-gray-500 mb-1">총 회원 수</div>
              <div className="text-2xl font-bold text-gray-900">-</div>
            </div>
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="text-sm text-gray-500 mb-1">오늘 방문자</div>
              <div className="text-2xl font-bold text-gray-900">-</div>
            </div>
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="text-sm text-gray-500 mb-1">아고라 게시글</div>
              <div className="text-2xl font-bold text-gray-900">-</div>
            </div>
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="text-sm text-gray-500 mb-1">새 댓글</div>
              <div className="text-2xl font-bold text-gray-900">-</div>
            </div>
          </div>
        </main>
      </div>
    </AdminGuard>
  )
}
