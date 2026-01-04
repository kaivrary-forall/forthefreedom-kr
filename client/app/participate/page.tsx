import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '참여하기 | 자유와혁신',
  description: '자유와혁신에 참여하세요. 당원가입, 후원, 자원봉사 등 다양한 방법으로 함께할 수 있습니다.',
  openGraph: {
    title: '참여하기 | 자유와혁신',
    description: '자유와혁신에 참여하세요',
    url: 'https://forthefreedom.kr/participate',
  },
}

const participationWays = [
  {
    icon: 'fa-user-plus',
    title: '당원가입',
    description: '자유와혁신의 당원이 되어 새로운 정치 변화에 참여하세요',
    link: '/participate/join',
    linkText: '가입 안내',
    color: 'bg-primary',
    external: false
  },
  {
    icon: 'fa-heart',
    title: '후원하기',
    description: '자유민주주의 수호를 위한 후원에 참여해 주세요',
    link: '/support',
    linkText: '후원 안내',
    color: 'bg-red-700',
    external: false
  },
  {
    icon: 'fa-hands-helping',
    title: '자원봉사',
    description: '자유행동과 함께 다양한 봉사활동에 참여하세요',
    link: '/participate/volunteer',
    linkText: '봉사 안내',
    color: 'bg-red-800',
    external: false
  },
  {
    icon: 'fa-building',
    title: '직능위원회',
    description: '전문 분야별 직능위원회 활동에 참여하세요',
    link: '/about/organization?tab=committee',
    linkText: '위원회 보기',
    color: 'bg-gray-700',
    external: false
  }
]

export default function ParticipatePage() {
  return (
    <div>
      {/* 히어로 */}
      <section 
        className="relative h-[50vh] flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: "url('/images/flag-pic.jpg')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20"></div>
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg">참여하기</h1>
          <p className="text-xl text-gray-200 drop-shadow">자유와혁신과 함께하는 다양한 방법</p>
        </div>
      </section>

      <main className="relative z-10 bg-white">
        {/* 참여 방법 */}
        <section className="py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">함께하는 방법</h2>
              <p className="text-lg text-gray-600">
                자유와혁신에 참여할 수 있는 다양한 방법을 확인하세요
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {participationWays.map((item, idx) => (
                <div key={idx} className="bg-white border-2 border-gray-100 rounded-2xl p-8 hover:shadow-xl transition-shadow">
                  <div className={`w-16 h-16 ${item.color} rounded-xl flex items-center justify-center mb-6`}>
                    <i className={`fas ${item.icon} text-white text-2xl`}></i>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{item.title}</h3>
                  <p className="text-gray-600 mb-6">{item.description}</p>
                  <Link 
                    href={item.link}
                    className="inline-flex items-center gap-2 text-primary font-semibold hover:underline"
                  >
                    {item.linkText}
                    <i className="fas fa-arrow-right"></i>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 빠른 가입 CTA */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-2xl p-12 border-2 border-red-200">
              <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="fas fa-user-plus text-white text-3xl"></i>
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-4">지금 바로 당원이 되세요</h3>
              <p className="text-lg text-gray-600 mb-8">
                온라인으로 간편하게 당원가입을 진행할 수 있습니다
              </p>
              <a 
                href="https://www.ihappynanum.com/Nanum/api/screen/F7FCRIO2E3"
                target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-primary text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-primary-dark transition-colors"
              >
                <i className="fas fa-user-plus"></i>
                온라인 당원가입
              </a>
            </div>
          </div>
        </section>

        {/* FAQ 링크 */}
        <section className="py-12 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-gray-600 mb-4">가입에 관해 궁금한 점이 있으신가요?</p>
            <Link 
              href="/participate/faq"
              className="inline-flex items-center gap-2 text-primary font-semibold hover:underline"
            >
              <i className="fas fa-question-circle"></i>
              자주 묻는 질문 보기
            </Link>
          </div>
        </section>
      </main>
    </div>
  )
}
