'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'

interface Author {
  _id: string
  nickname: string
  profileImage?: string
  memberType?: string
}

interface MentionPost {
  type: 'post'
  _id: string
  title: string
  content: string
  author: Author
  boardType?: string
  viewCount?: number
  likeCount?: number
  commentCount?: number
  createdAt: string
}

interface MentionComment {
  type: 'comment'
  _id: string
  content: string
  author: Author
  post: {
    _id: string
    title: string
  }
  createdAt: string
}

type Mention = MentionPost | MentionComment

interface MemberInfo {
  _id: string
  nickname: string
  profileImage?: string
  memberType?: string
}

export default function MemberMentionsPage() {
  const params = useParams()
  const nickname = decodeURIComponent(params.nickname as string)
  
  const [member, setMember] = useState<MemberInfo | null>(null)
  const [mentions, setMentions] = useState<Mention[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const API_URL = process.env.NEXT_PUBLIC_API_URL || ''

  useEffect(() => {
    const loadMentions = async () => {
      setIsLoading(true)
      setError(null)
      
      try {
        const response = await fetch(`${API_URL}/api/members/nickname/${encodeURIComponent(nickname)}/mentions?page=${page}&limit=20`)
        const data = await response.json()
        
        if (data.success) {
          setMember(data.data.member)
          setMentions(data.data.mentions)
          setTotalPages(data.data.pagination?.totalPages || 1)
        } else {
          setError(data.message || '언급된 글을 불러올 수 없습니다.')
        }
      } catch (err) {
        console.error('언급된 글 로드 실패:', err)
        setError('언급된 글을 불러오는 중 오류가 발생했습니다.')
      } finally {
        setIsLoading(false)
      }
    }

    if (nickname) {
      loadMentions()
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

  // @닉네임 하이라이트
  const highlightMention = (content: string) => {
    const regex = new RegExp(`(@${nickname})`, 'gi')
    const parts = content.split(regex)
    
    return parts.map((part, index) => {
      if (part.toLowerCase() === `@${nickname.toLowerCase()}`) {
        return (
          <span key={index} className="bg-yellow-200 text-yellow-800 font-medium px-0.5 rounded">
            {part}
          </span>
        )
      }
      return part
    })
  }

  // 내용 미리보기 (150자)
  const truncateContent = (content: string, maxLength = 150) => {
    if (content.length <= maxLength) return content
    return content.slice(0, maxLength) + '...'
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

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* 헤더 */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center">
          {member?.profileImage ? (
            <img 
              src={member.profileImage} 
              alt={nickname}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-2xl text-gray-400">👤</span>
          )}
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">@{nickname}</h1>
          <p className="text-gray-500">언급된 글</p>
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
        <Link
          href={`/member/${encodeURIComponent(nickname)}/comments`}
          className="px-4 py-2 text-gray-500 hover:text-gray-700 border-b-2 border-transparent whitespace-nowrap"
        >
          작성한 댓글
        </Link>
        <span className="px-4 py-2 text-primary font-medium border-b-2 border-primary whitespace-nowrap">
          언급된 글
        </span>
        <Link
          href={`/member/${encodeURIComponent(nickname)}/badges`}
          className="px-4 py-2 text-gray-500 hover:text-gray-700 border-b-2 border-transparent whitespace-nowrap"
        >
          배지
        </Link>
      </div>

      {/* 언급된 글 목록 */}
      {mentions.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <p className="text-gray-500">언급된 글이 없습니다.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {mentions.map((mention) => (
            <Link
              key={`${mention.type}-${mention._id}`}
              href={mention.type === 'post' ? `/agora/${mention._id}` : `/agora/${(mention as MentionComment).post?._id}`}
              className="block bg-white rounded-xl border border-gray-200 p-4 hover:border-gray-300 transition-colors"
            >
              {/* 타입 뱃지 */}
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  mention.type === 'post' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'bg-green-100 text-green-700'
                }`}>
                  {mention.type === 'post' ? '📝 게시글' : '💬 댓글'}
                </span>
                <span className="text-xs text-gray-500">
                  {mention.author?.nickname || '익명'}님이 언급
                </span>
              </div>

              {/* 게시글인 경우 제목 표시 */}
              {mention.type === 'post' && (
                <h3 className="font-medium text-gray-900 mb-1">
                  {(mention as MentionPost).title}
                </h3>
              )}

              {/* 댓글인 경우 원글 제목 표시 */}
              {mention.type === 'comment' && (
                <div className="text-xs text-gray-500 mb-1">
                  📌 {(mention as MentionComment).post?.title || '삭제된 게시글'}
                </div>
              )}
              
              {/* 내용 (멘션 하이라이트) */}
              <p className="text-gray-700 text-sm mb-2 line-clamp-2">
                {highlightMention(truncateContent(mention.content))}
              </p>
              
              {/* 메타 정보 */}
              <div className="flex items-center gap-3 text-xs text-gray-400">
                <span>{formatDate(mention.createdAt)}</span>
                {mention.type === 'post' && (
                  <>
                    <span>조회 {(mention as MentionPost).viewCount || 0}</span>
                    <span>👍 {(mention as MentionPost).likeCount || 0}</span>
                    <span>💬 {(mention as MentionPost).commentCount || 0}</span>
                  </>
                )}
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
