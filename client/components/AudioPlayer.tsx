'use client'

import { useAudio } from '@/contexts/AudioContext'
import { usePathname } from 'next/navigation'

function formatTime(seconds: number): string {
  if (isNaN(seconds)) return '0:00'
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`
}

export default function AudioPlayer() {
  const pathname = usePathname()
  const isEnPage = pathname?.startsWith('/en')
  
  const {
    isPlaying,
    currentTime,
    duration,
    currentTrackIndex,
    playlist,
    toggle,
    next,
    prev,
  } = useAudio()

  const currentTrack = playlist[currentTrackIndex]
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 text-center">
      <p className="text-[10px] font-semibold text-gray-500 mb-2">
        {isEnPage ? 'Freedom & Innovation Party Song' : '자유와혁신 당가'}
      </p>
      
      <div className="flex items-center justify-center gap-2 mb-2">
        <button
          onClick={prev}
          className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
        >
          <i className="fas fa-step-backward text-[10px] text-gray-600"></i>
        </button>
        
        <button
          onClick={toggle}
          className="w-9 h-9 rounded-full bg-primary hover:bg-primary-dark flex items-center justify-center transition-colors"
        >
          <i className={`fas ${isPlaying ? 'fa-pause' : 'fa-play'} text-xs text-white ${!isPlaying ? 'ml-0.5' : ''}`}></i>
        </button>
        
        <button
          onClick={next}
          className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
        >
          <i className="fas fa-step-forward text-[10px] text-gray-600"></i>
        </button>
      </div>
      
      <div>
        <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-[9px] text-gray-400">{formatTime(currentTime)}</span>
          <span className="text-[9px] text-gray-400">{formatTime(duration)}</span>
        </div>
      </div>
    </div>
  )
}
