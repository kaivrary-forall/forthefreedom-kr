'use client'
import React, { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

interface Author {
  _id: string
  nickname: string
  userId?: string
  memberType?: string
  profileImage?: string
}

interface CommentType {
  _id: string
  post: string
  author: Author
  content: string
  parentComment?: string | null
  replyToAuthor?: string // 답글 대상 작성자 닉네임
  likes?: string[]
  dislikes?: string[]
  likeCount?: number
  dislikeCount?: number
  isLiked?: boolean
  isDisliked?: boolean
  createdAt?: string
  updatedAt?: string
  replies?: CommentType[]
}

interface Post {
  _id: string
  boardType: string
  author: Author
  title: string
  content: string
  viewCount: number
  likeCount: number
  dislikeCount: number
  commentCount: number
  isLiked?: boolean
  isDisliked?: boolean
  createdAt: string
  updatedAt: string
}

// 날짜 포맷 함수
function formatCommentDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

// 멘션 드롭다운 컴포넌트
function MentionDropdown({ 
  nickname, 
  children,
  className = ''
}: { 
  nickname: string
  children: React.ReactNode
  className?: string
}) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = React.useRef<HTMLDivElement>(null)

  // 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  return (
    <span className={`relative inline-block ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          setIsOpen(!isOpen)
        }}
        className="hover:underline cursor-pointer"
      >
        {children}
      </button>
      
      {isOpen && (
        <div className="absolute left-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[140px] py-1">
          <Link
            href={`/member/${encodeURIComponent(nickname)}`}
            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
            onClick={() => setIsOpen(false)}
          >
            <span>👤</span>
            <span>프로필 보기</span>
          </Link>
          <Link
            href={`/agora?authorNickname=${encodeURIComponent(nickname)}`}
            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
            onClick={() => setIsOpen(false)}
          >
            <span>📝</span>
            <span>작성한 글</span>
          </Link>
          <Link
            href={`/member/${encodeURIComponent(nickname)}/comments`}
            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
            onClick={() => setIsOpen(false)}
          >
            <span>💬</span>
            <span>작성한 댓글</span>
          </Link>
        </div>
      )}
    </span>
  )
}

// @멘션 파싱 함수
function parseMentions(content: string): React.ReactNode[] {
  const mentionRegex = /@([^\s@]+)/g
  const parts: React.ReactNode[] = []
  let lastIndex = 0
  let match

  while ((match = mentionRegex.exec(content)) !== null) {
    // 멘션 앞의 텍스트
    if (match.index > lastIndex) {
      parts.push(content.slice(lastIndex, match.index))
    }
    
    // 멘션을 드롭다운으로 변환
    const nickname = match[1]
    parts.push(
      <MentionDropdown key={`mention-${match.index}`} nickname={nickname}>
        <span className="text-primary font-medium">@{nickname}</span>
      </MentionDropdown>
    )
    
    lastIndex = match.index + match[0].length
  }
  
  // 나머지 텍스트
  if (lastIndex < content.length) {
    parts.push(content.slice(lastIndex))
  }
  
  return parts.length > 0 ? parts : [content]
}

// 댓글 아이템 컴포넌트
function CommentItem({ 
  comment, 
  depth = 0,
  isLoggedIn,
  onVote,
  onReply,
  votingCommentId
}: { 
  comment: CommentType
  depth?: number
  isLoggedIn: boolean
  onVote: (commentId: string, type: 'like' | 'dislike') => void
  onReply: (commentId: string, content: string) => Promise<boolean>
  votingCommentId: string | null
}) {
  const [showReplyForm, setShowReplyForm] = useState(false)
  const [showReplies, setShowReplies] = useState(true)
  const [replyText, setReplyText] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const author = comment.author?.nickname || comment.author?.userId || '익명'
  const profileImage = comment.author?.profileImage || ''
  const timeText = comment.createdAt ? formatCommentDate(comment.createdAt) : ''

  const handleReplySubmit = async () => {
    if (!replyText.trim() || isSubmitting) return
    
    setIsSubmitting(true)
    const success = await onReply(comment._id, replyText)
    setIsSubmitting(false)
    
    if (success) {
      setReplyText('')
      setShowReplyForm(false)
    }
  }

  const canReply = depth < 2
  const hasReplies = comment.replies && comment.replies.length > 0
  const replyCount = comment.replies?.length || 0

  return (
    <div className={`relative ${depth > 0 ? 'ml-12 pl-4' : ''}`}>
      {/* ㄴ자 연결선 */}
      {depth > 0 && (
        <div 
          className="absolute left-0 top-0 w-4 h-6 border-l-2 border-b-2 border-gray-300 rounded-bl-lg"
          style={{ transform: 'translateX(-16px)' }}
        />
      )}
      <div className="flex gap-3 py-2">
        {/* 프로필 이미지 */}
        <div className="w-10 h-10 rounded-full bg-gray-600 overflow-hidden flex items-center justify-center flex-shrink-0">
          {profileImage ? (
            <img
              src={profileImage}
              alt={author}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          ) : (
            <span className="text-gray-300 text-lg">👤</span>
          )}
        </div>

        <div className="flex-1 min-w-0">
          {/* 작성자 & 시간 */}
          <div className="flex items-center gap-2 flex-wrap">
            {comment.replyToAuthor && (
              <>
                <span className="text-sm text-gray-500">to</span>
                <MentionDropdown nickname={comment.replyToAuthor}>
                  <span className="text-sm text-primary">@{comment.replyToAuthor}</span>
                </MentionDropdown>
                <span className="text-gray-400">-</span>
              </>
            )}
            <MentionDropdown nickname={author}>
              <span className="font-medium text-gray-900 text-sm">@{author}</span>
            </MentionDropdown>
            <span className="text-xs text-gray-500">{timeText}</span>
          </div>

          {/* 내용 */}
          <div className="mt-1 text-gray-800 text-sm whitespace-pre-line break-words">
            {parseMentions(comment.content || '')}
          </div>
          
          {/* 액션 버튼들 */}
          <div className="flex items-center gap-1 mt-2">
            {/* 좋아요 */}
            <button
              type="button"
              onClick={() => onVote(comment._id, 'like')}
              disabled={votingCommentId === comment._id}
              className={`flex items-center gap-1 p-1.5 rounded-full hover:bg-gray-100 transition-colors ${
                comment.isLiked ? 'text-primary' : 'text-gray-600'
              } ${votingCommentId === comment._id ? 'opacity-50' : ''}`}
            >
              <span>👍</span>
              <span className="text-xs">{comment.likeCount || 0}</span>
            </button>
            
            {/* 싫어요 */}
            <button
              type="button"
              onClick={() => onVote(comment._id, 'dislike')}
              disabled={votingCommentId === comment._id}
              className={`flex items-center gap-1 p-1.5 rounded-full hover:bg-gray-100 transition-colors ${
                comment.isDisliked ? 'text-red-500' : 'text-gray-600'
              } ${votingCommentId === comment._id ? 'opacity-50' : ''}`}
            >
              <span>👎</span>
              <span className="text-xs">{comment.dislikeCount || 0}</span>
            </button>
            
            {/* 답글 버튼 */}
            {canReply && isLoggedIn && (
              <button
                type="button"
                onClick={() => setShowReplyForm(!showReplyForm)}
                className="ml-2 px-3 py-1 text-xs font-medium text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
              >
                답글
              </button>
            )}
          </div>
          
          {/* 답글 작성 폼 */}
          {showReplyForm && (
            <div className="mt-3 flex gap-3">
              <div className="w-8 h-8 rounded-full bg-gray-400 flex-shrink-0"></div>
              <div className="flex-1">
                <input
                  type="text"
                  className="w-full bg-transparent border-b border-gray-300 focus:border-gray-900 outline-none py-1 text-sm"
                  placeholder={`@${author}님에게 답글 추가...`}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  disabled={isSubmitting}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      handleReplySubmit()
                    }
                  }}
                />
                <div className="flex justify-end gap-2 mt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowReplyForm(false)
                      setReplyText('')
                    }}
                    className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    취소
                  </button>
                  <button
                    type="button"
                    onClick={handleReplySubmit}
                    disabled={isSubmitting || !replyText.trim()}
                    className="px-3 py-1.5 text-sm font-medium bg-primary text-white rounded-full hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isSubmitting ? '작성 중...' : '답글'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 답글 토글 버튼 */}
          {hasReplies && depth === 0 && (
            <button
              type="button"
              onClick={() => setShowReplies(!showReplies)}
              className="flex items-center gap-1 mt-2 px-3 py-1.5 text-sm font-medium text-primary hover:bg-primary/10 rounded-full transition-colors"
            >
              <svg 
                className={`w-4 h-4 transition-transform ${showReplies ? 'rotate-180' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
              {showReplies ? '답글 숨기기' : `답글 ${replyCount}개`}
            </button>
          )}
        </div>
      </div>
      
      {/* 대댓글 목록 */}
      {hasReplies && showReplies && (
        <div className="space-y-1">
          {comment.replies!.map(reply => (
            <CommentItem 
              key={reply._id} 
              comment={reply} 
              depth={depth + 1}
              isLoggedIn={isLoggedIn}
              onVote={onVote}
              onReply={onReply}
              votingCommentId={votingCommentId}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default function AgoraDetailAPI() {
  const params = useParams()
  const id = params.id as string
  const { isLoggedIn, token } = useAuth()
  
  const [post, setPost] = useState<Post | null>(null)
  const [comments, setComments] = useState<CommentType[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // 댓글 작성
  const [commentContent, setCommentContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [commentError, setCommentError] = useState<string | null>(null)
  const [isCommentFocused, setIsCommentFocused] = useState(false)

  // 좋아요/싫어요 상태
  const [isLiked, setIsLiked] = useState(false)
  const [isDisliked, setIsDisliked] = useState(false)
  const [likeCount, setLikeCount] = useState(0)
  const [dislikeCount, setDislikeCount] = useState(0)
  const [isVoting, setIsVoting] = useState(false)

  // 댓글 좋아요/싫어요 로딩 상태
  const [votingCommentId, setVotingCommentId] = useState<string | null>(null)

  const API_URL = process.env.NEXT_PUBLIC_API_URL || ''

  const loadPost = useCallback(async () => {
    if (!id) return
    
    setIsLoading(true)
    setError(null)
    
    try {
      const headers: HeadersInit = {}
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }
      
      const response = await fetch(`/api/agora/${id}`, { headers })
      const data = await response.json()
      
      if (data.success && data.post) {
        setPost(data.post)
        setComments(data.comments || [])
        setLikeCount(data.post.likeCount || 0)
        setDislikeCount(data.post.dislikeCount || 0)
        setIsLiked(data.post.isLiked || false)
        setIsDisliked(data.post.isDisliked || false)
      } else {
        setError(data.error || '게시글을 찾을 수 없습니다.')
      }
    } catch (err) {
      console.error('게시글 로드 실패:', err)
      setError('게시글을 불러오는 중 오류가 발생했습니다.')
    } finally {
      setIsLoading(false)
    }
  }, [id, token])

  useEffect(() => {
    loadPost()
  }, [loadPost])

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('ko-KR', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // 게시글 좋아요/싫어요 핸들러
  const handleVote = async (type: 'like' | 'dislike') => {
    if (!isLoggedIn || !token) {
      alert('로그인이 필요합니다')
      return
    }
    
    if (isVoting) return
    
    setIsVoting(true)
    
    try {
      const response = await fetch(`${API_URL}/api/posts/${id}/${type}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      const data = await response.json()
      
      if (data.success) {
        setLikeCount(data.data.likeCount)
        setDislikeCount(data.data.dislikeCount)
        setIsLiked(data.data.isLiked)
        setIsDisliked(data.data.isDisliked)
      } else {
        alert(data.message || '투표에 실패했습니다')
      }
    } catch (err) {
      console.error('투표 실패:', err)
      alert('투표 중 오류가 발생했습니다')
    } finally {
      setIsVoting(false)
    }
  }

  // 댓글 좋아요/싫어요 핸들러
  const handleCommentVote = useCallback(async (commentId: string, type: 'like' | 'dislike') => {
    if (!isLoggedIn || !token) {
      alert('로그인이 필요합니다')
      return
    }
    
    if (votingCommentId) return
    
    setVotingCommentId(commentId)
    
    try {
      const response = await fetch(`${API_URL}/api/posts/${id}/comments/${commentId}/${type}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      const data = await response.json()
      
      if (data.success) {
        setComments(prev => prev.map(c => {
          if (c._id === commentId) {
            return {
              ...c,
              likeCount: data.data.likeCount,
              dislikeCount: data.data.dislikeCount,
              isLiked: data.data.isLiked,
              isDisliked: data.data.isDisliked
            }
          }
          return c
        }))
      } else {
        alert(data.message || '투표에 실패했습니다')
      }
    } catch (err) {
      console.error('댓글 투표 실패:', err)
      alert('투표 중 오류가 발생했습니다')
    } finally {
      setVotingCommentId(null)
    }
  }, [isLoggedIn, token, votingCommentId, API_URL, id])

  // 댓글 작성 핸들러
  const handleCommentSubmit = async () => {
    if (!commentContent.trim()) {
      setCommentError('댓글 내용을 입력해주세요')
      return
    }

    if (!token) {
      setCommentError('로그인이 필요합니다')
      return
    }

    setIsSubmitting(true)
    setCommentError(null)

    try {
      const response = await fetch(`${API_URL}/api/posts/${id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          content: commentContent.trim(),
          parentCommentId: null
        })
      })

      const data = await response.json()

      if (data.success) {
        setCommentContent('')
        setIsCommentFocused(false)
        await loadPost()
      } else {
        setCommentError(data.message || '댓글 작성에 실패했습니다')
      }
    } catch (err) {
      console.error('댓글 작성 실패:', err)
      setCommentError('댓글 작성 중 오류가 발생했습니다')
    } finally {
      setIsSubmitting(false)
    }
  }

  // 답글 작성 핸들러
  const handleReplySubmit = useCallback(async (parentCommentId: string, content: string): Promise<boolean> => {
    if (!token) {
      alert('로그인이 필요합니다')
      return false
    }

    try {
      const response = await fetch(`${API_URL}/api/posts/${id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          content: content.trim(),
          parentCommentId
        })
      })

      const data = await response.json()

      if (data.success) {
        await loadPost()
        return true
      } else {
        alert(data.message || '답글 작성에 실패했습니다')
        return false
      }
    } catch (err) {
      console.error('답글 작성 실패:', err)
      alert('답글 작성 중 오류가 발생했습니다')
      return false
    }
  }, [token, API_URL, id, loadPost])

  // 댓글을 트리 구조로 정리
  const organizeComments = (allComments: CommentType[]): CommentType[] => {
    const commentMap = new Map<string, CommentType>()
    const rootComments: CommentType[] = []

    allComments.forEach(comment => {
      commentMap.set(comment._id, { ...comment, replies: [] })
    })

    allComments.forEach(comment => {
      const currentComment = commentMap.get(comment._id)!
      if (comment.parentComment) {
        const parentComment = commentMap.get(comment.parentComment)
        if (parentComment) {
          // 부모 댓글 작성자 정보 저장
          currentComment.replyToAuthor = parentComment.author?.nickname || parentComment.author?.userId || '익명'
          parentComment.replies = parentComment.replies || []
          parentComment.replies.push(currentComment)
        } else {
          rootComments.push(currentComment)
        }
      } else {
        rootComments.push(currentComment)
      }
    })

    return rootComments
  }

  const organizedComments = organizeComments(comments)

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/4 mb-8"></div>
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
          <span className="text-2xl">😕</span>
        </div>
        <p className="text-lg text-gray-500 mb-6">{error || '게시글을 찾을 수 없습니다.'}</p>
        <Link 
          href="/agora"
          className="inline-flex items-center gap-2 text-primary hover:text-primary-dark"
        >
          ← 목록으로 돌아가기
        </Link>
      </div>
    )
  }

  return (
    <article className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* 헤더 */}
      <header className="p-6 border-b border-gray-100">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          {post.title}
        </h1>
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            {post.author.profileImage && (
              <img 
                src={post.author.profileImage} 
                alt={post.author.nickname}
                className="w-8 h-8 rounded-full object-cover"
              />
            )}
            <span className="font-medium text-gray-700">{post.author.nickname}</span>
          </div>
          <span>•</span>
          <span>{formatDate(post.createdAt)}</span>
          <span>•</span>
          <span>조회 {post.viewCount}</span>
        </div>
      </header>

      {/* 본문 */}
      <div className="p-6">
        <div 
          className="prose max-w-none text-gray-700"
          style={{ whiteSpace: 'pre-wrap' }}
        >
          {post.content}
        </div>
      </div>

      {/* 좋아요/싫어요 */}
      <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-center gap-6">
        <button 
          type="button"
          onClick={() => handleVote('like')}
          disabled={isVoting}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
            isLiked 
              ? 'border-primary bg-primary/10 text-primary' 
              : 'border-gray-200 hover:bg-gray-50 text-gray-600'
          } ${isVoting ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <span>👍</span>
          <span>{likeCount}</span>
        </button>
        <button 
          type="button"
          onClick={() => handleVote('dislike')}
          disabled={isVoting}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
            isDisliked 
              ? 'border-red-500 bg-red-50 text-red-500' 
              : 'border-gray-200 hover:bg-gray-50 text-gray-600'
          } ${isVoting ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <span>👎</span>
          <span>{dislikeCount}</span>
        </button>
      </div>

      {/* 댓글 섹션 */}
      <section className="px-6 py-6 border-t border-gray-100">
        <h2 className="text-base font-medium text-gray-900 mb-6">
          댓글 {comments.length}개
        </h2>

        {/* 댓글 작성 */}
        {isLoggedIn ? (
          <div className="flex gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-gray-400 flex-shrink-0"></div>
            <div className="flex-1">
              <input
                type="text"
                className="w-full bg-transparent border-b border-gray-300 focus:border-gray-900 outline-none py-1 text-sm"
                placeholder="댓글 추가..."
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
                onFocus={() => setIsCommentFocused(true)}
                disabled={isSubmitting}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleCommentSubmit()
                  }
                }}
              />
              {isCommentFocused && (
                <div className="flex justify-end gap-2 mt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsCommentFocused(false)
                      setCommentContent('')
                    }}
                    className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    취소
                  </button>
                  <button
                    type="button"
                    onClick={handleCommentSubmit}
                    disabled={isSubmitting || !commentContent.trim()}
                    className="px-3 py-1.5 text-sm font-medium bg-primary text-white rounded-full hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isSubmitting ? '작성 중...' : '댓글'}
                  </button>
                </div>
              )}
              {commentError && (
                <p className="text-red-500 text-xs mt-2">{commentError}</p>
              )}
            </div>
          </div>
        ) : (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg text-center">
            <p className="text-sm text-gray-500 mb-2">댓글을 작성하려면 로그인이 필요합니다.</p>
            <Link href="/login" className="text-sm text-primary hover:underline">
              로그인하기 →
            </Link>
          </div>
        )}

        {/* 댓글 목록 */}
        {organizedComments.length === 0 ? (
          <div className="py-8 text-center text-gray-500 text-sm">
            아직 댓글이 없습니다. 첫 번째 댓글을 작성해보세요!
          </div>
        ) : (
          <div className="space-y-1">
            {organizedComments.map((comment) => (
              <CommentItem 
                key={comment._id} 
                comment={comment}
                depth={0}
                isLoggedIn={isLoggedIn}
                onVote={handleCommentVote}
                onReply={handleReplySubmit}
                votingCommentId={votingCommentId}
              />
            ))}
          </div>
        )}
      </section>

      {/* 하단 네비게이션 */}
      <div className="px-6 py-4 border-t border-gray-100 flex justify-between">
        <Link 
          href="/agora"
          className="inline-flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-primary transition-colors"
        >
          ← 목록으로
        </Link>
        {isLoggedIn ? (
          <Link 
            href="/agora/write"
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            글쓰기
          </Link>
        ) : (
          <Link 
            href="/login?return=/agora/write"
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            글쓰기
          </Link>
        )}
      </div>
    </article>
  )
}
