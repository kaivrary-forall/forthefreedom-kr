import Link from 'next/link'

interface SupportTabsProps {
  active: 'guide' | 'receipt'
}

const tabs = [
  { id: 'guide', name: '후원 안내', href: '/support' },
  { id: 'receipt', name: '후원 영수증', href: '/support/receipt' },
]

export default function SupportTabs({ active }: SupportTabsProps) {
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
