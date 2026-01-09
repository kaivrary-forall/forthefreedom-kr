'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'

interface Comment {
  _id: string
  content: string
  createdAt: string
  post: {
    _id: string
    title: string
  }
}

interface MemberInfo {
  _id: string
  nickname: string
  profileImage?: string
  memberType?: string
}

export default function MemberCommentsPage() {
  const params = useParams()
  const nickname = decodeURIComponent(params.nickname as string)
  
  const [member, setMember] = useState<MemberInfo | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const API_URL = process.env.NEXT_PUBLIC_API_URL || ''

  useEffect(() => {
    const loadComments = async () => {
      setIsLoading(true)
      setError(null)
      
      try {
        const response = await fetch(`${API_URL}/api/members/nickname/${encodeURIComponent(nickname)}/comments?page=${page}&limit=20`)
        const data = await response.json()
        
        if (data.success) {
          setMember(data.data.member)
          setComments(data.data.comments)
          setTotalPages(data.data.pagination?.totalPages || 1)
        } else {
          setError(data.message || '댓글을 불러올 수 없습니다.')
        }
      } catch (err) {
        console.error('댓글 로드 실패:', err)
        setError('댓글을 불러오는 중 오류가 발생했습니다.')
      } finally {
        setIsLoading(false)
      }
    }

    if (nickname) {
      loadComments()
    }
  }, [nickname, page, API_URL])

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 p-4">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
            <span className="text-2xl">😕</span>
          </div>
          <p className="text-lg text-gray-500 mb-6">{error}</p>
          <Link 
            href="/agora"
            className="inline-flex items-center gap-2 text-primary hover:text-primary-dark"
          >
            ← 아고라로 돌아가기
          </Link>
        </div>
      </div>
    )
  }

  // 드롭다운 상태
  const [showDropdown, setShowDropdown] = useState(false)

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* 헤더 */}
      <div className="flex items-center gap-6 mb-6">
        <div className="w-28 h-28 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center border-4 border-white shadow-lg">
          {member?.profileImage ? (
            <img 
              src={member.profileImage} 
              alt={nickname}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-4xl text-gray-400">👤</span>
          )}
        </div>
        <div>
          <div className="flex items-center gap-2 relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="text-2xl font-bold text-gray-900 hover:text-primary transition-colors flex items-center gap-1"
            >
              @{nickname}
              <svg className={`w-5 h-5 transition-transform ${showDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {/* 드롭다운 메뉴 */}
            {showDropdown && (
              <div className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-200 py-2 min-w-[160px] z-50">
                <Link
                  href={`/member/${encodeURIComponent(nickname)}`}
                  className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 text-gray-700"
                  onClick={() => setShowDropdown(false)}
                >
                  <span>👤</span>
                  <span>프로필 보기</span>
                </Link>
                <Link
                  href={`/member/${encodeURIComponent(nickname)}/posts`}
                  className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 text-gray-700"
                  onClick={() => setShowDropdown(false)}
                >
                  <span>📝</span>
                  <span>작성한 글</span>
                </Link>
                <Link
                  href={`/member/${encodeURIComponent(nickname)}/comments`}
                  className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 text-gray-700"
                  onClick={() => setShowDropdown(false)}
                >
                  <span>💬</span>
                  <span>작성한 댓글</span>
                </Link>
                <Link
                  href={`/member/${encodeURIComponent(nickname)}/mentions`}
                  className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 text-gray-700"
                  onClick={() => setShowDropdown(false)}
                >
                  <span>📢</span>
                  <span>언급된 글</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 탭 네비게이션 */}
      <div className="flex border-b border-gray-200 mb-6 overflow-x-auto">
        <Link
          href={`/member/${encodeURIComponent(nickname)}`}
          className="px-4 py-2 text-gray-500 hover:text-gray-700 border-b-2 border-transparent whitespace-nowrap"
        >
          프로필
        </Link>
        <Link
          href={`/member/${encodeURIComponent(nickname)}/posts`}
          className="px-4 py-2 text-gray-500 hover:text-gray-700 border-b-2 border-transparent whitespace-nowrap"
        >
          작성한 글
        </Link>
        <span className="px-4 py-2 text-primary font-medium border-b-2 border-primary whitespace-nowrap">
          작성한 댓글
        </span>
        <Link
          href={`/member/${encodeURIComponent(nickname)}/mentions`}
          className="px-4 py-2 text-gray-500 hover:text-gray-700 border-b-2 border-transparent whitespace-nowrap"
        >
          언급된 글
        </Link>
        <Link
          href={`/member/${encodeURIComponent(nickname)}/badges`}
          className="px-4 py-2 text-gray-500 hover:text-gray-700 border-b-2 border-transparent whitespace-nowrap"
        >
          배지
        </Link>
      </div>

      {/* 댓글 목록 */}
      {comments.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <p className="text-gray-500">작성한 댓글이 없습니다.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {comments.map((comment) => (
            <Link
              key={comment._id}
              href={`/agora/${comment.post?._id}`}
              className="block bg-white rounded-xl border border-gray-200 p-4 hover:border-gray-300 transition-colors"
            >
              {/* 원글 제목 */}
              <div className="text-xs text-gray-500 mb-2">
                📌 {comment.post?.title || '삭제된 게시글'}
              </div>
              
              {/* 댓글 내용 */}
              <p className="text-gray-800 mb-2 line-clamp-2">
                {comment.content}
              </p>
              
              {/* 작성일 */}
              <div className="text-xs text-gray-400">
                {formatDate(comment.createdAt)}
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            이전
          </button>
          <span className="px-4 py-2 text-gray-600">
            {page} / {totalPages}
          </span>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            다음
          </button>
        </div>
      )}

      {/* 뒤로가기 */}
      <div className="mt-8">
        <Link 
          href="/agora"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-primary transition-colors"
        >
          ← 아고라로 돌아가기
        </Link>
      </div>
    </div>
  )
}
