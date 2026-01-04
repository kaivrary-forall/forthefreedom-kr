'use client'

import { useState, useEffect, useRef, useLayoutEffect } from 'react'
import Link from 'next/link'

interface Announcement {
  _id: string
  text: string
  link?: string
  linkText?: string
  bgColor: string
  textColor: string
  isActive: boolean
  hideHours?: number
  forceShowVersion?: number
}

const STORAGE_KEY = 'announcement_hide_info'

export default function TopNoticeBar() {
  const [announcement, setAnnouncement] = useState<Announcement | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const barRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    async function loadAnnouncement() {
      try {
        const res = await fetch('/api/announcement')
        const result = await res.json()
        if (!result.success || !result.data || !result.data.isActive) {
          setIsLoading(false)
          return
        }

        const data = result.data
        const hideHours = data.hideHours || 6
        const serverVersion = data.forceShowVersion || 1

        // localStorage에서 숨김 정보 확인
        const stored = localStorage.getItem(STORAGE_KEY)
        if (stored) {
          try {
            const { hideUntil, version } = JSON.parse(stored)
            // 버전이 다르면 (관리자가 강제 표시함) 바로 표시
            if (version !== serverVersion) {
              setAnnouncement(data)
              setIsVisible(true)
              setIsLoading(false)
              return
            }
            // 아직 숨김 시간 안 지났으면 표시 안 함
            if (hideUntil && Date.now() < hideUntil) {
              setIsLoading(false)
              return
            }
          } catch {}
        }

        setAnnouncement(data)
        setIsVisible(true)
      } catch (error) {
        console.error('공지 로드 실패:', error)
      } finally {
        setIsLoading(false)
      }
    }
    loadAnnouncement()
  }, [])

  // CSS 변수 + 클래스 토글
  useLayoutEffect(() => {
    const root = document.documentElement
    
    if (announcement && isVisible && barRef.current) {
      const height = barRef.current.offsetHeight
      root.style.setProperty('--top-notice-h', `${height}px`)
      root.classList.add('has-top-notice')
    } else {
      root.style.setProperty('--top-notice-h', '0px')
      root.classList.remove('has-top-notice')
    }
    
    return () => {
      root.style.setProperty('--top-notice-h', '0px')
      root.classList.remove('has-top-notice')
    }
  }, [announcement, isVisible])

  const handleClose = () => {
    if (announcement) {
      const hideHours = announcement.hideHours || 6
      const hideUntil = Date.now() + (hideHours * 60 * 60 * 1000)
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        hideUntil,
        version: announcement.forceShowVersion || 1
      }))
    }
    setIsVisible(false)
  }

  if (isLoading || !announcement || !isVisible) return null

  return (
    <div 
      ref={barRef}
      className="fixed top-0 left-0 right-0 z-[60] py-2 px-4 text-center text-sm"
      style={{ backgroundColor: announcement.bgColor, color: announcement.textColor }}
    >
      <div className="max-w-6xl mx-auto flex items-center justify-center gap-3 pr-12">
        <span>{announcement.text}</span>
        {announcement.link && (
          <Link 
            href={announcement.link}
            className="underline hover:no-underline font-medium whitespace-nowrap"
            style={{ color: announcement.textColor }}
          >
            {announcement.linkText || '자세히 보기'}
          </Link>
        )}
      </div>
      <div className="absolute right-4 top-1/2 -translate-y-1/2">
        <button 
          onClick={handleClose}
          className="hover:opacity-70 text-lg"
          style={{ color: announcement.textColor }}
          aria-label="닫기"
        >
          ✕
        </button>
      </div>
    </div>
  )
}
