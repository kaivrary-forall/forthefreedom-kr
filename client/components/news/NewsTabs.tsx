import Link from 'next/link'

interface NewsTabsProps {
  active: 'all' | 'notices' | 'press-releases' | 'events' | 'gallery' | 'media' | 'card-news' | 'personnel' | 'activities'
}

const tabs = [
  { id: 'all', name: '전체', href: '/news' },
  { id: 'notices', name: '공지', href: '/news/notices' },
  { id: 'events', name: '주요일정', href: '/news/events' },
  { id: 'activities', name: '활동소식', href: '/news/activities' },
  { id: 'media', name: '언론보도', href: '/news/media' },
  { id: 'press-releases', name: '성명', href: '/news/press-releases' },
  { id: 'card-news', name: '카드뉴스', href: '/news/card-news' },
  { id: 'gallery', name: '갤러리', href: '/news/gallery' },
  { id: 'personnel', name: '인사공고', href: '/news/personnel' },
]

export default function NewsTabs({ active }: NewsTabsProps) {
  return (
    <div 
      className="sticky z-30 bg-white border-b border-gray-200 transition-[top] duration-300 ease-in-out"
      style={{ top: 'calc(64px + var(--top-notice-h, 0px))' }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex space-x-0 overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => (
            <Link
              key={tab.id}
              href={tab.href}
              className={`px-6 py-2 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                active === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.name}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  )
}
