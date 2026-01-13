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
    <section className="bg-gray-50 border-b">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex gap-2 py-4 overflow-x-auto">
          {tabs.map((tab) => (
            <Link
              key={tab.id}
              href={tab.href}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                active === tab.id
                  ? 'bg-primary text-white'
                  : 'text-gray-600 hover:bg-gray-200'
              }`}
            >
              {tab.name}
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
