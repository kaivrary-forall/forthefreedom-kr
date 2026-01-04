'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import AudioPlayer from './AudioPlayer'

export default function SideBannerLeft() {
  const pathname = usePathname()
  const isEnPage = pathname?.startsWith('/en')
  const [days, setDays] = useState(1)
  const [labelText, setLabelText] = useState('')

  useEffect(() => {
    const foundingDate = new Date('2025-06-06T00:00:00+09:00')
    const today = new Date()
    const calculatedDays = Math.floor((today.getTime() - foundingDate.getTime()) / (1000 * 60 * 60 * 24)) + 1
    setDays(Math.max(1, calculatedDays))
    setLabelText(isEnPage ? 'Our Journey' : '자유와혁신의 발걸음')
  }, [isEnPage])

  const numStr = String(days).padStart(4, '0')

  return (
    <div 
      className="fixed z-40 hidden xl:flex flex-col gap-3 w-[140px] transition-[top] duration-200 ease-out"
      style={{ 
        left: 'calc(50% - 576px - 16px - 140px)',
        top: 'calc(88px + var(--top-notice-h, 0px))'
      }}
    >
      {/* 태극기 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 flex items-center justify-center">
        <img 
          src="/images/taegeukgi.svg" 
          alt={isEnPage ? 'Flag of South Korea' : '대한민국 국기'}
          className="w-full h-auto"
        />
      </div>

      {/* 일수 카운터 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 text-center">
        <p className="text-[10px] font-semibold text-gray-500 mb-2">{labelText}</p>
        <div className="flex justify-center gap-0.5 mb-1">
          {numStr.split('').map((digit, i) => (
            <span
              key={i}
              className="w-6 h-8 bg-gray-900 text-white text-sm font-bold rounded flex items-center justify-center"
            >
              {digit}
            </span>
          ))}
        </div>
        <p className="text-[11px] text-gray-400">{isEnPage ? 'days' : '일째'}</p>
      </div>

      {/* 오디오 플레이어 */}
      <AudioPlayer />
    </div>
  )
}
