'use client'
import { useState } from 'react'
import AgoraListAPI from '@/components/agora/AgoraListAPI'

type BoardType = 'member' | 'party' | 'innovation' | 'anonymous'

const boardTabs: { key: BoardType; label: string; description: string }[] = [
  { key: 'member', label: '회원 게시판', description: '회원이면 누구나 작성할 수 있습니다' },
  { key: 'party', label: '당원 게시판', description: '당원 이상 작성할 수 있습니다' },
  { key: 'innovation', label: '혁신당원 게시판', description: '혁신당원 이상 작성할 수 있습니다' },
  { key: 'anonymous', label: '익명 게시판', description: '당원들의 익명 공간입니다 (단, IP는 공개됩니다)' },
]

export default function AgoraPage() {
  const [activeBoard, setActiveBoard] = useState<BoardType>('member')

  return (
    <div>
      {/* 탭 네비게이션 */}
      <div 
        className="sticky z-30 bg-white border-b border-gray-200 transition-[top] duration-300 ease-in-out"
        style={{ top: 'calc(64px + var(--top-notice-h, 0px))' }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex justify-center space-x-0 overflow-x-auto scrollbar-hide">
            {boardTabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveBoard(tab.key)}
                className={`px-6 py-2 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                  activeBoard === tab.key
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

      {/* 게시글 목록 */}
      <main className="bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* 선택된 게시판 설명 */}
          <div className="mb-6 flex items-center">
            <span className="text-sm text-gray-400 border-l-2 border-primary pl-3">
              {boardTabs.find(t => t.key === activeBoard)?.description}
            </span>
          </div>
          
          <AgoraListAPI boardType={activeBoard} />
        </div>
      </main>
    </div>
  )
}
