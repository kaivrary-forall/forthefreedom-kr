import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '자주 묻는 질문 | 자유와혁신',
  description: '자유와혁신 당원가입, 후원, 활동에 관한 자주 묻는 질문과 답변',
}

const faqs = [
  {
    question: '당원가입은 어떻게 하나요?',
    answer: '온라인으로 간편하게 가입하실 수 있습니다. 홈페이지의 "당원가입" 버튼을 클릭하시면 본인인증 후 가입이 진행됩니다. 오프라인 가입을 원하시면 중앙당 또는 시도당에 방문해 주세요.'
  },
  {
    question: '당비는 얼마인가요?',
    answer: '당비는 월 1,000원 이상이며, 자유롭게 정하실 수 있습니다. 당비 납부는 자동이체 또는 계좌이체로 가능합니다.'
  },
  {
    question: '당원이 되면 어떤 활동을 할 수 있나요?',
    answer: '당원은 각종 당 행사 참여, 정책 토론, 선거 캠프 활동, 자원봉사 등 다양한 활동에 참여하실 수 있습니다. 또한 직능위원회나 자유행동(자원봉사단)에 가입하여 전문 분야별 활동도 가능합니다.'
  },
  {
    question: '후원금은 세액공제가 되나요?',
    answer: '네, 정치자금법에 따라 10만원까지는 전액 세액공제, 10만원 초과분은 15%의 세액공제 혜택을 받으실 수 있습니다.'
  },
  {
    question: '탈당은 어떻게 하나요?',
    answer: '탈당을 원하시면 중앙당 사무처(02-2634-2023)로 연락 주시거나, 이메일(forthefreedom2025@naver.com)로 탈당 의사를 전달해 주세요.'
  },
  {
    question: '공무원도 당원이 될 수 있나요?',
    answer: '국가공무원법 및 지방공무원법에 따라 일부 공무원은 정당 가입이 제한됩니다. 다만, 정무직 공무원, 지방의회 의원 등은 가입이 가능합니다. 자세한 사항은 중앙당으로 문의해 주세요.'
  }
]

export default function FAQPage() {
  return (
    <div>
      {/* 히어로 */}
      <section 
        className="relative h-[40vh] flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: "url('/images/night-pic.jpg')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20"></div>
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg">자주 묻는 질문</h1>
        </div>
      </section>

      <main className="relative z-10 bg-white">
        <section className="py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="space-y-6">
              {faqs.map((faq, idx) => (
                <div key={idx} className="bg-white border rounded-xl overflow-hidden">
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-start gap-3">
                      <span className="text-primary">Q.</span>
                      {faq.question}
                    </h3>
                    <p className="text-gray-600 pl-7">
                      <span className="text-gray-400 font-bold mr-2">A.</span>
                      {faq.answer}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* 추가 문의 */}
            <div className="mt-12 bg-gray-50 rounded-xl p-8 text-center">
              <h3 className="text-xl font-bold text-gray-900 mb-4">더 궁금한 점이 있으신가요?</h3>
              <p className="text-gray-600 mb-6">
                중앙당 사무처로 문의해 주세요
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="tel:02-2634-2023"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-colors"
                >
                  <i className="fas fa-phone"></i>
                  02-2634-2023
                </a>
                <a 
                  href="mailto:forthefreedom2025@naver.com"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-primary text-primary rounded-lg font-semibold hover:bg-primary hover:text-white transition-colors"
                >
                  <i className="fas fa-envelope"></i>
                  이메일 문의
                </a>
              </div>
            </div>

            {/* 네비게이션 */}
            <div className="mt-8 text-center">
              <Link 
                href="/participate"
                className="inline-flex items-center gap-2 text-primary font-semibold hover:underline"
              >
                <i className="fas fa-arrow-left"></i>
                참여하기로 돌아가기
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
