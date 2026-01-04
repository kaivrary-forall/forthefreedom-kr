import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '이용약관 | 자유와혁신',
  description: '자유와혁신 웹사이트 이용약관',
}

export default function TermsPage() {
  return (
    <div>
      {/* 히어로 */}
      <section className="bg-gray-900 py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">이용약관</h1>
        </div>
      </section>

      <main className="relative z-10 bg-white py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose max-w-none">
            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">제1조 (목적)</h2>
            <p className="text-gray-600 mb-4">
              이 약관은 자유와혁신(이하 "당")이 운영하는 웹사이트(이하 "사이트")에서 제공하는 서비스의 이용조건 및 절차에 관한 사항을 규정함을 목적으로 합니다.
            </p>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">제2조 (정의)</h2>
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
              <li>"사이트"란 당이 운영하는 인터넷 웹사이트(forthefreedom.kr)를 말합니다.</li>
              <li>"이용자"란 사이트에 접속하여 이 약관에 따라 당이 제공하는 서비스를 받는 자를 말합니다.</li>
              <li>"당원"이란 당에 가입하여 당원으로서의 권리와 의무를 가진 자를 말합니다.</li>
            </ul>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">제3조 (약관의 효력 및 변경)</h2>
            <p className="text-gray-600 mb-4">
              이 약관은 사이트에 게시하여 공시함으로써 효력이 발생합니다. 당은 합리적인 사유가 발생할 경우에는 이 약관을 변경할 수 있으며, 
              변경된 약관은 사이트에 공시함으로써 효력이 발생합니다.
            </p>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">제4조 (서비스의 제공)</h2>
            <p className="text-gray-600 mb-4">당은 다음과 같은 서비스를 제공합니다:</p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
              <li>당 소개 및 정책 안내</li>
              <li>정당 소식 및 공지사항</li>
              <li>당원 가입 및 후원 안내</li>
              <li>자료실 및 미디어 서비스</li>
              <li>기타 당이 정하는 서비스</li>
            </ul>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">제5조 (이용자의 의무)</h2>
            <p className="text-gray-600 mb-4">이용자는 다음 행위를 하여서는 안 됩니다:</p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
              <li>타인의 개인정보 도용</li>
              <li>사이트의 정상적인 운영을 방해하는 행위</li>
              <li>관계 법령에 위배되는 행위</li>
              <li>기타 공공질서 및 미풍양속에 반하는 행위</li>
            </ul>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">제6조 (저작권)</h2>
            <p className="text-gray-600 mb-4">
              사이트에 게시된 자료의 저작권은 당에 귀속되며, 이용자는 당의 사전 승낙 없이 이를 복제, 배포, 출판할 수 없습니다.
            </p>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">제7조 (면책조항)</h2>
            <p className="text-gray-600 mb-4">
              당은 천재지변, 전쟁, 기간통신사업자의 서비스 중지 등 불가항력적인 사유로 서비스를 제공할 수 없는 경우에는 책임이 면제됩니다.
            </p>

            <p className="text-sm text-gray-500 mt-8">
              이 약관은 2025년 7월 1일부터 적용됩니다.
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
