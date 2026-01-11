'use client'

import { useState, useRef } from 'react'

interface LandingPageData {
  _id: string
  slug: string
  title: string
  blocks: Block[]
  settings: {
    backgroundColor?: string
    fontFamily?: string
  }
}

interface Block {
  id: string
  type: string
  data: Record<string, unknown>
}

export default function LandingPageRenderer({ page }: { page: LandingPageData }) {
  const { blocks, settings } = page

  return (
    <div 
      className="min-h-screen w-full max-w-[430px] mx-auto"
      style={{ 
        backgroundColor: settings?.backgroundColor || '#ffffff',
        fontFamily: settings?.fontFamily || 'inherit'
      }}
    >
      {blocks.map((block) => (
        <BlockRenderer key={block.id} block={block} />
      ))}
    </div>
  )
}

function BlockRenderer({ block }: { block: Block }) {
  const { type, data } = block

  switch (type) {
    case 'hero':
      return <HeroBlock data={data} />
    case 'text':
      return <TextBlock data={data} />
    case 'image':
      return <ImageBlock data={data} />
    case 'button':
      return <ButtonBlock data={data} />
    case 'video':
      return <VideoBlock data={data} />
    case 'divider':
      return <DividerBlock data={data} />
    case 'contact':
      return <ContactBlock data={data} />
    case 'sns':
      return <SNSBlock data={data} />
    case 'gallery':
      return <GalleryBlock data={data} />
    case 'spacer':
      return <SpacerBlock data={data} />
    default:
      return null
  }
}

// 유튜브 URL에서 ID 추출 함수
function extractYoutubeId(url: string): string | null {
  if (!url) return null
  
  // 이미 ID만 있는 경우
  if (/^[a-zA-Z0-9_-]{11}$/.test(url)) {
    return url
  }
  
  // 다양한 유튜브 URL 형식 처리
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
  ]
  
  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) return match[1]
  }
  
  return null
}

// 히어로 블록
function HeroBlock({ data }: { data: Record<string, unknown> }) {
  const [isMuted, setIsMuted] = useState(true)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  
  const imageUrl = data.imageUrl as string
  const youtubeUrl = data.youtubeUrl as string
  const title = data.title as string
  const subtitle = data.subtitle as string
  const overlay = data.overlay as boolean
  const height = (data.height as string) || '300px'
  const videoRatio = (data.videoRatio as string) || '16:9'
  
  const youtubeId = extractYoutubeId(youtubeUrl)

  // 비율에 따른 padding-bottom 계산 (가로 100% 기준)
  const getPaddingBottom = (ratio: string) => {
    switch (ratio) {
      case '16:9': return '56.25%'    // 9/16 * 100
      case '9:16': return '177.78%'   // 16/9 * 100
      case '4:5': return '125%'       // 5/4 * 100
      case '1:1': return '100%'
      default: return '56.25%'
    }
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  // 유튜브 영상이 있는 경우
  if (youtubeId) {
    return (
      <div className="relative w-full">
        {/* 비율 유지 컨테이너 */}
        <div 
          className="relative w-full overflow-hidden"
          style={{ paddingBottom: getPaddingBottom(videoRatio) }}
        >
          {/* 유튜브 iframe */}
          <iframe
            ref={iframeRef}
            src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&mute=${isMuted ? 1 : 0}&loop=1&playlist=${youtubeId}&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1&enablejsapi=1`}
            className="absolute inset-0 w-full h-full"
            style={{ border: 'none' }}
            allow="autoplay; encrypted-media"
            allowFullScreen
          />
          
          {/* 오버레이 */}
          {overlay && <div className="absolute inset-0 bg-black/40 z-10 pointer-events-none"></div>}
          
          {/* 음소거 토글 버튼 */}
          <button
            onClick={toggleMute}
            className="absolute bottom-4 right-4 z-30 w-10 h-10 bg-black/60 hover:bg-black/80 text-white rounded-full flex items-center justify-center transition-colors"
            aria-label={isMuted ? '소리 켜기' : '소리 끄기'}
          >
            {isMuted ? (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
              </svg>
            )}
          </button>
          
          {/* 텍스트 콘텐츠 */}
          {(title || subtitle) && (
            <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
              <div className="text-center text-white px-4">
                {title && <h1 className="text-2xl font-bold mb-2 drop-shadow-lg">{title}</h1>}
                {subtitle && <p className="text-base opacity-90 drop-shadow">{subtitle}</p>}
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  // 이미지 또는 기본 배경인 경우
  return (
    <div 
      className="relative w-full overflow-hidden flex items-center justify-center"
      style={{ 
        backgroundImage: imageUrl ? `url(${imageUrl})` : undefined,
        backgroundColor: !imageUrl ? '#1a1a1a' : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height
      }}
    >
      {overlay && <div className="absolute inset-0 bg-black/40"></div>}
      
      <div className="relative z-10 text-center text-white px-4">
        {title && <h1 className="text-2xl font-bold mb-2 drop-shadow-lg">{title}</h1>}
        {subtitle && <p className="text-base opacity-90 drop-shadow">{subtitle}</p>}
      </div>
    </div>
  )
}

// 텍스트 블록
function TextBlock({ data }: { data: Record<string, unknown> }) {
  const title = data.title as string
  const content = data.content as string
  const align = (data.align as string) || 'left'
  const bgColor = data.bgColor as string
  const textColor = data.textColor as string

  return (
    <div 
      className="px-5 py-6"
      style={{ backgroundColor: bgColor, color: textColor, textAlign: align as 'left' | 'center' | 'right' }}
    >
      {title && <h2 className="text-xl font-bold mb-3">{title}</h2>}
      {content && (
        <div 
          className="text-base leading-relaxed whitespace-pre-wrap"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      )}
    </div>
  )
}

// 이미지 블록
function ImageBlock({ data }: { data: Record<string, unknown> }) {
  const imageUrl = data.imageUrl as string
  const caption = data.caption as string
  const fullWidth = data.fullWidth as boolean

  if (!imageUrl) return null

  return (
    <div className={fullWidth ? '' : 'px-5 py-4'}>
      <img 
        src={imageUrl} 
        alt={caption || ''} 
        className="w-full h-auto"
      />
      {caption && (
        <p className="text-sm text-gray-500 mt-2 text-center">{caption}</p>
      )}
    </div>
  )
}

// 버튼 블록
function ButtonBlock({ data }: { data: Record<string, unknown> }) {
  const text = data.text as string
  const url = data.url as string
  const style = (data.style as string) || 'primary'
  const icon = data.icon as string
  const action = (data.action as string) || 'link'

  const baseClasses = "w-full py-4 px-6 rounded-xl font-semibold text-center flex items-center justify-center gap-2 transition-all active:scale-95"
  
  const styleClasses = {
    primary: 'bg-primary text-white',
    secondary: 'bg-gray-800 text-white',
    outline: 'border-2 border-primary text-primary bg-white',
    white: 'bg-white text-gray-800 shadow-lg',
    kakao: 'bg-[#FEE500] text-[#191919]',
    naver: 'bg-[#03C75A] text-white',
  }

  const href = action === 'tel' ? `tel:${url}` : url

  return (
    <div className="px-5 py-3">
      <a 
        href={href}
        target={action === 'link' ? '_blank' : undefined}
        rel="noopener noreferrer"
        className={`${baseClasses} ${styleClasses[style as keyof typeof styleClasses] || styleClasses.primary}`}
      >
        {icon && <i className={icon}></i>}
        {text || '버튼'}
      </a>
    </div>
  )
}

// 영상 블록
function VideoBlock({ data }: { data: Record<string, unknown> }) {
  const videoUrl = data.videoUrl as string
  const youtubeId = data.youtubeId as string

  if (youtubeId) {
    return (
      <div className="w-full aspect-video">
        <iframe
          src={`https://www.youtube.com/embed/${youtubeId}`}
          className="w-full h-full"
          allowFullScreen
        />
      </div>
    )
  }

  if (videoUrl) {
    return (
      <div className="w-full">
        <video src={videoUrl} controls className="w-full" />
      </div>
    )
  }

  return null
}

// 구분선 블록
function DividerBlock({ data }: { data: Record<string, unknown> }) {
  const style = (data.style as string) || 'line'
  const color = (data.color as string) || '#e5e5e5'

  if (style === 'space') {
    return <div className="h-8"></div>
  }

  if (style === 'dots') {
    return (
      <div className="flex justify-center gap-2 py-6">
        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }}></span>
        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }}></span>
        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }}></span>
      </div>
    )
  }

  return (
    <div className="px-5 py-4">
      <hr style={{ borderColor: color }} />
    </div>
  )
}

// 연락처 블록
function ContactBlock({ data }: { data: Record<string, unknown> }) {
  const phone = data.phone as string
  const email = data.email as string
  const address = data.address as string
  const title = data.title as string

  return (
    <div className="px-5 py-6 bg-gray-50">
      {title && <h3 className="font-bold text-lg mb-4">{title}</h3>}
      <div className="space-y-3">
        {phone && (
          <a href={`tel:${phone}`} className="flex items-center gap-3 text-gray-700">
            <i className="fas fa-phone text-primary w-5"></i>
            <span>{phone}</span>
          </a>
        )}
        {email && (
          <a href={`mailto:${email}`} className="flex items-center gap-3 text-gray-700">
            <i className="fas fa-envelope text-primary w-5"></i>
            <span>{email}</span>
          </a>
        )}
        {address && (
          <div className="flex items-start gap-3 text-gray-700">
            <i className="fas fa-map-marker-alt text-primary w-5 mt-1"></i>
            <span>{address}</span>
          </div>
        )}
      </div>
    </div>
  )
}

// SNS 블록
function SNSBlock({ data }: { data: Record<string, unknown> }) {
  const links = data.links as Array<{ platform: string; url: string }>
  
  const platformIcons: Record<string, { icon: string; color: string }> = {
    instagram: { icon: 'fab fa-instagram', color: '#E4405F' },
    facebook: { icon: 'fab fa-facebook', color: '#1877F2' },
    youtube: { icon: 'fab fa-youtube', color: '#FF0000' },
    twitter: { icon: 'fab fa-x-twitter', color: '#000000' },
    kakao: { icon: 'fas fa-comment', color: '#FEE500' },
    naver: { icon: 'fas fa-n', color: '#03C75A' },
    threads: { icon: 'fab fa-threads', color: '#000000' },
  }

  if (!links || links.length === 0) return null

  return (
    <div className="px-5 py-6">
      <div className="flex justify-center gap-4">
        {links.map((link, idx) => {
          const platform = platformIcons[link.platform] || { icon: 'fas fa-link', color: '#666' }
          return (
            <a
              key={idx}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-full flex items-center justify-center text-white text-xl"
              style={{ backgroundColor: platform.color }}
            >
              <i className={platform.icon}></i>
            </a>
          )
        })}
      </div>
    </div>
  )
}

// 갤러리 블록
function GalleryBlock({ data }: { data: Record<string, unknown> }) {
  const images = data.images as string[]
  const columns = (data.columns as number) || 2

  if (!images || images.length === 0) return null

  return (
    <div className="px-5 py-4">
      <div 
        className="grid gap-2"
        style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
      >
        {images.map((img, idx) => (
          <img 
            key={idx} 
            src={img} 
            alt="" 
            className="w-full aspect-square object-cover rounded-lg"
          />
        ))}
      </div>
    </div>
  )
}

// 여백 블록
function SpacerBlock({ data }: { data: Record<string, unknown> }) {
  const height = (data.height as number) || 20
  return <div style={{ height: `${height}px` }}></div>
}
