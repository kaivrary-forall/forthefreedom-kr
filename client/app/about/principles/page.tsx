'use client'

import { useState } from 'react'
import Link from 'next/link'
import { policyData } from '@/data/policy.ko'

type TabType = 'platform' | 'charter' | 'rules' | 'policy'

const tabs: { id: TabType; name: string; icon: string }[] = [
  { id: 'platform', name: '강령', icon: 'fa-flag' },
  { id: 'charter', name: '당헌', icon: 'fa-book' },
  { id: 'rules', name: '당규', icon: 'fa-gavel' },
  { id: 'policy', name: '정강', icon: 'fa-scroll' }
]

// 7대 선언
const declarations = [
  '정의, 공정, 희망을 추구하는 가치 정당을 지향한다.',
  '부정선거세력을 척결하여 민주주의의 근간인 선거 시스템의 투명성을 확보한다.',
  '국가 안보 및 사회 건전성을 강화한다.',
  '4차 산업혁명 활성화를 통한 미래 도약 및 경제 강국, 초일류 정상국가를 실현한다.',
  '청년 희망 사다리를 구축한다.',
  '자유 통일의 기반을 구축한다.',
  '문화 융성을 통한 행복한 대한민국을 실현한다.'
]

const numberWords = ['하나', '둘', '셋', '넷', '다섯', '여섯', '일곱']

export default function PrinciplesPage() {
  const [activeTab, setActiveTab] = useState<TabType>('platform')

  return (
    <div>
      <main className="relative z-10 bg-white">
        {/* 탭 네비게이션 */}
        <div 
          className="sticky z-30 bg-white border-b border-gray-200 transition-[top] duration-300 ease-in-out"
          style={{ top: 'calc(64px + var(--top-notice-h, 0px))' }}
        >
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex justify-center space-x-0 overflow-x-auto scrollbar-hide">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-2 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-primary text-primary'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <i className={`fas ${tab.icon} mr-2`}></i>{tab.name}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* 강령 콘텐츠 */}
        {activeTab === 'platform' && (
          <section className="py-12 bg-white">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-8">
                  <i className="fas fa-flag text-primary text-4xl"></i>
                </div>
                <p className="text-xl text-gray-600 max-w-6xl mx-auto">
                  자유와혁신의 강령은 당의 기본 이념과 정책 방향을 담고 있습니다.
                </p>
              </div>

              {/* 정강정책 */}
              <div className="mb-20">
                <div className="text-center mb-12">
                  <h3 className="text-3xl font-bold text-gray-900 mb-4">정강정책</h3>
                  <p className="text-lg text-gray-600 max-w-6xl mx-auto leading-relaxed">
                    자유와혁신은 대한민국의 자유민주주의 체제, 시장경제 원칙, 그리고 법치주의를 수호하며, 
                    지속적인 혁신을 통해 정치, 경제, 사회, 교육, 문화 등 전반의 발전을 추구하는 국민 중심의 정당이다.
                  </p>
                </div>

                {/* 창당 이념 */}
                <div className="mb-16">
                  <h4 className="text-xl font-bold text-gray-900 mb-6 border-l-4 border-blue-600 pl-4">
                    1. 창당 이념 및 역사적 계승
                  </h4>
                  <div className="prose max-w-none">
                    <p className="text-gray-700 leading-relaxed mb-4">
                      대한민국 건국 당시, 시대의 흐름을 읽고 &apos;자유민주주의&apos;를 채택해 세계 자유 진영과 함께 한 
                      이승만 대통령의 &apos;자유&apos; 정신과 &quot;우리도 할 수 있다&quot;고 외치면서 대한민국이 오늘날 
                      세계 10위권의 경제 강국, 국방력 세계 5위의 부국강병 반열에 오를 수 있도록 산업화의 토대를 마련한 
                      박정희 대통령의 &apos;혁신&apos; 정신을 계승한 정당이다.
                    </p>
                    <p className="text-gray-700 leading-relaxed">
                      자유와혁신은 시대를 앞서간 선각자들의 이러한 헌신과 정신을 계승하여, 새로운 대한민국의 미래를 열어갈 것이다.
                    </p>
                  </div>
                </div>

                {/* 창당 배경 */}
                <div className="mb-16">
                  <h4 className="text-xl font-bold text-gray-900 mb-6 border-l-4 border-blue-600 pl-4">
                    2. 창당 배경과 목표
                  </h4>
                  <div className="prose max-w-none space-y-4">
                    <p className="text-gray-700 leading-relaxed">
                      현재 대한민국은 물질적 풍요 속에서 일부 사회 구성원들이 국가의 근간을 위협하는 세력의 준동에 대한 
                      경각심을 잃고 있으며, 자유민주주의 체제를 훼손하려는 시도에 적절히 대응하지 못하는 위기에 직면해 있다.
                    </p>
                    <p className="text-gray-700 leading-relaxed">
                      자유와혁신은 이러한 국가적 위기를 심각하게 인식하고, 자유민주주의 수호와 국가 안정을 위한 적극적인 역할을 다할 것이다.
                    </p>
                    <p className="text-gray-700 leading-relaxed font-semibold text-primary">
                      우리는 제도권 정치에 진입하여 국민의 목소리를 대변하고, 대한민국의 자유민주주의를 재건하며 
                      혁신적인 국가 개조를 이루기 위해 모든 역량을 집중할 것이다.
                    </p>
                  </div>
                </div>

                {/* 7대 선언 */}
                <div className="mb-16">
                  <h4 className="text-xl font-bold text-gray-900 mb-6 border-l-4 border-blue-600 pl-4">
                    3. 새로운 대한민국을 위한 우리의 선언
                  </h4>
                  <div className="space-y-4">
                    {declarations.map((declaration, idx) => (
                      <div key={idx} className="flex items-start">
                        <span className="inline-flex items-center justify-center w-10 h-10 bg-blue-600 text-white font-bold text-sm rounded-full mr-4 flex-shrink-0 mt-1">
                          {numberWords[idx]}
                        </span>
                        <p className="text-gray-700 leading-relaxed pt-2">{declaration}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* 당헌 콘텐츠 */}
        {activeTab === 'charter' && (
          <section className="py-12 bg-white">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-8">
                  <i className="fas fa-book text-primary text-4xl"></i>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">당헌</h2>
                <p className="text-xl text-gray-600">
                  자유와혁신의 당헌은 당의 조직과 운영에 관한 기본 규정을 담고 있습니다.
                </p>
              </div>

              <div className="bg-gray-50 rounded-2xl p-8 md:p-12">
                <div className="prose max-w-none">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">제1장 총칙</h3>
                  
                  <div className="mb-8">
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">제1조 (명칭)</h4>
                    <p className="text-gray-700">본 당의 명칭은 &quot;자유와혁신&quot;(약칭: 자혁, 영문: Freedom and Innovation Party)이라 한다.</p>
                  </div>

                  <div className="mb-8">
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">제2조 (목적)</h4>
                    <p className="text-gray-700">
                      본 당은 자유민주주의와 시장경제 원칙에 입각하여 국민의 기본권을 보장하고, 
                      혁신을 통한 국가 발전과 국민 복지 증진을 목적으로 한다.
                    </p>
                  </div>

                  <div className="mb-8">
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">제3조 (소재지)</h4>
                    <p className="text-gray-700">본 당의 중앙당 사무소는 서울특별시에 둔다.</p>
                  </div>

                  <div className="text-center mt-12">
                    <p className="text-gray-500">상세 당헌 내용은 정당 공식 문서를 참조하시기 바랍니다.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* 당규 콘텐츠 */}
        {activeTab === 'rules' && (
          <section className="py-12 bg-white">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-8">
                  <i className="fas fa-gavel text-primary text-4xl"></i>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">당규</h2>
                <p className="text-xl text-gray-600">
                  자유와혁신의 당규는 당헌의 시행을 위한 세부 규정을 담고 있습니다.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {[
                  { title: '당원관리규정', icon: 'fa-users' },
                  { title: '선거관리규정', icon: 'fa-vote-yea' },
                  { title: '재정관리규정', icon: 'fa-coins' },
                  { title: '윤리강령', icon: 'fa-balance-scale' },
                  { title: '시도당운영규정', icon: 'fa-building' },
                  { title: '위원회운영규정', icon: 'fa-sitemap' }
                ].map((rule, idx) => (
                  <div key={idx} className="bg-gray-50 rounded-xl p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                        <i className={`fas ${rule.icon} text-white text-lg`}></i>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">{rule.title}</h3>
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-center mt-12">
                <p className="text-gray-500">상세 당규 내용은 정당 공식 문서를 참조하시기 바랍니다.</p>
              </div>
            </div>
          </section>
        )}

        {/* 정강 콘텐츠 */}
        {activeTab === 'policy' && (
          <>
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
                        <p key={i}>{p}</p>
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
          </>
        )}
      </main>
    </div>
  )
}
