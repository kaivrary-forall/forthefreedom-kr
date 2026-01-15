import Link from 'next/link'

interface AboutTabsProps {
  active: 'message' | 'founding' | 'principles' | 'ci' | 'location'
}

const tabs = [
  { id: 'message', name: '당대표 인사', href: '/about/message' },
  { id: 'founding', name: '창당 스토리', href: '/about/founding' },
  { id: 'principles', name: '강령, 당헌, 당규, 정강', href: '/about/principles' },
  { id: 'ci', name: 'CI', href: '/about/ci' },
  { id: 'location', name: '찾아오시는길', href: '/about/location' },
]

export default function AboutTabs({ active }: AboutTabsProps) {
  return (
    <div 
      className="sticky z-30 bg-white border-b border-gray-200 transition-[top] duration-300 ease-in-out"
      style={{ top: 'calc(64px + var(--top-notice-h, 0px))' }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex justify-center space-x-0 overflow-x-auto scrollbar-hide">
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
