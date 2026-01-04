import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '개인정보처리방침 | 자유와혁신',
  description: '자유와혁신 개인정보처리방침',
}

export default function PrivacyPage() {
  return (
    <div>
      {/* 히어로 */}
      <section className="bg-gray-900 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">개인정보처리방침</h1>
        </div>
      </section>

      <main className="relative z-10 bg-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose max-w-none">
            <p className="text-gray-600 mb-8">
              자유와혁신(이하 "당")은 「개인정보 보호법」에 따라 정보주체의 개인정보를 보호하고
              이와 관련한 고충을 신속하고 원활하게 처리할 수 있도록 하기 위하여 다음과 같이 개인정보 처리방침을 수립·공개합니다.
            </p>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">제1조 (개인정보의 처리목적)</h2>
            <p className="text-gray-600 mb-4">
              당은 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며, 
              이용 목적이 변경되는 경우에는 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
              <li>당원 가입 및 관리</li>
              <li>후원금 접수 및 관리</li>
              <li>당 활동 관련 안내 및 공지</li>
              <li>민원 처리</li>
            </ul>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">제2조 (개인정보의 처리 및 보유기간)</h2>
            <p className="text-gray-600 mb-4">
              당은 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터 개인정보를 수집 시에 동의받은 개인정보 보유·이용기간 내에서 개인정보를 처리·보유합니다.
            </p>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">제3조 (개인정보의 제3자 제공)</h2>
            <p className="text-gray-600 mb-4">
              당은 정보주체의 개인정보를 제1조에서 명시한 범위 내에서만 처리하며, 정보주체의 동의, 법률의 특별한 규정 등의 경우에만 개인정보를 제3자에게 제공합니다.
            </p>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">제4조 (정보주체의 권리·의무 및 행사방법)</h2>
            <p className="text-gray-600 mb-4">
              정보주체는 당에 대해 언제든지 개인정보 열람·정정·삭제·처리정지 요구 등의 권리를 행사할 수 있습니다.
            </p>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">제5조 (개인정보 보호책임자)</h2>
            <div className="bg-gray-50 p-6 rounded-lg mb-6">
              <p className="text-gray-700">
                <strong>개인정보 보호책임자</strong><br />
                부서: 사무처<br />
                연락처: 02-2634-2023<br />
                이메일: forthefreedom2025@naver.com
              </p>
            </div>

            <p className="text-sm text-gray-500 mt-8">
              이 개인정보처리방침은 2025년 7월 1일부터 적용됩니다.
            </p>
          </div>

          {/* 네비게이션 */}
          <div className="mt-12 text-center">
            <Link 
              href="/"
              className="inline-flex items-center gap-2 text-primary font-semibold hover:underline"
            >
              <i className="fas fa-home"></i>
              홈으로 돌아가기
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
