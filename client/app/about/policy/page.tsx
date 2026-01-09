import type { Metadata } from 'next'
import Link from 'next/link'
import { policyData } from '@/data/policy.ko'

export const metadata: Metadata = {
  title: '자유와혁신 정강정책 | 7대 핵심정책',
  description: '황교안 자유와혁신의 7대 핵심정책과 정강. 경제성장, 교육혁신, 국가안보, 사회안전망 정책을 확인하세요',
  openGraph: {
    title: '자유와혁신 정강정책 | 7대 핵심정책',
    description: '황교안 자유와혁신의 7대 핵심정책과 정강',
    url: 'https://forthefreedom.kr/about/policy',
    images: ['/images/night-pic.jpg'],
  },
}

export default function PolicyPage() {
  return (
    <div>
      <main className="relative z-10 bg-white">
        {/* 당의 정체성 */}
        <section className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">자유와혁신 정강정책</h2>
              <div className="w-24 h-1 bg-primary mx-auto mb-8"></div>
            </div>
            
            <div className="max-w-6xl mx-auto">
              {/* 당의 정체성 */}
              <div className="bg-red-50 border-l-8 border-primary p-10 rounded-lg mb-12">
                <h3 className="text-2xl font-bold text-red-800 mb-6">{policyData.identity.title}</h3>
                <p className="text-lg text-gray-700 leading-relaxed">
                  {policyData.identity.content}
                </p>
              </div>
              
              {/* 창당 이념 */}
              <div className="mb-16">
                <h3 className="text-3xl font-bold text-gray-900 mb-8">• {policyData.ideology.title}</h3>
                <div className="bg-gray-50 p-8 rounded-lg space-y-6">
                  {policyData.ideology.paragraphs.map((p, i) => (
                    <p key={i} className="text-lg text-gray-700 leading-relaxed">{p}</p>
                  ))}
                </div>
              </div>
              
              {/* 창당 배경과 목표 */}
              <div className="mb-16">
                <h3 className="text-3xl font-bold text-gray-900 mb-8">• {policyData.background.title}</h3>
                <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
                  {policyData.background.paragraphs.map((p, i) => (
                    <p key={i} className={i === policyData.background.paragraphs.length - 1 ? '' : ''}>{p}</p>
                  ))}
                  <p className="font-semibold text-primary">
                    우리는 제도권 정치에 진입하여 국민의 목소리를 대변하고, 대한민국의 자유민주주의를 재건하며 혁신적인 국가 개조를 이루기 위해 모든 역량을 집중할 것이다.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 7대 핵심 정책 카드 */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="flex items-center justify-center mb-6">
                <div className="w-4 h-4 bg-primary mr-4"></div>
                <h2 className="text-lg font-medium text-primary tracking-wider uppercase">7대 핵심 정책</h2>
              </div>
              <h3 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                새로운 대한민국을 위한
                <span className="text-primary"> 7대 핵심 정책</span>
              </h3>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {policyData.policyCards.map((card) => (
                <div key={card.id} className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <div className={`w-12 h-12 ${card.iconColor} rounded-full flex items-center justify-center mb-4`}>
                    <i className={`fas ${card.icon} text-white text-xl`}></i>
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-3">{card.title}</h4>
                  <p className="text-gray-600">{card.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 7대 핵심 정책 선언 */}
        <section className="py-20 bg-primary text-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-6">새로운 대한민국을 위한 우리의 선언</h2>
              <p className="text-xl text-red-100 max-w-6xl mx-auto">
                자유와혁신이 국민과 함께 만들어갈 7대 핵심 정책입니다
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {policyData.policyCards.slice(0, 6).map((card) => (
                <div key={card.id} className="bg-white/10 p-8 rounded-lg backdrop-blur-sm">
                  <div className="text-6xl font-bold text-red-200 mb-4">{card.number}</div>
                  <h3 className="text-xl font-bold">{card.title}</h3>
                </div>
              ))}
            </div>
            
            <div className="text-center">
              <div className="bg-white/10 p-8 rounded-lg backdrop-blur-sm inline-block text-left">
                <div className="text-6xl font-bold text-red-200 mb-4">{policyData.policyCards[6].number}</div>
                <h3 className="text-xl font-bold">{policyData.policyCards[6].title}</h3>
              </div>
            </div>
          </div>
        </section>

        {/* 세부 정책 내용 */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">자유와혁신 기본정책</h2>
              <div className="w-24 h-1 bg-primary mx-auto mb-8"></div>
              <p className="text-xl text-gray-600 max-w-6xl mx-auto">
                자유와혁신은 대한민국의 지속 가능한 발전과 국민의 삶의 질 향상을 위한 구체적인 정책 과제를 제시한다.
              </p>
            </div>

            {policyData.policyDetails.map((policy) => (
              <div key={policy.id} className="mb-16">
                <div className={`bg-white p-10 rounded-lg shadow-lg border-l-8 ${policy.borderColor}`}>
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">
                    <span className={policy.borderColor.replace('border-', 'text-')}>{policy.numberText}</span> {policy.title}
                  </h3>
                  <p className="text-lg text-gray-700 leading-relaxed mb-6">
                    {policy.description}
                  </p>
                  
                  <div className="grid md:grid-cols-3 gap-6">
                    {policy.items.map((item, idx) => (
                      <div key={idx} className="p-6 bg-red-50 rounded-lg">
                        <h4 className="font-bold text-red-800 mb-3">{item.title}</h4>
                        <p className="text-gray-700">{item.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA 섹션 */}
        <section className="py-16 bg-primary">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-6">함께 만들어갈 자유와혁신의 미래</h2>
            <p className="text-xl text-red-100 mb-8 max-w-6xl mx-auto">
              자유민주주의 수호와 혁신적 국가 개조를 위해 국민과 함께 나아가겠습니다
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="https://www.ihappynanum.com/Nanum/api/screen/F7FCRIO2E3" 
                target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center px-8 py-3 bg-white text-primary font-bold rounded-lg hover:bg-gray-100 transition-colors"
              >
                당원가입 <i className="fas fa-arrow-right ml-2"></i>
              </a>
              <Link 
                href="/support"
                className="inline-flex items-center px-8 py-3 border-2 border-white text-white font-bold rounded-lg hover:bg-white hover:text-primary transition-colors"
              >
                후원 <i className="fas fa-heart ml-2"></i>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
