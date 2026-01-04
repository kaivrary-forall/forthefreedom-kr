'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Popup {
  _id: string
  title: string
  titleHtml?: string
  subtitle?: string
  subtitleHtml?: string
  contentHtml?: string
  defaultTextColor: string
  bgColor?: string
  bgOpacity?: number
  link?: string
  linkText?: string
  isActive: boolean
  hideHours?: number
  forceShowVersion?: number
}

const STORAGE_KEY = 'popup_hide_info'

export default function EntryPopup() {
  const [popup, setPopup] = useState<Popup | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    async function loadPopup() {
      try {
        const res = await fetch('/api/popup')
        const result = await res.json()
        if (!result.success || !result.data || !result.data.isActive) return

        const popupData = result.data
        const hideHours = popupData.hideHours || 12
        const serverVersion = popupData.forceShowVersion || 1

        const stored = localStorage.getItem(STORAGE_KEY)
        if (stored) {
          try {
            const { hideUntil, version } = JSON.parse(stored)
            if (version !== serverVersion) {
              setPopup(popupData)
              setIsVisible(true)
              return
            }
            if (hideUntil && Date.now() < hideUntil) {
              return
            }
          } catch {}
        }

        setPopup(popupData)
        setIsVisible(true)
      } catch (error) {
        console.error('팝업 로드 실패:', error)
      }
    }
    loadPopup()
  }, [])

  const handleClose = () => {
    if (popup) {
      const hideHours = popup.hideHours || 12
      const hideUntil = Date.now() + (hideHours * 60 * 60 * 1000)
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        hideUntil,
        version: popup.forceShowVersion || 1
      }))
    }
    setIsVisible(false)
  }

  const getBgRgba = () => {
    if (!popup) return 'rgba(31, 41, 55, 0.9)'
    const hex = (popup.bgColor || '#1f2937').replace('#', '')
    const r = parseInt(hex.substring(0, 2), 16)
    const g = parseInt(hex.substring(2, 4), 16)
    const b = parseInt(hex.substring(4, 6), 16)
    const opacity = popup.bgOpacity ?? 0.9
    return `rgba(${r}, ${g}, ${b}, ${opacity})`
  }

  // 콘텐츠 HTML 가져오기 (contentHtml 우선, 없으면 titleHtml + subtitleHtml)
  const getContentHtml = () => {
    if (!popup) return ''
    if (popup.contentHtml) return popup.contentHtml
    // 기존 방식 호환
    const parts = []
    if (popup.titleHtml) parts.push(popup.titleHtml)
    else if (popup.title) parts.push(`<div style="font-size:2rem;font-weight:bold">${popup.title}</div>`)
    if (popup.subtitleHtml) parts.push(popup.subtitleHtml)
    else if (popup.subtitle) parts.push(popup.subtitle)
    return parts.join('<br><br>')
  }

  if (!isVisible || !popup) return null

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center" style={{ backgroundColor: getBgRgba() }}>
      <button 
        onClick={handleClose}
        className="absolute top-6 right-6 hover:opacity-70 text-3xl z-10 transition-opacity"
        style={{ color: popup.defaultTextColor || '#ffffff' }}
        aria-label="닫기"
      >
        ✕
      </button>

      <div className="text-center p-8 max-w-2xl" style={{ color: popup.defaultTextColor || '#ffffff' }}>
        <div dangerouslySetInnerHTML={{ __html: getContentHtml() }} />

        {popup.link && (
          <Link
            href={popup.link}
            onClick={handleClose}
            className="inline-block px-10 py-4 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors text-xl mt-8"
          >
            {popup.linkText || '자세히 보기'}
          </Link>
        )}
      </div>
    </div>
  )
}
