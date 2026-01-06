'use client'

import { useState } from 'react'
import AgoraListAPI from '@/components/agora/AgoraListAPI'

type BoardType = 'member' | 'party' | 'innovation' | 'anonymous'

const boardTabs: { key: BoardType; label: string; description: string; icon: string }[] = [
  { key: 'member', label: '회원 게시판', description: '회원이면 누구나 작성할 수 있습니다', icon: '👥' },
  { key: 'party', label: '당원 게시판', description: '당원만 작성할 수 있습니다', icon: '🏛️' },
  { key: 'innovation', label: '혁신당원 게시판', description: '혁신당원만 작성할 수 있습니다', icon: '⭐' },
  { key: 'anonymous', label: '익명 게시판', description: '당원 이상만 익명으로 작성할 수 있습니다 (IP 공개)', icon: '🎭' },
]

export default function AgoraPage() {
  const [activeBoard, setActiveBoard] = useState<BoardType>('member')

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* 페이지 헤더 */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">아고라</h1>
        <p className="text-gray-500 mt-1">자유롭게 의견을 나누는 공간</p>
      </div>

      {/* 게시판 탭 */}
      <div className="bg-white rounded-xl border border-gray-200 mb-6">
        <div className="flex overflow-x-auto">
          {boardTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveBoard(tab.key)}
              className={`flex-1 min-w-[140px] px-4 py-4 text-center transition-colors border-b-2 ${
                activeBoard === tab.key
                  ? 'border-primary text-primary bg-primary/5'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <span className="text-xl mb-1 block">{tab.icon}</span>
              <span className="font-medium text-sm whitespace-nowrap">{tab.label}</span>
            </button>
          ))}
        </div>
        
        {/* 선택된 게시판 설명 */}
        <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
          <p className="text-sm text-gray-600 text-center">
            {boardTabs.find(t => t.key === activeBoard)?.description}
          </p>
        </div>
      </div>

      {/* 게시글 목록 */}
      <AgoraListAPI boardType={activeBoard} />
    </div>
  )
}
