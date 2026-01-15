'use client'

import { useState } from 'react'

type TabType = 'platform' | 'charter' | 'rules' | 'policy'

interface PrinciplesTabsProps {
  initialTab?: TabType
}

export default function PrinciplesTabs({ initialTab = 'platform' }: PrinciplesTabsProps) {
  const [activeTab, setActiveTab] = useState<TabType>(initialTab)

  const tabs: { id: TabType; label: string }[] = [
    { id: 'platform', label: '강령' },
    { id: 'charter', label: '당헌' },
    { id: 'rules', label: '당규' },
    { id: 'policy', label: '정강' },
  ]

  return (
    <div>
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
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* 탭 콘텐츠 */}
      <main className="bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {activeTab === 'platform' && <PlatformContent />}
          {activeTab === 'charter' && <CharterContent />}
          {activeTab === 'rules' && <RulesContent />}
          {activeTab === 'policy' && <PolicyContent />}
        </div>
      </main>
    </div>
  )
}

// 강령
function PlatformContent() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">강령</h1>
      <div className="prose prose-lg max-w-none">
        <p className="text-gray-600 leading-relaxed">
          자유와혁신은 대한민국의 자유민주주의 체제를 수호하고, 시장경제와 법치주의를 기반으로 혁신적 미래를 선도하는 국민의 정당입니다.
        </p>
        <div className="mt-8 space-y-6">
          <div className="bg-gray-50 p-6 rounded-xl">
            <h3 className="text-xl font-bold text-gray-900 mb-3">1. 자유민주주의 수호</h3>
            <p className="text-gray-600">대한민국 헌법 정신에 입각한 자유민주주의 체제를 수호합니다.</p>
          </div>
          <div className="bg-gray-50 p-6 rounded-xl">
            <h3 className="text-xl font-bold text-gray-900 mb-3">2. 법치주의 확립</h3>
            <p className="text-gray-600">법 앞에 모든 국민이 평등한 공정한 사회를 만들어갑니다.</p>
          </div>
          <div className="bg-gray-50 p-6 rounded-xl">
            <h3 className="text-xl font-bold text-gray-900 mb-3">3. 시장경제 발전</h3>
            <p className="text-gray-600">자유로운 경쟁과 혁신을 통해 경제 성장을 이끕니다.</p>
          </div>
          <div className="bg-gray-50 p-6 rounded-xl">
            <h3 className="text-xl font-bold text-gray-900 mb-3">4. 혁신적 미래</h3>
            <p className="text-gray-600">4차 산업혁명을 선도하며 혁신적 미래를 만들어갑니다.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// 당헌
function CharterContent() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">당헌</h1>
      <div className="prose prose-lg max-w-none">
        <div className="bg-gray-50 p-6 rounded-xl mb-6">
          <p className="text-gray-600 text-center">
            당헌 전문은 추후 업데이트 예정입니다.
          </p>
        </div>
        <div className="text-center">
          <a 
            href="/documents/charter.pdf"
            target="_blank"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-colors"
          >
            <i className="fas fa-file-pdf"></i>
            당헌 PDF 다운로드
          </a>
        </div>
      </div>
    </div>
  )
}

// 당규
function RulesContent() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">당규</h1>
      <div className="prose prose-lg max-w-none">
        <div className="bg-gray-50 p-6 rounded-xl mb-6">
          <p className="text-gray-600 text-center">
            당규 전문은 추후 업데이트 예정입니다.
          </p>
        </div>
        <div className="text-center">
          <a 
            href="/documents/rules.pdf"
            target="_blank"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-colors"
          >
            <i className="fas fa-file-pdf"></i>
            당규 PDF 다운로드
          </a>
        </div>
      </div>
    </div>
  )
}

// 정강
function PolicyContent() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">정강</h1>
      <div className="prose prose-lg max-w-none">
        <div className="bg-gray-50 p-6 rounded-xl mb-6">
          <p className="text-gray-600 text-center">
            정강 전문은 추후 업데이트 예정입니다.
          </p>
        </div>
        <div className="text-center">
          <a 
            href="/documents/policy.pdf"
            target="_blank"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-colors"
          >
            <i className="fas fa-file-pdf"></i>
            정강 PDF 다운로드
          </a>
        </div>
      </div>
    </div>
  )
}
