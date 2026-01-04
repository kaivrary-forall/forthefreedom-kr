import Link from 'next/link'
import { ParticipationCard } from '@/data/home.ko'

interface ParticipationProps {
  data: ParticipationCard[]
  title?: string
  subtitle?: string
  lang?: 'ko' | 'en'
}

export default function Participation({ 
  data, 
  title = '자유와혁신 참여 안내',
  subtitle = '자유와혁신의 가치에 공감하신다면 누구나 다양한 방법으로 참여하실 수 있습니다',
  lang = 'ko'
}: ParticipationProps) {
  const linkPrefix = lang === 'en' ? '/en' : ''
  
  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          <p className="text-gray-500 mt-1">{subtitle}</p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {data.map((card) => {
            const CardWrapper = card.external ? 'a' : Link
            const cardProps = card.external 
              ? { href: card.href, target: '_blank', rel: 'noopener noreferrer' }
              : { href: `${linkPrefix}${card.href}` }
            
            return (
              <CardWrapper
                key={card.id}
                {...cardProps}
                className="text-center p-6 border border-gray-200 rounded-2xl hover:border-primary hover:shadow-lg transition-all duration-300 block"
              >
                <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center mx-auto mb-4">
                  <i className={`fas ${card.icon} text-white text-2xl`}></i>
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-2">{card.title}</h4>
                <p className="text-gray-600 text-sm mb-4">{card.description}</p>
                <span className="text-primary font-medium">{card.linkText} →</span>
              </CardWrapper>
            )
          })}
        </div>
      </div>
    </section>
  )
}
