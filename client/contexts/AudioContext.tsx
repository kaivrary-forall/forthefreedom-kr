'use client'

import React, { createContext, useContext, useRef, useState, useEffect, useCallback } from 'react'

interface Track {
  title: string
  titleEn: string
  src: string
}

interface AudioContextType {
  isPlaying: boolean
  currentTime: number
  duration: number
  volume: number
  currentTrackIndex: number
  playlist: Track[]
  play: () => void
  pause: () => void
  toggle: () => void
  next: () => void
  prev: () => void
  seek: (time: number) => void
  setVolume: (vol: number) => void
}

const AudioContext = createContext<AudioContextType | null>(null)

export function useAudio() {
  const context = useContext(AudioContext)
  if (!context) {
    throw new Error('useAudio must be used within AudioProvider')
  }
  return context
}

const defaultPlaylist: Track[] = [
  { title: '자유와혁신 당가', titleEn: 'Freedom & Innovation', src: '/audio/party-song.mp3' }
]

const STORAGE_KEY = 'ff-audio-state'
const GLOBAL_AUDIO_KEY = '__FF_GLOBAL_AUDIO__'

interface StoredState {
  trackIndex: number
  currentTime: number
  volume: number
  wasPlaying: boolean
  unlocked: boolean
}

function loadStoredState(): StoredState | null {
  if (typeof window === 'undefined') return null
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : null
  } catch {
    return null
  }
}

function saveState(state: Partial<StoredState>) {
  if (typeof window === 'undefined') return
  try {
    const current = loadStoredState() || { trackIndex: 0, currentTime: 0, volume: 0.7, wasPlaying: false, unlocked: false }
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...current, ...state }))
  } catch {}
}

// 전역 싱글톤 Audio 객체 가져오기/생성
function getGlobalAudio(): HTMLAudioElement {
  if (typeof window === 'undefined') return null as any
  
  // 이미 전역 Audio가 있으면 재사용
  if ((window as any)[GLOBAL_AUDIO_KEY]) {
    return (window as any)[GLOBAL_AUDIO_KEY]
  }
  
  // 없으면 새로 생성
  const audio = new Audio()
  ;(window as any)[GLOBAL_AUDIO_KEY] = audio
  return audio
}

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const isInitializedRef = useRef(false)
  const currentTrackIndexRef = useRef(0)
  const isPlayingRef = useRef(false)
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const listenersAttachedRef = useRef(false)

  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolumeState] = useState(0.7)
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0)

  // ref 미러링
  useEffect(() => {
    currentTrackIndexRef.current = currentTrackIndex
  }, [currentTrackIndex])

  useEffect(() => {
    isPlayingRef.current = isPlaying
  }, [isPlaying])

  // 오디오 초기화
  useEffect(() => {
    if (typeof window === 'undefined') return

    // 전역 싱글톤 Audio 가져오기
    const audio = getGlobalAudio()
    audioRef.current = audio

    // 저장된 상태 복원
    const stored = loadStoredState()
    const initialTrackIndex = stored?.trackIndex ?? 0
    const initialVolume = stored?.volume ?? 0.7
    const initialTime = stored?.currentTime ?? 0
    const wasUnlocked = stored?.unlocked ?? false

    setCurrentTrackIndex(initialTrackIndex)
    setVolumeState(initialVolume)
    currentTrackIndexRef.current = initialTrackIndex

    // 현재 재생 상태 동기화
    setIsPlaying(!audio.paused)
    isPlayingRef.current = !audio.paused
    setCurrentTime(audio.currentTime)
    setDuration(audio.duration || 0)

    // 첫 초기화가 아니면 (언어 전환 등) 리스너만 재연결
    if (isInitializedRef.current) {
      // 이미 초기화된 경우 - 상태만 동기화
      return
    }

    isInitializedRef.current = true

    // 오디오 소스 설정 (첫 초기화 시에만)
    if (!audio.src || audio.src === '') {
      audio.volume = initialVolume
      audio.src = defaultPlaylist[initialTrackIndex]?.src || defaultPlaylist[0].src
      audio.preload = 'metadata'
    }

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime)
      
      if (!saveTimeoutRef.current) {
        saveTimeoutRef.current = setTimeout(() => {
          saveState({ currentTime: audio.currentTime })
          saveTimeoutRef.current = null
        }, 1000)
      }
    }

    const handleLoadedMetadata = () => {
      setDuration(audio.duration)
      if (initialTime > 0 && initialTime < audio.duration && audio.currentTime === 0) {
        audio.currentTime = initialTime
      }
    }

    const handleEnded = () => {
      const nextIndex = (currentTrackIndexRef.current + 1) % defaultPlaylist.length
      currentTrackIndexRef.current = nextIndex
      setCurrentTrackIndex(nextIndex)
      audio.src = defaultPlaylist[nextIndex].src
      saveState({ trackIndex: nextIndex, currentTime: 0 })
      audio.play().catch(() => {})
    }

    const handlePlay = () => {
      setIsPlaying(true)
      isPlayingRef.current = true
      saveState({ wasPlaying: true, unlocked: true })
    }

    const handlePause = () => {
      setIsPlaying(false)
      isPlayingRef.current = false
      saveState({ wasPlaying: false, currentTime: audio.currentTime })
    }

    // 리스너가 이미 붙어있지 않으면 추가
    if (!listenersAttachedRef.current) {
      audio.addEventListener('timeupdate', handleTimeUpdate)
      audio.addEventListener('loadedmetadata', handleLoadedMetadata)
      audio.addEventListener('ended', handleEnded)
      audio.addEventListener('play', handlePlay)
      audio.addEventListener('pause', handlePause)
      listenersAttachedRef.current = true
    }

    const handleBeforeUnload = () => {
      saveState({
        trackIndex: currentTrackIndexRef.current,
        currentTime: audio.currentTime,
        volume: audio.volume,
        wasPlaying: isPlayingRef.current
      })
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    window.addEventListener('pagehide', handleBeforeUnload)

    // 이전에 재생 중이었고 unlocked 상태면 자동 재생 시도
    if (stored?.wasPlaying && wasUnlocked && audio.paused) {
      audio.play().catch(() => {})
    }

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
      window.removeEventListener('pagehide', handleBeforeUnload)
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }
      // 리스너는 제거하지 않음 - 전역 Audio는 유지
    }
  }, [])

  const play = useCallback(() => {
    audioRef.current?.play().catch(console.error)
  }, [])

  const pause = useCallback(() => {
    audioRef.current?.pause()
  }, [])

  const toggle = useCallback(() => {
    if (audioRef.current?.paused) {
      play()
    } else {
      pause()
    }
  }, [play, pause])

  const next = useCallback(() => {
    const nextIndex = (currentTrackIndexRef.current + 1) % defaultPlaylist.length
    currentTrackIndexRef.current = nextIndex
    setCurrentTrackIndex(nextIndex)
    if (audioRef.current) {
      audioRef.current.src = defaultPlaylist[nextIndex].src
      saveState({ trackIndex: nextIndex, currentTime: 0 })
      if (isPlayingRef.current) {
        audioRef.current.play().catch(() => {})
      }
    }
  }, [])

  const prev = useCallback(() => {
    if (audioRef.current && audioRef.current.currentTime > 3) {
      audioRef.current.currentTime = 0
      saveState({ currentTime: 0 })
    } else {
      const prevIndex = currentTrackIndexRef.current === 0 
        ? defaultPlaylist.length - 1 
        : currentTrackIndexRef.current - 1
      currentTrackIndexRef.current = prevIndex
      setCurrentTrackIndex(prevIndex)
      if (audioRef.current) {
        audioRef.current.src = defaultPlaylist[prevIndex].src
        saveState({ trackIndex: prevIndex, currentTime: 0 })
        if (isPlayingRef.current) {
          audioRef.current.play().catch(() => {})
        }
      }
    }
  }, [])

  const seek = useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time
      saveState({ currentTime: time })
    }
  }, [])

  const setVolume = useCallback((vol: number) => {
    setVolumeState(vol)
    if (audioRef.current) {
      audioRef.current.volume = vol
    }
    saveState({ volume: vol })
  }, [])

  return (
    <AudioContext.Provider
      value={{
        isPlaying,
        currentTime,
        duration,
        volume,
        currentTrackIndex,
        playlist: defaultPlaylist,
        play,
        pause,
        toggle,
        next,
        prev,
        seek,
        setVolume,
      }}
    >
      {children}
    </AudioContext.Provider>
  )
}
