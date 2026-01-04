'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'

export default function AgoraWriteForm() {
  const router = useRouter()
  const { isLoggedIn, isLoading, token, member } = useAuth()
  
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 로그인 체크
  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      router.push('/login?return=/agora/write')
    }
  }, [isLoggedIn, isLoading, router])

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
          boardType: 'member'
        })
      })

      const data = await response.json()

      if (data.success) {
        // 작성 성공 - 목록으로 이동
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
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* 헤더 */}
      <div className="p-6 border-b border-gray-100">
        <h1 className="text-2xl font-bold text-gray-900">글쓰기</h1>
        <p className="text-gray-500 mt-1">아고라 게시판에 새 글을 작성합니다</p>
      </div>

      {/* 폼 */}
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* 작성자 정보 */}
        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
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
  )
}
