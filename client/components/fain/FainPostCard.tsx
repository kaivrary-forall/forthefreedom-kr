'use client'

import { useState } from 'react'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { ko } from 'date-fns/locale'

interface Author {
  _id: string
  nickname: string
  profileImage?: string
  memberType?: string
}

interface Post {
  _id: string
  author: Author
  content: string
  images?: string[]
  likeCount: number
  repostCount: number
  replyCount: number
  viewCount: number
  createdAt: string
  isLiked?: boolean
  isReposted?: boolean
  isBookmarked?: boolean
  isOwner?: boolean
  repostOf?: Post
}

interface FainPostCardProps {
  post: Post
  onLike?: (postId: string) => void
  onRepost?: (postId: string) => void
  onBookmark?: (postId: string) => void
  onDelete?: (postId: string) => void
}

export default function FainPostCard({ post, onLike, onRepost, onBookmark, onDelete }: FainPostCardProps) {
  const [isLiked, setIsLiked] = useState(post.isLiked || false)
  const [likeCount, setLikeCount] = useState(post.likeCount || 0)
  const [isReposted, setIsReposted] = useState(post.isReposted || false)
  const [repostCount, setRepostCount] = useState(post.repostCount || 0)
  const [isBookmarked, setIsBookmarked] = useState(post.isBookmarked || false)
  const [showMenu, setShowMenu] = useState(false)

  const formatDate = (dateStr: string) => {
    try {
      return formatDistanceToNow(new Date(dateStr), { addSuffix: true, locale: ko })
    } catch {
      return dateStr
    }
  }

  const handleLike = async () => {
    setIsLiked(!isLiked)
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1)
    onLike?.(post._id)
  }

  const handleRepost = async () => {
    setIsReposted(!isReposted)
    setRepostCount(prev => isReposted ? prev - 1 : prev + 1)
    onRepost?.(post._id)
  }

  const handleBookmark = async () => {
    setIsBookmarked(!isBookmarked)
    onBookmark?.(post._id)
  }

  // 리포스트인 경우 원본 표시
  const displayPost = post.repostOf || post
  const isRepostType = !!post.repostOf

  return (
    <article className="bg-white border-b border-gray-200 hover:bg-gray-50/50 transition-colors">
      {/* 리포스트 표시 */}
      {isRepostType && (
        <div className="px-4 pt-3 flex items-center gap-2 text-sm text-gray-500">
          <i className="fas fa-retweet"></i>
          <span>{post.author.nickname}님이 리포스트했습니다</span>
        </div>
      )}

      <div className="px-4 py-3">
        <div className="flex gap-3">
          {/* 프로필 이미지 */}
          <Link href={`/fain/profile/${displayPost.author.nickname}`} className="flex-shrink-0">
            <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden">
              {displayPost.author.profileImage ? (
                <img
                  src={displayPost.author.profileImage}
                  alt={displayPost.author.nickname}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <i className="fas fa-user text-xl"></i>
                </div>
              )}
            </div>
          </Link>

          {/* 콘텐츠 */}
          <div className="flex-1 min-w-0">
            {/* 헤더 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 min-w-0">
                <Link
                  href={`/fain/profile/${displayPost.author.nickname}`}
                  className="font-bold text-gray-900 hover:underline truncate"
                >
                  {displayPost.author.nickname}
                </Link>
                <span className="text-gray-500 text-sm">·</span>
                <span className="text-gray-500 text-sm flex-shrink-0">
                  {formatDate(displayPost.createdAt)}
                </span>
              </div>

              {/* 더보기 메뉴 */}
              <div className="relative">
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <i className="fas fa-ellipsis-h"></i>
                </button>

                {showMenu && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)}></div>
                    <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-20 py-1 min-w-[150px]">
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(`${window.location.origin}/fain/${post._id}`)
                          setShowMenu(false)
                        }}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2"
                      >
                        <i className="fas fa-link"></i>
                        링크 복사
                      </button>
                      {post.isOwner && (
                        <button
                          onClick={() => {
                            onDelete?.(post._id)
                            setShowMenu(false)
                          }}
                          className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                        >
                          <i className="fas fa-trash"></i>
                          삭제
                        </button>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* 본문 */}
            <Link href={`/fain/${post._id}`}>
              <p className="text-gray-900 mt-1 whitespace-pre-wrap break-words">
                {displayPost.content}
              </p>

              {/* 이미지 */}
              {displayPost.images && displayPost.images.length > 0 && (
                <div className={`mt-3 grid gap-2 ${
                  displayPost.images.length === 1 ? 'grid-cols-1' :
                  displayPost.images.length === 2 ? 'grid-cols-2' :
                  displayPost.images.length === 3 ? 'grid-cols-2' :
                  'grid-cols-2'
                }`}>
                  {displayPost.images.slice(0, 4).map((img, idx) => (
                    <div
                      key={idx}
                      className={`rounded-xl overflow-hidden bg-gray-100 ${
                        displayPost.images!.length === 3 && idx === 0 ? 'row-span-2' : ''
                      }`}
                    >
                      <img
                        src={img}
                        alt=""
                        className="w-full h-full object-cover max-h-[300px]"
                      />
                    </div>
                  ))}
                </div>
              )}
            </Link>

            {/* 액션 버튼들 */}
            <div className="flex items-center justify-between mt-3 max-w-md">
              {/* 답글 */}
              <Link
                href={`/fain/${post._id}`}
                className="flex items-center gap-2 text-gray-500 hover:text-primary group"
              >
                <div className="p-2 rounded-full group-hover:bg-primary/10 transition-colors">
                  <i className="far fa-comment"></i>
                </div>
                <span className="text-sm">{post.replyCount || 0}</span>
              </Link>

              {/* 리포스트 */}
              <button
                onClick={handleRepost}
                className={`flex items-center gap-2 group ${
                  isReposted ? 'text-green-500' : 'text-gray-500 hover:text-green-500'
                }`}
              >
                <div className="p-2 rounded-full group-hover:bg-green-500/10 transition-colors">
                  <i className="fas fa-retweet"></i>
                </div>
                <span className="text-sm">{repostCount}</span>
              </button>

              {/* 좋아요 */}
              <button
                onClick={handleLike}
                className={`flex items-center gap-2 group ${
                  isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
                }`}
              >
                <div className="p-2 rounded-full group-hover:bg-red-500/10 transition-colors">
                  <i className={`${isLiked ? 'fas' : 'far'} fa-heart`}></i>
                </div>
                <span className="text-sm">{likeCount}</span>
              </button>

              {/* 북마크 */}
              <button
                onClick={handleBookmark}
                className={`flex items-center gap-2 group ${
                  isBookmarked ? 'text-primary' : 'text-gray-500 hover:text-primary'
                }`}
              >
                <div className="p-2 rounded-full group-hover:bg-primary/10 transition-colors">
                  <i className={`${isBookmarked ? 'fas' : 'far'} fa-bookmark`}></i>
                </div>
              </button>

              {/* 공유 */}
              <button
                onClick={() => {
                  navigator.clipboard.writeText(`${window.location.origin}/fain/${post._id}`)
                }}
                className="flex items-center gap-2 text-gray-500 hover:text-primary group"
              >
                <div className="p-2 rounded-full group-hover:bg-primary/10 transition-colors">
                  <i className="fas fa-share"></i>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}
