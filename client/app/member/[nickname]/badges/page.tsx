'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'

interface Badge {
  _id: string
  name: string
  description: string
  icon: string
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  earnedAt: string
}

interface MemberInfo {
  _id: string
  nickname: string
  profileImage?: string
  memberType?: string
}

// 배지 등급별 스타일
const rarityStyles = {
  common: {
    bg: 'bg-gray-100',
    border: 'border-gray-300',
    text: 'text-gray-600',
    label: '일반',
    glow: ''
  },
  rare: {
    bg: 'bg-blue-50',
    border: 'border-blue-300',
    text: 'text-blue-600',
    label: '희귀',
    glow: 'shadow-blue-200'
  },
  epic: {
    bg: 'bg-purple-50',
    border: 'border-purple-300',
    text: 'text-purple-600',
    label: '영웅',
    glow: 'shadow-purple-200'
  },
  legendary: {
    bg: 'bg-yellow-50',
    border: 'border-yellow-400',
    text: 'text-yellow-600',
    label: '전설',
    glow: 'shadow-yellow-200 shadow-lg'
  }
}

export default function MemberBadgesPage() {
  const params = useParams()
  const nickname = decodeURIComponent(params.nickname as string)
  
  const [member, setMember] = useState<MemberInfo | null>(null)
  const [badges, setBadges] = useState<Badge[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const API_URL = process.env.NEXT_PUBLIC_API_URL || ''

  useEffect(() => {
    const loadBadges = async () => {
      setIsLoading(true)
      setError(null)
      
      try {
        const response = await fetch(`${API_URL}/api/members/nickname/${encodeURIComponent(nickname)}/badges`)
        const data = await response.json()
        
        if (data.success) {
          setMember(data.data.member)
          setBadges(data.data.badges)
        } else {
          setError(data.message || '배지를 불러올 수 없습니다.')
        }
      } catch (err) {
        console.error('배지 로드 실패:', err)
        setError('배지를 불러오는 중 오류가 발생했습니다.')
      } finally {
        setIsLoading(false)
      }
    }

    if (nickname) {
      loadBadges()
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

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 p-4 h-32"></div>
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
          <h1 className="text-2xl font-bold text-gray-900">@{nickname}</h1>
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
        <Link
          href={`/member/${encodeURIComponent(nickname)}/mentions`}
          className="px-4 py-2 text-gray-500 hover:text-gray-700 border-b-2 border-transparent whitespace-nowrap"
        >
          언급된 글
        </Link>
        <span className="px-4 py-2 text-primary font-medium border-b-2 border-primary whitespace-nowrap">
          배지
        </span>
      </div>

      {/* 배지 통계 */}
      <div className="bg-gradient-to-r from-primary/10 to-purple-100 rounded-xl p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900">🏆 배지 컬렉션</h2>
            <p className="text-sm text-gray-600 mt-1">
              총 <span className="font-bold text-primary">{badges.length}</span>개의 배지를 획득했습니다
            </p>
          </div>
          <div className="text-4xl">🎖️</div>
        </div>
      </div>

      {/* 배지 목록 */}
      {badges.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <div className="text-6xl mb-4">🏅</div>
          <p className="text-gray-500 mb-2">아직 획득한 배지가 없습니다.</p>
          <p className="text-sm text-gray-400">활동을 통해 배지를 모아보세요!</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {badges.map((badge) => {
            const style = rarityStyles[badge.rarity] || rarityStyles.common
            return (
              <div
                key={badge._id}
                className={`${style.bg} ${style.glow} border-2 ${style.border} rounded-xl p-4 text-center transition-transform hover:scale-105 cursor-pointer`}
              >
                {/* 배지 아이콘 */}
                <div className="text-4xl mb-2">{badge.icon}</div>
                
                {/* 배지 이름 */}
                <h3 className="font-bold text-gray-900 text-sm mb-1 line-clamp-1">
                  {badge.name}
                </h3>
                
                {/* 등급 */}
                <span className={`inline-block px-2 py-0.5 text-xs rounded-full ${style.bg} ${style.text} border ${style.border}`}>
                  {style.label}
                </span>
                
                {/* 설명 (호버 시 툴팁으로 보여줄 수도 있음) */}
                <p className="text-xs text-gray-500 mt-2 line-clamp-2">
                  {badge.description}
                </p>
                
                {/* 획득일 */}
                <p className="text-xs text-gray-400 mt-2">
                  {formatDate(badge.earnedAt)}
                </p>
              </div>
            )
          })}
        </div>
      )}

      {/* 배지 등급 안내 */}
      <div className="mt-8 bg-white rounded-xl border border-gray-200 p-4">
        <h3 className="font-medium text-gray-900 mb-3">배지 등급 안내</h3>
        <div className="flex flex-wrap gap-3">
          {Object.entries(rarityStyles).map(([key, style]) => (
            <span 
              key={key}
              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm ${style.bg} ${style.text} border ${style.border}`}
            >
              {key === 'common' && '⚪'}
              {key === 'rare' && '🔵'}
              {key === 'epic' && '🟣'}
              {key === 'legendary' && '🟡'}
              {style.label}
            </span>
          ))}
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
