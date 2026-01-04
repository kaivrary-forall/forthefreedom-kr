import { ValueCard } from '@/data/home.ko'

interface ValueCardsProps {
  data: ValueCard[]
  title?: string
  subtitle?: string
}

export default function ValueCards({ data, title, subtitle }: ValueCardsProps) {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {(title || subtitle) && (
          <div className="text-center mb-12">
            {title && <h2 className="text-3xl font-bold text-gray-900 mb-4">{title}</h2>}
            {subtitle && <p className="text-lg text-gray-600">{subtitle}</p>}
          </div>
        )}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {data.map((card) => (
            <div 
              key={card.id}
              className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition-shadow text-center"
            >
              <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center mx-auto mb-6">
                <i className={`fas ${card.icon} text-white text-2xl`}></i>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{card.title}</h3>
              <p className="text-gray-600">{card.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
