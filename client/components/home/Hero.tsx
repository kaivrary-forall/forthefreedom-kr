import Link from 'next/link'
import { HeroData } from '@/data/home.ko'

interface HeroProps {
  data: HeroData
  lang?: 'ko' | 'en'
}

export default function Hero({ data, lang = 'ko' }: HeroProps) {
  const linkPrefix = lang === 'en' ? '/en' : ''
  
  return (
    <section 
      className="relative h-[80vh] min-h-[600px] flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url('${data.backgroundImage}')` }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30"></div>
      <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 drop-shadow-lg">
          {data.title}
        </h1>
        <p className="text-xl md:text-2xl text-gray-200 mb-10 drop-shadow">
          {data.subtitle}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href={data.cta.primary.href}
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-4 bg-primary text-white text-lg font-semibold rounded-xl hover:bg-primary-dark transition-colors shadow-lg"
          >
            {data.cta.primary.text}
          </a>
          <Link
            href={`${linkPrefix}${data.cta.secondary.href}`}
            className="px-8 py-4 bg-white/10 backdrop-blur text-white text-lg font-semibold rounded-xl border-2 border-white/50 hover:bg-white/20 transition-colors"
          >
            {data.cta.secondary.text}
          </Link>
        </div>
      </div>
    </section>
  )
}
