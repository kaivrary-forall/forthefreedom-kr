'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'

type BoardType = 'member' | 'party' | 'innovation' | 'anonymous'

const boardOptions: { key: BoardType; label: string; description: string; requiredType: string[] }[] = [
  { 
    key: 'member', 
    label: '회원 게시판', 
    description: '회원이면 누구나 작성 가능',
    requiredType: ['member', 'party_member', 'innovation_member', 'admin']
  },
  { 
    key: 'party', 
    label: '당원 게시판', 
    description: '당원만 작성 가능',
    requiredType: ['party_member', 'innovation_member', 'admin']
  },
  { 
    key: 'innovation', 
    label: '혁신당원 게시판', 
    description: '혁신당원만 작성 가능',
    requiredType: ['innovation_member', 'admin']
  },
  { 
    key: 'anonymous', 
    label: '익명 게시판', 
    description: '익명으로 작성 (IP만 공개)',
    requiredType: ['member', 'party_member', 'innovation_member', 'admin']
  },
]

export default function AgoraWriteForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { isLoggedIn, isLoading, token, member } = useAuth()
  
  // URL에서 board 파라미터 가져오기
  const initialBoard = (searchParams.get('board') as BoardType) || 'member'
  
  const [boardType, setBoardType] = useState<BoardType>(initialBoard)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 로그인 체크
  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      router.push(`/login?return=/agora/write?board=${boardType}`)
    }
  }, [isLoggedIn, isLoading, router, boardType])

  // 권한 체크
  const canWriteTo = (board: BoardType): boolean => {
    if (!member) return false
    const memberType = member.memberType || 'member'
    const option = boardOptions.find(o => o.key === board)
    return option?.requiredType.includes(memberType) || false
  }

  // 선택된 게시판에 권한 없으면 첫 번째 가능한 게시판으로 변경
  useEffect(() => {
    if (member && !canWriteTo(boardType)) {
      const firstAvailable = boardOptions.find(o => canWriteTo(o.key))
      if (firstAvailable) {
        setBoardType(firstAvailable.key)
      }
    }
  }, [member])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!title.trim()) {
      setError('제목을 입력해주세요')
      return
    }

    if (!content.trim()) {
      setError('내용을 입력해주세요')
      return
    }

    if (!token) {
      setError('로그인이 필요합니다')
      return
    }

    if (!canWriteTo(boardType)) {
      setError('해당 게시판에 글을 작성할 권한이 없습니다')
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch('/api/agora/write', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: title.trim(),
          content: content.trim(),
          boardType
        })
      })

      const data = await response.json()

      if (data.success) {
        // 작성 성공 - 해당 게시판으로 이동
        router.push('/agora')
      } else {
        setError(data.message || '게시글 작성에 실패했습니다')
      }
    } catch (err) {
      console.error('글쓰기 실패:', err)
      setError('게시글 작성 중 오류가 발생했습니다')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!isLoggedIn) {
    return null
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {/* 헤더 */}
        <div className="p-6 border-b border-gray-100">
          <h1 className="text-2xl font-bold text-gray-900">글쓰기</h1>
          <p className="text-gray-500 mt-1">아고라 게시판에 새 글을 작성합니다</p>
        </div>

        {/* 폼 */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* 게시판 선택 */}
          <div>
            <label className="block font-medium text-gray-700 mb-2">
              게시판 선택 <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              {boardOptions.map((option) => {
                const canWrite = canWriteTo(option.key)
                return (
                  <button
                    key={option.key}
                    type="button"
                    onClick={() => canWrite && setBoardType(option.key)}
                    disabled={!canWrite}
                    className={`p-4 rounded-lg border-2 text-left transition-all ${
                      boardType === option.key
                        ? 'border-primary bg-primary/5'
                        : canWrite
                          ? 'border-gray-200 hover:border-gray-300'
                          : 'border-gray-100 bg-gray-50 opacity-50 cursor-not-allowed'
                    }`}
                  >
                    <div className="font-medium text-gray-900">{option.label}</div>
                    <div className="text-xs text-gray-500 mt-1">{option.description}</div>
                    {!canWrite && (
                      <div className="text-xs text-red-500 mt-1">권한 없음</div>
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          {/* 작성자 정보 */}
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
            {boardType === 'anonymous' ? (
              <>
                <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                  <span className="text-gray-500">🎭</span>
                </div>
                <div>
                  <div className="font-medium text-gray-900">익명</div>
                  <div className="text-sm text-gray-500">IP 주소만 공개됩니다</div>
                </div>
              </>
            ) : (
              <>
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                  {member?.profileImage ? (
                    <img 
                      src={member.profileImage} 
                      alt={member.nickname}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-gray-400">👤</span>
                  )}
                </div>
                <div>
                  <div className="font-medium text-gray-900">{member?.nickname}</div>
                  <div className="text-sm text-gray-500">@{member?.userId}</div>
                </div>
              </>
            )}
          </div>

          {/* 제목 */}
          <div>
            <label className="block font-medium text-gray-700 mb-2">
              제목 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="제목을 입력해주세요"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              disabled={isSubmitting}
              maxLength={100}
            />
            <div className="text-right text-sm text-gray-400 mt-1">
              {title.length}/100
            </div>
          </div>

          {/* 내용 */}
          <div>
            <label className="block font-medium text-gray-700 mb-2">
              내용 <span className="text-red-500">*</span>
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="내용을 입력해주세요"
              rows={12}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg resize-none focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              disabled={isSubmitting}
            />
          </div>

          {/* 익명 게시판 안내 */}
          {boardType === 'anonymous' && (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start gap-2">
                <span className="text-yellow-500">⚠️</span>
                <div className="text-sm text-yellow-800">
                  <p className="font-medium">익명 게시판 안내</p>
                  <p className="mt-1">닉네임 대신 IP 주소 일부가 표시됩니다. 불법적인 내용은 법적 책임을 질 수 있습니다.</p>
                </div>
              </div>
            </div>
          )}

          {/* 에러 메시지 */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
              {error}
            </div>
          )}

          {/* 버튼 */}
          <div className="flex justify-between items-center pt-4 border-t border-gray-100">
            <Link 
              href="/agora"
              className="px-6 py-3 text-gray-600 hover:text-gray-900 transition-colors"
            >
              ← 취소
            </Link>
            <button
              type="submit"
              disabled={isSubmitting || !title.trim() || !content.trim()}
              className="px-8 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? '작성 중...' : '글 등록'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
