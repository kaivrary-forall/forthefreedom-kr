'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

type TabType = 'greeting' | 'founding' | 'identity' | 'values' | 'vision'

export default function AboutTabs() {
  const [activeTab, setActiveTab] = useState<TabType>('greeting')

  const tabs: { id: TabType; label: string }[] = [
    { id: 'greeting', label: '당대표 인사말' },
    { id: 'founding', label: '창당스토리' },
    { id: 'identity', label: '정체성' },
    { id: 'values', label: '핵심가치' },
    { id: 'vision', label: '미래비전' },
  ]

  return (
    <div className="pt-16">
      {/* 탭 네비게이션 */}
      <div className="sticky top-16 z-40 bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-0 overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* 탭 콘텐츠 */}
      <main className="bg-white">
        {activeTab === 'greeting' && <GreetingContent />}
        {activeTab === 'founding' && <FoundingContent />}
        {activeTab === 'identity' && <IdentityContent />}
        {activeTab === 'values' && <ValuesContent />}
        {activeTab === 'vision' && <VisionContent />}

        {/* CTA 섹션 (공통) */}
        <section className="py-20 bg-primary text-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl font-bold mb-6">자유민주주의 체제 수호에 동참하세요</h2>
            <p className="text-xl text-red-100 mb-8 leading-relaxed">
              반국가세력에 맞서 자유와혁신을 지지하는 모든 분들과 함께 자유민주주의 체제를 지키기 위해 노력하겠습니다.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="https://www.ihappynanum.com/Nanum/api/screen/F7FCRIO2E3"
                target="_blank" rel="noopener noreferrer"
                className="bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                당원가입
              </a>
              <Link 
                href="/about/policy"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary transition-colors"
              >
                정강정책 보기
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

// 당대표 인사말
function GreetingContent() {
  return (
    <section className="py-12 sm:py-16 lg:py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <div className="order-2 lg:order-1">
            <div className="space-y-6 border-l-4 border-primary pl-8">
              <div className="flex items-center space-x-3">
                <span className="text-primary font-medium text-lg tracking-wider uppercase">당 대표 인사말</span>
              </div>
              <h3 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
                자유민주주의 수호와<br />혁신적 미래 비전
              </h3>
              <div className="space-y-4 text-lg text-gray-600 leading-relaxed">
                <p className="italic font-medium text-gray-800">
                  &quot;자유와혁신은 대한민국의 자유민주주의 체제를 수호하고, 시장경제와 법치주의를 기반으로 혁신적 미래를 선도하는 국민의 정당입니다.&quot;
                </p>
                <p>
                  자유와혁신은 대한민국 건국 당시, 자유민주주의를 채택하여 세계 자유진영과 함께 한 이승만 대통령의 &apos;자유&apos; 정신, 그리고 오늘날 대한민국이 부국강병 반열에 오를 수 있도록 산업화의 토대를 마련한 박정희 대통령의 &apos;혁신&apos; 정신을 계승한 정당입니다.
                </p>
                <p>
                  부정선거와 반국가행위를 엄단하고, 법치주의를 확립하여 국민이 안심하고 살 수 있는 나라, 4차 산업혁명을 선도하며 청년들에게 무한한 기회가 보장되는 나라를 만들겠습니다.
                </p>
              </div>
              <div className="pt-8 border-t border-gray-200">
                <div className="flex items-end justify-between">
                  <div className="flex flex-col justify-center">
                    <p className="text-gray-600 text-sm mb-1">자유와혁신</p>
                    <p className="text-gray-900 font-bold text-2xl">당 대표</p>
                    <p className="text-gray-500 text-sm mt-1">대한민국 제 44대 국무총리</p>
                  </div>
                  <div className="w-48 h-28 flex items-center justify-center">
                    <Image
                      src="/images/signiture.PNG"
                      alt="황교안 대표 서명"
                      width={192}
                      height={112}
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <div className="relative">
              <div className="w-full h-96 lg:h-[500px] rounded-2xl overflow-hidden border-8 border-gray-100 shadow-xl bg-gray-100">
                <Image
                  src="/images/profile-pic.jpg"
                  alt="자유와혁신 대표 황교안"
                  width={500}
                  height={500}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// 창당스토리
function FoundingContent() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">창당 스토리 - 자유와혁신</h2>
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              대한민국은 현재 미완성된 국정감시와 반국가세력의 준동, 선거 조작 의혹 등으로 위기에 처해 있습니다.
            </p>
            <div className="space-y-4 mb-8">
              <div className="flex items-start">
                <i className="fas fa-exclamation-triangle text-primary mr-3 mt-1"></i>
                <span className="text-gray-700">2020년 4.15 총선 이후 거듭된 각종 조작 의혹</span>
              </div>
              <div className="flex items-start">
                <i className="fas fa-exclamation-triangle text-primary mr-3 mt-1"></i>
                <span className="text-gray-700">좌파 세력과 결탁한 반국가세력의 선거 조작 시도</span>
              </div>
              <div className="flex items-start">
                <i className="fas fa-exclamation-triangle text-primary mr-3 mt-1"></i>
                <span className="text-gray-700">자유민주주의 체제의 심각한 위기</span>
              </div>
            </div>
            <p className="text-lg text-primary font-semibold">
              분노한 애국 세력이 이 거악과 체제 전쟁을 막기 위해 자유와혁신을 창당했습니다.
            </p>
          </div>
          <div className="text-center">
            <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">창당 목표</h3>
              <div className="space-y-4">
                <div className="p-4 bg-red-50 rounded-lg">
                  <h4 className="font-bold text-red-800 mb-2">단기</h4>
                  <p className="text-base text-red-700">부정선거 카르텔 발본색원 및 공정선거시스템 구축</p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-bold text-blue-800 mb-2">중기</h4>
                  <p className="text-base text-blue-700">반국가세력 척결 및 국정감시 시스템 강화</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-bold text-green-800 mb-2">장기</h4>
                  <p className="text-base text-green-700">자유통일 대한민국 실현 및 글로벌 강국 건설</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// 정체성
function IdentityContent() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">자유와혁신의 정체성</h2>
          <p className="text-xl text-gray-600 max-w-6xl mx-auto leading-relaxed">
            자유와혁신이 추구하는 핵심 가치와 그 실현 방향을 제시합니다.
          </p>
        </div>
        
        {/* 인과관계 화살표 섹션 */}
        <div className="space-y-12">
          {/* 반국가세력 척결 ← 자유민주주의 */}
          <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12">
            <div className="bg-gradient-to-r from-red-100 to-red-200 p-8 rounded-2xl shadow-lg border-2 border-red-300 flex-1 max-w-md">
              <div className="w-16 h-16 bg-red-700 rounded-full flex items-center justify-center mb-6 mx-auto">
                <i className="fas fa-shield-alt text-white text-2xl"></i>
              </div>
              <h3 className="text-2xl font-bold text-red-800 mb-4 text-center">반국가세력 척결</h3>
              <p className="text-gray-700 leading-relaxed text-center">
                자유민주주의를 위협하는 반국가세력을 엄단하고 국가 안보를 강화합니다.
              </p>
            </div>
            
            <div className="flex items-center justify-center">
              <div className="hidden lg:flex items-center">
                <div className="w-12 h-0.5 bg-red-600"></div>
                <div className="w-0 h-0 border-l-[12px] border-l-red-600 border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent"></div>
              </div>
              <div className="lg:hidden flex flex-col items-center">
                <div className="w-0.5 h-12 bg-red-600"></div>
                <div className="w-0 h-0 border-t-[12px] border-t-red-600 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent"></div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-red-50 to-red-100 p-8 rounded-2xl shadow-lg border-2 border-red-200 flex-1 max-w-md">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-6 mx-auto">
                <i className="fas fa-flag text-white text-2xl"></i>
              </div>
              <h3 className="text-2xl font-bold text-red-700 mb-4 text-center">자유민주주의</h3>
              <p className="text-gray-700 leading-relaxed text-center">
                대한민국 건국 이념인 자유민주주의 체제를 수호하고 발전시킵니다.
              </p>
            </div>
          </div>
          
          {/* 부정선거 척결 ← 정의사회구현 */}
          <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12">
            <div className="bg-gradient-to-r from-blue-100 to-blue-200 p-8 rounded-2xl shadow-lg border-2 border-blue-300 flex-1 max-w-md">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-6 mx-auto border-2 border-blue-300">
                <i className="fas fa-vote-yea text-blue-700 text-2xl"></i>
              </div>
              <h3 className="text-2xl font-bold text-blue-800 mb-4 text-center">부정선거 척결</h3>
              <p className="text-gray-700 leading-relaxed text-center">
                투명하고 공정한 선거 시스템을 구축하여 민주주의를 지켜냅니다.
              </p>
            </div>
            
            <div className="flex items-center justify-center">
              <div className="hidden lg:flex items-center">
                <div className="w-12 h-0.5 bg-blue-600"></div>
                <div className="w-0 h-0 border-l-[12px] border-l-blue-600 border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent"></div>
              </div>
              <div className="lg:hidden flex flex-col items-center">
                <div className="w-0.5 h-12 bg-blue-600"></div>
                <div className="w-0 h-0 border-t-[12px] border-t-blue-600 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent"></div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-8 rounded-2xl shadow-lg border-2 border-blue-200 flex-1 max-w-md">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-6 mx-auto border-2 border-blue-300">
                <i className="fas fa-balance-scale text-blue-600 text-2xl"></i>
              </div>
              <h3 className="text-2xl font-bold text-blue-700 mb-4 text-center">정의사회구현</h3>
              <p className="text-gray-700 leading-relaxed text-center">
                공정과 정의가 살아 숨쉬는 사회를 만들어 나갑니다.
              </p>
            </div>
          </div>
          
          {/* 청년과 함께 ← 혁신과 도약 */}
          <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12">
            <div className="bg-gradient-to-r from-green-100 to-green-200 p-8 rounded-2xl shadow-lg border-2 border-green-300 flex-1 max-w-md">
              <div className="w-16 h-16 bg-green-700 rounded-full flex items-center justify-center mb-6 mx-auto">
                <i className="fas fa-users text-white text-2xl"></i>
              </div>
              <h3 className="text-2xl font-bold text-green-800 mb-4 text-center">청년과 함께</h3>
              <p className="text-gray-700 leading-relaxed text-center">
                청년들에게 무한한 기회를 제공하고 함께 미래를 개척합니다.
              </p>
            </div>
            
            <div className="flex items-center justify-center">
              <div className="hidden lg:flex items-center">
                <div className="w-12 h-0.5 bg-green-600"></div>
                <div className="w-0 h-0 border-l-[12px] border-l-green-600 border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent"></div>
              </div>
              <div className="lg:hidden flex flex-col items-center">
                <div className="w-0.5 h-12 bg-green-600"></div>
                <div className="w-0 h-0 border-t-[12px] border-t-green-600 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent"></div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-green-50 to-green-100 p-8 rounded-2xl shadow-lg border-2 border-green-200 flex-1 max-w-md">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mb-6 mx-auto">
                <i className="fas fa-rocket text-white text-2xl"></i>
              </div>
              <h3 className="text-2xl font-bold text-green-700 mb-4 text-center">혁신과 도약</h3>
              <p className="text-gray-700 leading-relaxed text-center">
                4차 산업혁명을 선도하며 혁신적 미래를 만들어갑니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// 핵심가치
function ValuesContent() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">핵심 가치</h2>
          <p className="text-xl text-gray-600 max-w-6xl mx-auto leading-relaxed">
            자유와혁신이 추구하는 정체성과 핵심 가치입니다
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center p-8 bg-white rounded-lg shadow-md">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
              <i className="fas fa-flag text-white text-2xl"></i>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">자유민주주의</h3>
            <p className="text-gray-600">
              대한민국 헌법 정신에 입각한 자유민주주의 체제를 수호합니다.
            </p>
          </div>
          <div className="text-center p-8 bg-white rounded-lg shadow-md">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
              <i className="fas fa-balance-scale text-white text-2xl"></i>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">법치주의</h3>
            <p className="text-gray-600">
              법 앞에 모든 국민이 평등한 공정한 사회를 만들어갑니다.
            </p>
          </div>
          <div className="text-center p-8 bg-white rounded-lg shadow-md">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
              <i className="fas fa-chart-line text-white text-2xl"></i>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">시장경제</h3>
            <p className="text-gray-600">
              자유로운 경쟁과 혁신을 통해 경제 성장을 이끕니다.
            </p>
          </div>
          <div className="text-center p-8 bg-white rounded-lg shadow-md">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
              <i className="fas fa-lightbulb text-white text-2xl"></i>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">혁신</h3>
            <p className="text-gray-600">
              4차 산업혁명을 선도하며 혁신적 미래를 만들어갑니다.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

// 미래 비전
function VisionContent() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">미래 비전</h2>
          <p className="text-xl text-gray-600 max-w-6xl mx-auto leading-relaxed">
            초일류 정치국가를 지향하며 4차산업혁명 시대를 선도하는 대한민국을 건설합니다.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-gradient-to-br from-red-50 to-red-100 p-8 rounded-lg text-center">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
              <i className="fas fa-globe-asia text-white text-2xl"></i>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">자유통일 대한민국 실현</h3>
            <p className="text-lg text-gray-600">
              북한 주민까지 해방시켜 통일대국을 위한 유라시아 대륙의 평화 구현
            </p>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-lg text-center">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <i className="fas fa-microchip text-white text-2xl"></i>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">4차산업혁명 선도</h3>
            <p className="text-lg text-gray-600">
              AI, 반도체, 로봇 등 첨단 산업을 주도할 수 있는 혁신 정책 발굴과 실천
            </p>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-lg text-center">
            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <i className="fas fa-users text-white text-2xl"></i>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">청년 인재 기용</h3>
            <p className="text-lg text-gray-600">
              능력 있는 인재를 지역과 분야를 가리지 않고 과감히 기용하여 국가 발전에 기여
            </p>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-8 rounded-lg text-center">
            <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <i className="fas fa-paint-brush text-white text-2xl"></i>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">문화 융성 선진국</h3>
            <p className="text-lg text-gray-600">
              품격있는 문화 국가 실현, K-콘텐츠 육성으로 글로벌 문화강국 도약
            </p>
          </div>
          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-8 rounded-lg text-center">
            <div className="w-16 h-16 bg-yellow-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <i className="fas fa-crown text-white text-2xl"></i>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">글로벌 강대국 G2 성취</h3>
            <p className="text-lg text-gray-600">
              초일류 정상국가로 자유통일과 글로벌 강국 G2 성취
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
