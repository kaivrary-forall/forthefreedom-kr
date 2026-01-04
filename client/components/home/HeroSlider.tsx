'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { getBannersFromProxy, Banner } from '@/lib/api'
import { bannerSlides as fallbackSlides } from '@/data/home-main.ko'

export default function HeroSlider() {
  const [slides, setSlides] = useState<Banner[]>([])
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // 내부 API 프록시에서 배너 로드
  useEffect(() => {
    async function loadBanners() {
      try {
        const { banners, settings } = await getBannersFromProxy()

        if (banners.length > 0) {
          // 활성화된 배너만 필터링
          let filtered = banners.filter(b => b.isActive && b.imageActive !== false)
          
          // 랜덤 순서 설정
          if (settings.randomOrder) {
            filtered = filtered.sort(() => Math.random() - 0.5)
          }
          
          setSlides(filtered)
        } else {
          // API 실패 시 fallback 데이터 사용
          setSlides(fallbackSlides.map((s, i) => ({
            id: String(s.id),
            title: s.title,
            subtitle: s.subtitle,
            imageUrl: s.imageUrl,
            linkUrl: s.linkUrl,
            linkText: s.linkText,
            source: s.source || '',
            order: i,
            isActive: true
          })))
        }
      } catch (error) {
        console.error('배너 로드 실패:', error)
        // fallback
        setSlides(fallbackSlides.map((s, i) => ({
          id: String(s.id),
          title: s.title,
          subtitle: s.subtitle,
          imageUrl: s.imageUrl,
          linkUrl: s.linkUrl,
          linkText: s.linkText,
          source: s.source || '',
          order: i,
          isActive: true
        })))
      } finally {
        setIsLoading(false)
      }
    }
    loadBanners()
  }, [])

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }, [slides.length])

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }, [slides.length])

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  const togglePause = () => {
    setIsPaused(!isPaused)
  }

  // 자동 재생
  useEffect(() => {
    if (isPaused || slides.length <= 1) return

    const interval = setInterval(nextSlide, 5000)
    return () => clearInterval(interval)
  }, [isPaused, nextSlide, slides.length])

  const isExternal = (url: string) => url.startsWith('http')

  // 로딩 스켈레톤
  if (isLoading) {
    return (
      <div className="w-full h-full flex flex-col">
        <div className="relative w-full flex-1 rounded-2xl overflow-hidden bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse" />
      </div>
    )
  }

  // 슬라이드가 없으면 빈 상태
  if (slides.length === 0) {
    return (
      <div className="w-full h-full flex flex-col">
        <div className="relative w-full flex-1 rounded-2xl overflow-hidden bg-gray-100 flex items-center justify-center">
          <p className="text-gray-500">배너를 불러오는 중...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-full flex flex-col">
      {/* 배너 슬라이더 */}
      <div 
        className="relative w-full flex-1 rounded-2xl overflow-hidden"
      >
        {/* 슬라이드 컨테이너 */}
        <div 
          className="flex h-full transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {slides.map((slide) => (
            <div 
              key={slide.id}
              className="min-w-full h-full relative bg-cover bg-center"
              style={{ backgroundImage: `url('${slide.imageUrl}')` }}
            >
              {/* 오버레이 */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-black/10" />
              
              {/* 컨텐츠 */}
              <div className="absolute top-1/2 left-0 -translate-y-1/2 z-10 w-full px-4">
                <div className="max-w-3xl text-white text-left pl-12">
                  {slide.title && (
                    <h1 
                      className="text-xl md:text-2xl lg:text-3xl font-bold mb-3 leading-tight whitespace-pre-line"
                      style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.6)' }}
                    >
                      {slide.title}
                    </h1>
                  )}
                  {slide.subtitle && (
                    <p 
                      className="text-base md:text-lg lg:text-xl mb-6 opacity-90 whitespace-pre-line"
                      style={{ textShadow: '1px 1px 4px rgba(0,0,0,0.6)' }}
                    >
                      {slide.subtitle}
                    </p>
                  )}
                  {slide.linkUrl && (
                    isExternal(slide.linkUrl) ? (
                      <a
                        href={slide.linkUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors"
                      >
                        {slide.linkText || '자세히 보기'}
                      </a>
                    ) : (
                      <Link
                        href={slide.linkUrl}
                        className="inline-block px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors"
                      >
                        {slide.linkText || '자세히 보기'}
                      </Link>
                    )
                  )}
                </div>
              </div>

              {/* 출처 */}
              {slide.source && (
                <div className="absolute bottom-5 right-7 text-white/70 text-xs" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>
                  {slide.source}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 슬라이드 컨트롤 */}
      {slides.length > 1 && (
        <div className="flex items-center justify-center gap-4 py-3">
          <button 
            onClick={prevSlide}
            className="p-2 text-gray-500 hover:text-primary transition-colors"
          >
            <i className="fas fa-chevron-left text-xl"></i>
          </button>
          
          {/* 닷 네비게이션 */}
          <div className="flex gap-2 items-center">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`rounded-full transition-all ${
                  index === currentSlide 
                    ? 'w-3 h-3 bg-primary' 
                    : 'w-2 h-2 bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>

          {/* 일시정지/재생 */}
          <button 
            onClick={togglePause}
            className="p-2 text-gray-500 hover:text-primary transition-colors"
          >
            <i className={`fas ${isPaused ? 'fa-play' : 'fa-pause'} text-lg`}></i>
          </button>

          <button 
            onClick={nextSlide}
            className="p-2 text-gray-500 hover:text-primary transition-colors"
          >
            <i className="fas fa-chevron-right text-xl"></i>
          </button>
        </div>
      )}
    </div>
  )
}
