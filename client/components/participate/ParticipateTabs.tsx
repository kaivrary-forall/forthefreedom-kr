import Link from 'next/link'

interface ParticipateTabsProps {
  active: 'participate' | 'join' | 'faq' | 'dues' | 'education'
}

const tabs = [
  { id: 'participate', name: '함께해요', href: '/participate', disabled: false },
  { id: 'join', name: '당원가입', href: '/participate/join', disabled: false },
  { id: 'faq', name: '당원가입 Q&A', href: '/participate/faq', disabled: false },
  { id: 'dues', name: '당비납부 (개발중)', href: '#', disabled: true },
  { id: 'education', name: '당원교육 (개발중)', href: '#', disabled: true },
]

export default function ParticipateTabs({ active }: ParticipateTabsProps) {
  return (
    <div 
      className="sticky z-30 bg-white border-b border-gray-200 transition-[top] duration-300 ease-in-out"
      style={{ top: 'calc(64px + var(--top-notice-h, 0px))' }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex justify-center space-x-0 overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => (
            tab.disabled ? (
              <span
                key={tab.id}
                className="px-6 py-2 text-sm font-medium whitespace-nowrap border-b-2 border-transparent text-gray-300 cursor-not-allowed"
              >
                {tab.name}
              </span>
            ) : (
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
            )
          ))}
        </nav>
      </div>
    </div>
  )
}
