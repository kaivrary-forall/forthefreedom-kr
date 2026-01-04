import Image from 'next/image'
import Link from 'next/link'
import { GalleryItem } from '@/data/home.ko'

interface GalleryProps {
  data: GalleryItem[]
  title?: string
  subtitle?: string
  viewAllText?: string
  viewAllHref?: string
  lang?: 'ko' | 'en'
}

export default function Gallery({ 
  data, 
  title = '자유와혁신 활동 현장',
  subtitle = '함께 만들어가는 새로운 정치',
  viewAllText = '포토갤러리',
  viewAllHref = '/news',
  lang = 'ko'
}: GalleryProps) {
  const linkPrefix = lang === 'en' ? '/en' : ''
  
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
            <p className="text-gray-500 mt-1">{subtitle}</p>
          </div>
          <Link 
            href={`${linkPrefix}${viewAllHref}`}
            className="text-primary hover:text-primary-dark font-medium flex items-center gap-1"
          >
            {viewAllText} <i className="fas fa-arrow-right text-sm"></i>
          </Link>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {data.map((item) => (
            <div 
              key={item.id}
              className="relative h-48 md:h-56 rounded-2xl overflow-hidden group"
            >
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <p className="text-white font-bold text-lg">{item.title}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
