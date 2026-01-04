import Link from 'next/link'

interface SideCard {
  id: number
  category: string
  title: string
  content?: string
  link: string
  isPinned?: boolean
}

interface HomeSideWidgetsProps {
  cards: SideCard[]
}

export default function HomeSideWidgets({ cards }: HomeSideWidgetsProps) {
  return (
    <div 
      className="side-cards-area hidden lg:flex"
      style={{ flex: 3, flexDirection: 'column', minWidth: 0 }}
    >
      <div className="flex flex-col gap-3 h-full">
        {cards.map((card) => (
          <Link
            key={card.id}
            href={card.link}
            className="flex-1 bg-white rounded-xl p-4 border border-gray-200 hover:border-primary hover:shadow-md hover:-translate-y-0.5 transition-all flex flex-col justify-center overflow-hidden"
          >
            <div className="text-xs font-semibold text-primary mb-1.5 uppercase">
              {card.category}
              {card.isPinned && ' 📌'}
            </div>
            <div className="text-sm font-semibold text-gray-900 mb-1 truncate">
              {card.title}
            </div>
            {card.content && (
              <div className="text-xs text-gray-500 line-clamp-2">
                {card.content}
              </div>
            )}
          </Link>
        ))}
      </div>
    </div>
  )
}
