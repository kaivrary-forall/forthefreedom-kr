'use client'

import { useState, useEffect, useRef } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import html2canvas from 'html2canvas'

interface PartyCardData {
  name: string
  nickname: string
  profileImage?: string
  memberType: string
  partyMemberNumber: string
  partyJoinedAt: string
  isEligible: boolean
}

export default function PartyMemberCard() {
  const [cardData, setCardData] = useState<PartyCardData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isEligible, setIsEligible] = useState(true)
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchCardData = async () => {
      try {
        const token = localStorage.getItem('memberToken')
        if (!token) {
          setError('로그인이 필요합니다.')
          setIsLoading(false)
          return
        }

        const res = await fetch('/api/members/party-card', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        const data = await res.json()

        if (data.success) {
          setCardData(data.data)
          setIsEligible(true)
        } else {
          if (data.data?.isEligible === false) {
            setIsEligible(false)
          }
          setError(data.message)
        }
      } catch (err) {
        console.error('당원증 조회 실패:', err)
        setError('당원증 정보를 불러올 수 없습니다.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchCardData()
  }, [])

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getMemberTypeLabel = (type: string) => {
    switch (type) {
      case 'party_member': return '당원'
      case 'innovation_member': return '혁신당원'
      case 'admin': return '관리자'
      default: return '회원'
    }
  }

  const getMemberTypeColor = (type: string) => {
    switch (type) {
      case 'innovation_member': return 'from-yellow-500 to-yellow-600'
      case 'admin': return 'from-purple-500 to-purple-600'
      default: return 'from-primary to-red-700'
    }
  }

  const downloadCard = async () => {
    if (!cardRef.current) return
    
    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        backgroundColor: null
      })
      
      const link = document.createElement('a')
      link.download = `자유와혁신_당원증_${cardData?.name}.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
    } catch (err) {
      console.error('이미지 다운로드 실패:', err)
      alert('이미지 다운로드에 실패했습니다.')
    }
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-48 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  // 당원 등급 미달
  if (!isEligible) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <i className="fas fa-id-card text-primary"></i>
          당원증
        </h3>
        <div className="bg-gray-50 rounded-xl p-6 text-center">
          <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
            <i className="fas fa-lock text-2xl text-gray-400"></i>
          </div>
          <p className="text-gray-600 mb-4">당원 등급 이상만 당원증을 발급받을 수 있습니다.</p>
          <a
            href="https://www.ihappynanum.com/Nanum/api/screen/F7FCRIO2E3"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors"
          >
            <i className="fas fa-user-plus"></i>
            당원가입 하기
          </a>
        </div>
      </div>
    )
  }

  if (error || !cardData) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <i className="fas fa-id-card text-primary"></i>
          당원증
        </h3>
        <div className="bg-red-50 rounded-xl p-4 text-center">
          <p className="text-red-600">{error || '당원증을 불러올 수 없습니다.'}</p>
        </div>
      </div>
    )
  }

  const profileUrl = `https://forthefreedom.kr/member/${encodeURIComponent(cardData.nickname)}`

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <i className="fas fa-id-card text-primary"></i>
          당원증
        </h3>
        <button
          onClick={downloadCard}
          className="text-sm text-primary hover:text-primary-dark flex items-center gap-1"
        >
          <i className="fas fa-download"></i>
          이미지 저장
        </button>
      </div>

      {/* 당원증 카드 */}
      <div 
        ref={cardRef}
        className={`relative bg-gradient-to-br ${getMemberTypeColor(cardData.memberType)} rounded-2xl p-6 text-white overflow-hidden`}
        style={{ aspectRatio: '1.6/1' }}
      >
        {/* 배경 패턴 */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full translate-y-1/2 -translate-x-1/2"></div>
        </div>

        {/* 상단: 당명 + 로고 */}
        <div className="relative flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <img 
              src="/images/logo-white.png" 
              alt="자유와혁신" 
              className="h-8 w-auto"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none'
              }}
            />
            <div>
              <p className="text-xs opacity-80">FREEDOM & INNOVATION</p>
              <p className="text-lg font-bold">자유와혁신</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs opacity-80">등급</p>
            <p className="text-lg font-bold">{getMemberTypeLabel(cardData.memberType)}</p>
          </div>
        </div>

        {/* 중앙: 프로필 + 정보 */}
        <div className="relative flex items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-white/20 overflow-hidden border-2 border-white/50 flex-shrink-0">
            {cardData.profileImage ? (
              <img 
                src={cardData.profileImage} 
                alt={cardData.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-3xl">
                👤
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-2xl font-bold truncate">{cardData.name}</p>
            <p className="text-sm opacity-80">@{cardData.nickname}</p>
            <p className="text-xs opacity-70 mt-1">
              가입일: {formatDate(cardData.partyJoinedAt)}
            </p>
          </div>
          {/* QR 코드 */}
          <div className="flex-shrink-0 bg-white p-1.5 rounded-lg">
            <QRCodeSVG 
              value={profileUrl}
              size={56}
              level="M"
            />
          </div>
        </div>

        {/* 하단: 당원번호 */}
        <div className="relative mt-4 pt-3 border-t border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs opacity-70">당원번호</p>
              <p className="text-sm font-mono font-bold tracking-wider">{cardData.partyMemberNumber}</p>
            </div>
            <div className="text-right text-xs opacity-70">
              <p>본 당원증은 자유와혁신 공식 발급입니다</p>
            </div>
          </div>
        </div>
      </div>

      <p className="text-xs text-gray-500 text-center mt-3">
        QR코드를 스캔하면 프로필 페이지로 이동합니다
      </p>
    </div>
  )
}
