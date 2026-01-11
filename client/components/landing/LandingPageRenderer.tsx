'use client'

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
  const imageUrl = data.imageUrl as string
  const youtubeUrl = data.youtubeUrl as string
  const title = data.title as string
  const subtitle = data.subtitle as string
  const overlay = data.overlay as boolean
  const height = (data.height as string) || '300px'
  
  const youtubeId = extractYoutubeId(youtubeUrl)

  return (
    <div 
      className="relative w-full overflow-hidden flex items-center justify-center"
      style={{ 
        backgroundImage: !youtubeId && imageUrl ? `url(${imageUrl})` : undefined,
        backgroundColor: !youtubeId && !imageUrl ? '#1a1a1a' : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height 
      }}
    >
      {/* 유튜브 배경 영상 */}
      {youtubeId && (
        <div className="absolute inset-0 overflow-hidden">
          <iframe
            src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&mute=1&loop=1&playlist=${youtubeId}&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1&enablejsapi=1`}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            style={{
              width: '200%',
              height: '200%',
              minWidth: '100%',
              minHeight: '100%',
            }}
            allow="autoplay; encrypted-media"
            allowFullScreen
          />
        </div>
      )}
      
      {/* 오버레이 */}
      {overlay && <div className="absolute inset-0 bg-black/40"></div>}
      
      {/* 텍스트 콘텐츠 */}
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
