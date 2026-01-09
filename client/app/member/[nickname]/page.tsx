'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'

interface MemberProfile {
  _id: string
  nickname: string
  userId?: string
  profileImage?: string
  memberType?: string
  bio?: string
  createdAt?: string
}

interface ProfileData {
  member: MemberProfile
  postCount: number
  commentCount: number
  followerCount: number
  followingCount: number
  isMyProfile: boolean
  isFollowing: boolean
}

export default function MemberProfilePage() {
  const params = useParams()
  const nickname = decodeURIComponent(params.nickname as string)
  
  const [profileData, setProfileData] = useState<ProfileData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const API_URL = process.env.NEXT_PUBLIC_API_URL || ''

  useEffect(() => {
    const loadProfile = async () => {
      setIsLoading(true)
      setError(null)
      
      try {
        const response = await fetch(`${API_URL}/api/members/nickname/${encodeURIComponent(nickname)}`)
        const data = await response.json()
        
        if (data.success) {
          setProfileData(data.data)
        } else {
          setError(data.message || '프로필을 불러올 수 없습니다.')
        }
      } catch (err) {
        console.error('프로필 로드 실패:', err)
        setError('프로필을 불러오는 중 오류가 발생했습니다.')
      } finally {
        setIsLoading(false)
      }
    }

    if (nickname) {
      loadProfile()
    }
  }, [nickname, API_URL])

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const getMemberTypeBadge = (memberType?: string) => {
    switch (memberType) {
      case 'admin':
        return <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded-full">관리자</span>
      case 'vip':
        return <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs rounded-full">VIP</span>
      case 'verified':
        return <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">인증됨</span>
      default:
        return null
    }
  }

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
            <div>
              <div className="h-6 bg-gray-200 rounded w-32 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-20"></div>
            </div>
          </div>
          <div className="h-10 bg-gray-200 rounded w-full mb-6"></div>
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !profileData) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
            <span className="text-2xl">😕</span>
          </div>
          <p className="text-lg text-gray-500 mb-6">{error || '프로필을 찾을 수 없습니다.'}</p>
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

  const { member, postCount, commentCount, followerCount, followingCount } = profileData

  // 드롭다운 상태
  const [showDropdown, setShowDropdown] = useState(false)

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* 헤더 */}
      <div className="flex items-center gap-6 mb-6">
        <div className="w-28 h-28 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center border-4 border-white shadow-lg">
          {member.profileImage ? (
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
            {getMemberTypeBadge(member.memberType)}
            
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
        <span className="px-4 py-2 text-primary font-medium border-b-2 border-primary whitespace-nowrap">
          프로필
        </span>
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

      {/* 프로필 정보 카드 */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {/* 자기소개 */}
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-sm font-medium text-gray-500 mb-2">자기소개</h2>
          <p className="text-gray-800">
            {member.bio || '자기소개가 없습니다.'}
          </p>
        </div>

        {/* 활동 통계 */}
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-sm font-medium text-gray-500 mb-4">활동</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Link 
              href={`/member/${encodeURIComponent(nickname)}/posts`}
              className="text-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="text-2xl font-bold text-gray-900">{postCount}</div>
              <div className="text-sm text-gray-500">작성한 글</div>
            </Link>
            <Link 
              href={`/member/${encodeURIComponent(nickname)}/comments`}
              className="text-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="text-2xl font-bold text-gray-900">{commentCount}</div>
              <div className="text-sm text-gray-500">작성한 댓글</div>
            </Link>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">{followerCount}</div>
              <div className="text-sm text-gray-500">팔로워</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">{followingCount}</div>
              <div className="text-sm text-gray-500">팔로잉</div>
            </div>
          </div>
        </div>

        {/* 가입 정보 */}
        <div className="p-6">
          <h2 className="text-sm font-medium text-gray-500 mb-2">가입일</h2>
          <p className="text-gray-800">
            {member.createdAt ? formatDate(member.createdAt) : '알 수 없음'}
          </p>
        </div>
      </div>

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
